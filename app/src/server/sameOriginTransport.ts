import {API_VERSION,type Request,type Response as ApplicationResponse,type Transport} from '../platform/contract';
export type ApplicationTransportOptions={origin:string;fetch:(input:string,init?:RequestInit)=>Promise<Response>};
/** EKAS application boundary only. Browser role/capability claims are omitted;
 * the server must resolve its own trusted principal. No provider key is accepted. */
export function createSameOriginTransport(options:ApplicationTransportOptions):Transport{
 let origin:URL;try{origin=new URL(options.origin)}catch{throw Error('INVALID_APPLICATION_ORIGIN')}
 if(!['http:','https:'].includes(origin.protocol)||!['127.0.0.1','localhost','[::1]'].includes(origin.hostname)||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password)throw Error('INVALID_APPLICATION_ORIGIN');
 const endpoint=origin.origin+'/api/v1/application';
 return {async send<T>(request:Request):Promise<ApplicationResponse<T>>{
  if(request.apiVersion!==API_VERSION||!request.requestId||!request.path.startsWith('/api/v1/')||!['GET','POST','PATCH','DELETE'].includes(request.method))throw Error('INVALID_APPLICATION_REQUEST');
  const wire={apiVersion:request.apiVersion,requestId:request.requestId,method:request.method,path:request.path,...(request.body===undefined?{}:{body:request.body}),...(request.idempotencyKey===undefined?{}:{idempotencyKey:request.idempotencyKey})};
  const response=await options.fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(wire)});
  let result:any;try{result=await response.json()}catch{throw Error('INVALID_SERVER_RESPONSE')}
  const keys=['requestId','apiVersion','status','synthetic','data','error'];
  if(!result||typeof result!=='object'||Array.isArray(result)||Object.keys(result).some(key=>!keys.includes(key))||result.requestId!==request.requestId||result.apiVersion!==API_VERSION||result.synthetic!==true||result.status!==response.status||!Number.isInteger(result.status)||('data'in result)===('error'in result)||result.error&&(!['INVALID_REQUEST','UNKNOWN_ENDPOINT','NOT_FOUND','FORBIDDEN','CONFLICT','IDEMPOTENCY_CONFLICT','UNSUPPORTED','TIMEOUT','STORAGE_UNAVAILABLE','COMPUTATION_FAILED','INVALID_RESULT'].includes(result.error.code)||typeof result.error.message!=='string'||typeof result.error.retryable!=='boolean'))throw Error('INVALID_SERVER_RESPONSE');
  return result as ApplicationResponse<T>;
 }};
}
