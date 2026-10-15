import {API_VERSION,type Request,type Response,type Session,type Transport,type CallTrace} from './contract';
export class EkasClient{
 readonly traces:CallTrace[]=[];private sequence=0;private readonly instance=crypto.randomUUID();
 constructor(readonly transport:Transport,readonly session:Session,readonly clock:()=>number=()=>performance.now(),readonly observer?:(trace:CallTrace)=>void){}
 async request<T>(method:Request['method'],path:string,body?:unknown,idempotencyKey?:string):Promise<Response<T>>{
  const request:Request={apiVersion:API_VERSION,requestId:`${this.session.id}:${this.instance}:${++this.sequence}`,session:{...this.session,allowedAssetIds:[...this.session.allowedAssetIds]},method,path,body,idempotencyKey};const start=this.clock();
  let response:Response<T>;try{response=await this.transport.send<T>(request)}catch(error){response={requestId:request.requestId,apiVersion:API_VERSION,status:503,error:{code:error instanceof Error&&error.message==='TIMEOUT'?'TIMEOUT':'COMPUTATION_FAILED',message:error instanceof Error?error.message:'Transport failed',retryable:true},synthetic:true}}const trace={request:structuredClone(request),response:structuredClone(response),durationMs:this.clock()-start};this.traces.push(trace);if(this.traces.length>1000)this.traces.splice(0,this.traces.length-1000);this.observer?.(trace);return response;
 }
}
