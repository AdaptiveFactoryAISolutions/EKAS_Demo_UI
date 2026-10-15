import {workspaceApi} from './workspaceApi';
import {canonicalGapApi} from './canonicalGapApi';
import {positiveContexts,positiveMetricContexts} from './positiveBinding';
import {metricDefinitions} from './metricEngine';
import {workspaceConversation} from './workspaceConversation';
import scenarios from '../../inputs/metric-oracle/known-answer-scenarios.json';
import {API_VERSION,type Transport,type Request,type Response,type Resource} from './contract';
import {MockService} from './mockService';
import {evaluateMetric} from './metricEngine';
import {object,text} from './validation';
/** Arithmetic-cohort extension: stored illustrative calculation, never a certification. */
export class TrainingTransport implements Transport{
 constructor(readonly service:MockService){}
 async send<T>(request:Request):Promise<Response<T>>{
  if(request.path==='/api/v1/capabilities'&&request.method==='GET'){const admitted=await this.service.send({...request,path:'/api/v1/status'});if(admitted.error)return admitted as Response<T>;return {...admitted,data:{schemaVersion:'ekas-capabilities-v1',synthetic:true,productionApproved:false,operations:['query','captured-result','owned-resource','arithmetic','bounded-conversation'],namespaces:['training-plant-v1','training-positive-v2'],grouping:false,filters:false,independentShiftGrain:false,scenarioAssetScope:'all eight presentation assets with exact scenario ownership',metrics:metricDefinitions.map(d=>({id:d.id,definitionVersion:1,status:'supported exact positive context; base eligibility evaluated separately',scenarioId:positiveMetricContexts[d.id],context:positiveContexts[positiveMetricContexts[d.id]],prerequisites:d.prerequisites})),governedProductionMutations:false} as T}}
  const workspace=await workspaceApi(this.service,request);if(workspace)return workspace as Response<T>;
  const canonical=await canonicalGapApi(this.service,request);if(canonical)return canonical as Response<T>;
  const conversation=await workspaceConversation(this.service,request);if(conversation)return conversation as Response<T>;
  if(request.path!=='/api/v1/arithmetic')return this.service.send<T>(request);
  const fail=(status:number,code:NonNullable<Response['error']>['code'],message:string):Response<T>=>({requestId:request.requestId,apiVersion:API_VERSION,status,error:{code,message,retryable:false},synthetic:true});
  if(request.apiVersion!==API_VERSION||request.method!=='POST'||!text(request.requestId)||!text(request.session?.id)||request.session.presentationOnly!==true||!Array.isArray(request.session.allowedAssetIds)||!request.session.allowedAssetIds.length||!object(request.body)||!text(request.body.metricId)||request.body.definitionVersion!==1||!text(request.body.cohortId)||!object(request.body.inputs)||!request.idempotencyKey)return fail(400,'INVALID_REQUEST','Versioned cohort, exact metric, inputs and idempotency key required.');
  const body=request.body,inputs=body.inputs as Record<string,unknown>,cohort=scenarios.cases.find(c=>c.id===body.cohortId);
  if(!cohort||!Object.keys(cohort.expected).includes(String(body.metricId)))return fail(422,'UNSUPPORTED','Metric is not bound to this explicit arithmetic cohort.');
  if(Object.keys(inputs).length>100||Object.values(inputs).some(v=>!(v===null||typeof v==='number'&&Number.isFinite(v)||typeof v==='string'&&v.length<=256||Array.isArray(v)&&v.length<=10000&&v.every(n=>typeof n==='number'&&Number.isFinite(n))||object(v)&&v.masked===true&&Object.keys(v).length===1)))return fail(400,'INVALID_REQUEST','Invalid bounded arithmetic operand.');
  const evaluation=evaluateMetric(String(body.metricId),inputs,{namespace:cohort.namespace,mode:'algebra_only'}),content={kind:'illustrative arithmetic result',cohortId:cohort.id,cohortNamespace:cohort.namespace,inputs:structuredClone(inputs),evaluation,authority:'Independent arithmetic fixture or edited demo assumptions; not observed plant facts, policy approval or certification.'};
  const stored=await this.service.send<Resource>({...request,path:'/api/v1/resources/answer',body:{content}});
  if(stored.error)return {...stored,data:undefined} as Response<T>;
  return {...stored,data:{...content,id:stored.data!.id,version:stored.data!.version,synthetic:true,notDispatched:true,financiallyValidated:false} as T};
 }
}
