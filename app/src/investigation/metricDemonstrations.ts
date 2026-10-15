import {API_VERSION,type Request,type Response,type ErrorCode,type CanonicalResult,type Query,type Resource} from '../platform/contract';
import {MockRepository,PersistenceFailure} from '../platform/mockRepository';
import {positiveContexts,positiveMetricContexts,positiveValue} from '../platform/positiveBinding';
import {metricDefinitions} from '../platform/metricEngine';
import {validResult} from '../platform/validation';
import {trainingAssetIds} from './trainingPort';
const path='/api/v1/manufacturing/metric-demonstrations';
export const metricDemonstrationCatalog={dataset:'training-positive-v2',defaultTrainingUnchanged:true,productionConformance:false,synthetic:true,causalStatus:'unconfirmed',financiallyValidated:false,definitions:metricDefinitions.map(d=>({metricId:d.id,name:d.aliases[0]||d.id,unit:d.unit,expression:d.expression,definitionVersion:1,contextId:positiveMetricContexts[d.id],context:positiveContexts[positiveMetricContexts[d.id]],qualification:'Declared synthetic raw-record scenario; production qualification and financial realization unverified.'}))};
export async function metricDemonstrationRequest(repo:MockRepository,q:Request,assertLease?:()=>void):Promise<Response>{
 const reply=(status:number,data?:unknown,code?:ErrorCode,message?:string):Response=>{assertLease?.();return {requestId:q.requestId,apiVersion:API_VERSION,status,synthetic:true,...(code?{error:{code,message:message||code,retryable:code==='STORAGE_UNAVAILABLE'}}:{data})}};
 if(q.path!==path)return reply(404,undefined,'UNKNOWN_ENDPOINT');
 if(!trainingAssetIds.every(a=>q.session.allowedAssetIds.includes(a)))return reply(403,undefined,'FORBIDDEN','The exact declared synthetic raw cohort requires all of its assets.');
 if(q.method==='GET')return reply(200,metricDemonstrationCatalog);
 if(q.method!=='POST')return reply(404,undefined,'UNKNOWN_ENDPOINT');
 const b=q.body as any,d=metricDefinitions.find(x=>x.id===b?.metricId),contextId=d?positiveMetricContexts[d.id]:undefined,ctx=contextId?positiveContexts[contextId]:undefined;
 if(!b||Object.keys(b).some(k=>!['dataset','metricId','simulationCase','asOf'].includes(k))||b.dataset!=='training-positive-v2'||!d||!ctx||!q.idempotencyKey||b.simulationCase!==undefined&&!['masked_evidence','production_protocol','unrelated_cohorts','zero_exposure'].includes(b.simulationCase)||b.asOf!==undefined&&(typeof b.asOf!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(b.asOf)||!Number.isFinite(Date.parse(b.asOf))||new Date(b.asOf).toISOString().replace('.000Z','Z')!==b.asOf))return reply(422,undefined,'INVALID_REQUEST','Choose an exact definition and explicitly declared synthetic raw dataset.');
 const slot='metric-demonstration:'+q.session.id+':'+q.idempotencyKey,fingerprint=JSON.stringify({session:q.session.id,body:b}),old=repo.state.idempotency[slot];
 if(old)return old.fingerprint===fingerprint?reply(200,structuredClone(old.result.content.result)):reply(409,undefined,'IDEMPOTENCY_CONFLICT');
 try{const query:Query={fixtureVersion:'training-positive-v2',metricIds:[d.id],definitionVersions:{[d.id]:1},scope:{assetIds:[...trainingAssetIds],scenarioId:contextId},from:ctx.window[0],to:b.asOf&&b.asOf<ctx.window[1]?b.asOf:ctx.window[1],asOf:b.asOf||ctx.asOf,groupBy:[],filters:[],page:{offset:0,limit:100},...(b.simulationCase?{simulationCase:b.simulationCase}:{})},value=positiveValue(d.id,query),next=structuredClone(repo.state);
 const result:CanonicalResult={id:'result-'+(++next.sequence),version:1,apiVersion:API_VERSION,query,definitionVersions:query.definitionVersions,fixtureVersion:query.fixtureVersion,rows:[{key:contextId!,dimensions:{scenario:contextId!},values:{[d.id]:value}}],total:1,returned:1,offset:0,limit:100,truncated:false,createdAt:query.asOf,synthetic:true,financiallyValidated:false};
 if(!validResult(result))return reply(422,undefined,'INVALID_RESULT','No malformed demonstration result was stored.');
 next.results.push(result);const receipt:Resource={id:'domain-'+(++next.sequence),kind:'domain',version:1,content:{domain:'manufacturing-metric-demonstration-v1',result},createdAt:query.asOf,updatedAt:query.asOf,synthetic:true,notGranted:true,notDispatched:true,ownerSessionId:'manufacturing-demo',assetIds:[...trainingAssetIds]};next.idempotency[slot]={fingerprint,result:receipt};assertLease?.();await repo.commit(next);return reply(200,structuredClone(result));
 }catch(e){return reply(e instanceof PersistenceFailure?503:422,undefined,e instanceof PersistenceFailure?'STORAGE_UNAVAILABLE':'INVALID_RESULT',e instanceof Error?e.message:'Exact scenario could not be evaluated.');}
}
