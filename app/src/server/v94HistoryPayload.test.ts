import {it,expect} from 'vitest';
import {createConversationBoundary,type Authority,type Provider} from './conversationBoundary';
it('passes every prior dialogue entry once and keeps developer metadata free of duplicated history in both rounds',async()=>{
 const prior=[{role:'user',content:'Earlier observation?'},{role:'assistant',content:'Retained observation '+ 'x'.repeat(26000)}];
 const snapshot={conversationId:'c1',version:1,policyRevision:'p1',sourceRevision:'s1',synthetic:true as const,history:prior};
 const authority:Authority={async snapshot(){return structuredClone(snapshot)},async tool(){return {id:'r1',sourceIds:['synthetic-row'],asOf:'2026-10-06T14:00:00Z',status:'observed',facts:[{key:'receipt',value:'y'.repeat(12600),unit:''}]}},async commit(c){return c}};
 const rounds:any[]=[];const provider:Provider={id:'mock',async respond(input){rounds.push(input.history);return rounds.length===1?{calls:[{id:'call1',name:'context_read',arguments:{}}]}:{response:{interpretation:'Unverified interpretation',claims:[]}}}};
 await createConversationBoundary({authority,provider}).turn({schemaVersion:1,conversationId:'c1',operationId:'op1',expectedVersion:1,text:'Follow up'});
 expect(rounds).toHaveLength(2);
 for(const history of rounds){expect(history[0].content.context).not.toHaveProperty('history');expect(history[0].content.context).toEqual({...snapshot,history:undefined});expect(history.filter((x:any)=>x.role==='user'&&x.content===prior[0].content)).toHaveLength(1);expect(history.filter((x:any)=>x.role==='assistant'&&x.content===prior[1].content)).toHaveLength(1);expect(JSON.stringify(history).length).toBeLessThan(64000)}
 expect(prior[1].content).toHaveLength(26021);
});
