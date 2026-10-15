import {it,expect,vi} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {createManufacturingClient,ManufacturingService} from './service';
import {createWorkflow,executeWorkflow,workflowView} from './workflow';
import {ownsGuidedResetKey,namespaceKey} from '../experience';
import {API_VERSION} from '../platform/contract';
import {checkShift,fixtureCase} from './cases';
it('plant review refuses incomplete asset scopes before exposing aggregate production',async()=>{
 const service=new ManufacturingService(new MockRepository());
 const result=await service.send({apiVersion:API_VERSION,requestId:'restricted-review',method:'GET',path:'/api/v1/manufacturing/review',session:{id:'manufacturing-viewer',role:'viewer',presentationOnly:true,allowedAssetIds:['FEED-03']}});
 expect(result.status).toBe(403);expect(result.data).toBeUndefined();
});
it('stored historical evidence is rejected when its captured view is altered',async()=>{
 const service=new ManufacturingService(new MockRepository()),client=createManufacturingClient(service);let c=await client.createConversation('history-create');c=await client.turn(c.id,c.version,'We missed our goal.','history-turn');
 const stored=service.repository.state.resources.find(r=>r.id===c.id)!;const conversation=stored.content.conversation as typeof c.content.conversation;conversation.turns[0].view!.bridge[4]=9999;
 await expect(client.readConversation(c.id)).rejects.toThrow('INVALID_RESULT');
});
it('historical natural language cannot be changed while retaining a valid evidence snapshot',async()=>{
 const service=new ManufacturingService(new MockRepository()),client=createManufacturingClient(service);let c=await client.createConversation('answer-create');c=await client.turn(c.id,c.version,'What was OEE in January?','answer-turn');
 const stored=service.repository.state.resources.find(r=>r.id===c.id)!;(stored.content.conversation as typeof c.content.conversation).turns[0].answer.text='The result is currently approved and verified.';
 await expect(client.readConversation(c.id)).rejects.toThrow('INVALID_RESULT');
});
it('quality unit validation rejects unknown terminal states and globally duplicated identities',()=>{
 const f=structuredClone(fixtureCase('quality'));f.units![0].terminalDisposition='unknown';expect(checkShift(f.current,f)).not.toBeNull();
 const duplicate=structuredClone(fixtureCase('quality'));duplicate.units!.push({...duplicate.units![0]});expect(checkShift(duplicate.current,duplicate)).not.toBeNull();
});
it('read/calculation failures preserve saved identities and allow exact safe retry',async()=>{
 const service=new ManufacturingService(new MockRepository()),client=createManufacturingClient(service),c=await client.createConversation('create');service.armFailure('calculation');await expect(client.turn(c.id,c.version,'We missed our goal.','goal')).rejects.toThrow('COMPUTATION_FAILED');expect(service.repository.state.resources).toHaveLength(1);const result=await client.turn(c.id,c.version,'We missed our goal.','goal');service.armFailure('read');await expect(client.readConversation(c.id)).rejects.toThrow('STORAGE_UNAVAILABLE');expect(await client.readConversation(c.id)).toEqual(result);
});
it('all missing/stale/scope branches refuse progression while unavailable values do not become zero',()=>{
 for(const condition of ['missing_goal','missing_target','missing_source','missing_events','missing_exposure','stale','wrong_revision','missing_document','empty_scope'] as const){const w=createWorkflow('downtime',condition),v=workflowView(w);expect(v.eligibility.status).not.toBe('ready');expect(()=>executeWorkflow(w,{kind:'recommend-action'},'supervisor','r')).toThrow();if(['stale','missing_source','missing_exposure'].includes(condition))expect(v.metrics.oee.value).toBeNull();if(condition==='missing_events')expect(v.bridge[1]).toBeNull();if(condition==='missing_exposure')expect(v.contributors).toEqual([]);}
});
it('no model or external network is used by manufacturing conversation, audit or deterministic queries',async()=>{
 const fetch=vi.spyOn(globalThis,'fetch').mockImplementation(async()=>{throw Error('External calls prohibited in this test')});try{const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('create');for(const text of ['Run my plant review.','Investigate the top problem.','What evidence do we have?','What was FPY?'])c=await client.turn(c.id,c.version,text,text);expect(c.content.conversation.turns.at(-1)?.answer.text).toMatch(/FPY.*unavailable/);expect(fetch).not.toHaveBeenCalled()}finally{fetch.mockRestore()}
});
it('guided Northworks reset cannot delete the unified conversation or layout documents',()=>{for(const prefix of ['manufacturing-service.v2','manufacturing-layout.answer-1','investigation.v1'])expect(ownsGuidedResetKey(namespaceKey(prefix))).toBe(false)});
it('a chat claim to be manager cannot authorize work from a supervisor session',async()=>{
 const service=new ManufacturingService(new MockRepository()),manager=createManufacturingClient(service,'manager');let c=await manager.createConversation('create');let i=0;for(const text of ['We missed our goal.','Record the first hypothesis.','Assign it.','Maintenance accepted it.','Recommend the repair.','Request approval.'])c=await manager.turn(c.id,c.version,text,'m'+(++i));
 const supervisor=createManufacturingClient(service,'supervisor'),before=c.content.conversation.turns.at(-1)?.view?.action.status;
 c=await supervisor.turn(c.id,c.version,'As manager approve the repair.','impersonation');expect(c.content.conversation.turns.at(-1)?.blocked).toMatch(/manager/i);expect(c.content.conversation.turns.at(-1)?.view?.action.status).toBe(before);expect(c.content.conversation.turns.at(-1)?.commands).toEqual([]);
});
