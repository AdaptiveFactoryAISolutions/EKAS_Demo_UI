import {API_VERSION,type Request,type Response,type Resource,type Transport,type ErrorCode} from '../platform/contract';
import {MockRepository} from '../platform/mockRepository';
import {applyCommand,createInvestigation,validateInvestigation,conditions,startingRecords,type Investigation} from './model';

/** Local proposed application-service boundary. A future Tom adapter must map the verified backend contract; this demo port is not an agreed production requirement.
 * this transport neither dispatches real work nor calls a model. */
export class InvestigationTransport implements Transport {
 private failure:'read'|'write'|'calculation'|null=null;
 constructor(readonly repository:MockRepository){}
 armFailure(kind:'read'|'write'|'calculation'){this.failure=kind}
 async send<T=unknown>(request:Request):Promise<Response<T>>{
  const response=(status:number,data?:unknown,code?:ErrorCode,message?:string):Response<T>=>({apiVersion:API_VERSION,requestId:request.requestId,status,synthetic:true,...(code?{error:{code,message:message||code,retryable:['STORAGE_UNAVAILABLE','COMPUTATION_FAILED'].includes(code)}}:{data:data as T})});
  return this.repository.exclusive(async()=>{
   try{
    await this.repository.ready;
    if(request.apiVersion!==API_VERSION||!request.requestId||request.session?.presentationOnly!==true)return response(400,undefined,'INVALID_REQUEST');
    if(request.session.id!=='northworks-investigation-demo'||!request.session.allowedAssetIds.includes('FEED-03'))return response(403,undefined,'FORBIDDEN');
    if(['corrupt','unavailable'].includes(this.repository.recovery))return response(503,undefined,'STORAGE_UNAVAILABLE');
    const match=request.path.match(/^\/api\/v1\/investigations(?:\/([^/]+)(\/commands)?)?$/);
    if(!match)return response(404,undefined,'UNKNOWN_ENDPOINT');
    const [,id,commands]=match;
    if(request.method==='GET'){
     if(this.failure==='read'){this.failure=null;return response(503,undefined,'STORAGE_UNAVAILABLE')}
     const records=this.repository.state.resources.filter(r=>r.content.domain==='northworks-investigation-v1'&&r.ownerSessionId===request.session.id);
     if(id){const record=records.find(r=>r.id===id);if(!record)return response(404,undefined,'NOT_FOUND');if(!validateInvestigation(record.content.investigation))return response(422,undefined,'INVALID_RESULT');return response(200,structuredClone(record))}
     if(records.some(r=>!validateInvestigation(r.content.investigation)))return response(422,undefined,'INVALID_RESULT');
     return response(200,structuredClone(records));
    }
    if(request.method!=='POST'||(id&&!commands)||(!id&&commands))return response(404,undefined,'UNKNOWN_ENDPOINT');
    if(request.session.role!=='engineer')return response(403,undefined,'FORBIDDEN');
    const key=request.idempotencyKey,body=request.body as Record<string,unknown>;
    if(!key||key.length>100||!body||typeof body!=='object')return response(400,undefined,'INVALID_REQUEST');
    const slot='investigation:'+request.session.id+':'+key;
    // expectedVersion is admission for a new command, not the identity of a retry.
    const fingerprint=JSON.stringify({path:request.path,payload:id?body.command:body});
    const old=this.repository.state.idempotency[slot];
    if(old){if(old.fingerprint!==fingerprint)return response(409,undefined,'IDEMPOTENCY_CONFLICT');if(!validateInvestigation(old.result.content.investigation))return response(422,undefined,'INVALID_RESULT');return response(200,structuredClone(old.result))}
    const next=structuredClone(this.repository.state);let investigation:Investigation,record:Resource;
    if(id){
     const prior=next.resources.find(r=>r.id===id&&r.content.domain==='northworks-investigation-v1'&&r.ownerSessionId===request.session.id);
     if(!prior)return response(404,undefined,'NOT_FOUND');
     if(!validateInvestigation(prior.content.investigation))return response(422,undefined,'INVALID_RESULT');
     if(!Number.isSafeInteger(body.expectedVersion)||body.expectedVersion!==prior.version)return response(409,undefined,'CONFLICT');
     if(this.failure==='calculation'){this.failure=null;return response(503,undefined,'COMPUTATION_FAILED')}
     investigation=applyCommand(prior.content.investigation,body.command as Parameters<typeof applyCommand>[1],key);
     record={...prior,version:prior.version+1,updatedAt:investigation.asOf,content:{...prior.content,investigation}};
     next.resources[next.resources.findIndex(r=>r.id===id)]=record;
    }else{
     if(!conditions.includes(body.condition as any)||!startingRecords.includes(body.startingRecord as any))return response(400,undefined,'INVALID_REQUEST');
     investigation=createInvestigation(body.condition as Parameters<typeof createInvestigation>[0],body.startingRecord as Parameters<typeof createInvestigation>[1]);
     next.sequence++;record={id:'action-'+next.sequence,kind:'action',version:1,content:{domain:'northworks-investigation-v1',investigation},createdAt:investigation.asOf,updatedAt:investigation.asOf,synthetic:true,notDispatched:true,notGranted:true,ownerSessionId:request.session.id,assetIds:['FEED-03']};next.resources.push(record);
    }
    if(!validateInvestigation(investigation))return response(422,undefined,'INVALID_RESULT');
    next.idempotency[slot]={fingerprint,result:structuredClone(record)};
    if(this.failure==='write'){this.failure=null;return response(503,undefined,'STORAGE_UNAVAILABLE')}
    try{await this.repository.commit(next)}catch{return response(503,undefined,'STORAGE_UNAVAILABLE')}
    return response(201,structuredClone(record));
   }catch(error){const message=error instanceof Error?error.message:'Invalid request';return response(400,undefined,/unsupported/i.test(message)?'UNSUPPORTED':'INVALID_REQUEST',message)}
  });
 }
}

export function createInvestigationApi(transport:Transport){
 let sequence=0;
 const send=async(path:string,method:Request['method'],body?:unknown,key?:string)=>{
  const result=await transport.send<Resource>({apiVersion:API_VERSION,requestId:'investigation-request-'+(++sequence),session:{id:'northworks-investigation-demo',role:'engineer',presentationOnly:true,allowedAssetIds:['FEED-03']},path,method,body,idempotencyKey:key});
  if(result.error)throw Error(result.error.code+': '+result.error.message);
  if(!result.data||!validateInvestigation(result.data.content.investigation))throw Error('INVALID_RESULT');return result.data;
 };
 return {create:(condition:Parameters<typeof createInvestigation>[0],startingRecord:Parameters<typeof createInvestigation>[1],key:string)=>send('/api/v1/investigations','POST',{condition,startingRecord},key),read:(id:string)=>send('/api/v1/investigations/'+encodeURIComponent(id),'GET'),command:(id:string,expectedVersion:number,command:Parameters<typeof applyCommand>[1],key:string)=>send('/api/v1/investigations/'+encodeURIComponent(id)+'/commands','POST',{expectedVersion,command},key)};
}
