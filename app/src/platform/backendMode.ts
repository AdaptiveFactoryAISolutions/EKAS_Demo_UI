import {PilotAdapter,type PilotWire,type PilotWireRequest,type PilotWireResponse} from './pilotAdapter';
/** Live EKAS access is explicit. This module never constructs the synthetic manufacturing service. */
const FICTIONAL_ROLES=new Set(['manager','supervisor','maintenance','safety','viewer']);
const DOCUMENTED_PATH=/^\/v1\/conversations(?:\/[^/]+\/(?:turns|messages))?$|^\/v1\/evidence\/sha256:[0-9a-f]{64}$/;
export class LiveBackendUnavailable extends Error{
 readonly code='LIVE_BACKEND_UNAVAILABLE' as const;
 constructor(message='The live EKAS connection is unavailable. Demo mode was not used as a substitute.'){super(message);this.name='LiveBackendUnavailable';}
}
export class UnsupportedBackendOperation extends Error{
 readonly code='UNSUPPORTED_BACKEND_OPERATION' as const;
 constructor(message:string){super(message);this.name='UnsupportedBackendOperation';}
}
export interface LiveAccess{baseUrl:string;bearer:string}
export function assertLiveAccess(access?:Partial<LiveAccess>):asserts access is LiveAccess{
 if(!access?.baseUrl?.trim()||!access.bearer?.trim())throw new LiveBackendUnavailable('Live EKAS access needs a caller-supplied base URL and bearer. Neither was provided. Demo mode was not used as a substitute.');
 let url:URL;
 try{url=new URL(access.baseUrl);}catch{throw new LiveBackendUnavailable('The live EKAS base URL is not absolute. Demo mode was not used as a substitute.');}
 if(url.protocol!=='https:'&&url.protocol!=='http:')throw new LiveBackendUnavailable('The live EKAS base URL must be http or https. Demo mode was not used as a substitute.');
 if(url.username||url.password)throw new LiveBackendUnavailable('The live EKAS base URL must not embed credentials. Demo mode was not used as a substitute.');
 if(FICTIONAL_ROLES.has(access.bearer.trim())||access.bearer.includes('presentationOnly'))throw new LiveBackendUnavailable('A fictional demo role is not a live bearer credential. Demo mode was not used as a substitute.');
}
/** Documented pilot routes only. Manufacturing command paths are not translated and are not sent. */
export function assertDocumentedPilotPath(path:string){
 if(!DOCUMENTED_PATH.test(path))throw new UnsupportedBackendOperation('That route is not on the documented pilot surface. The call was not sent. Demo mode was not used as a substitute.');
}
export class LivePilotWire implements PilotWire{
 constructor(readonly access:LiveAccess,private readonly fetchImpl:typeof fetch){assertLiveAccess(access);}
 async send(request:PilotWireRequest):Promise<PilotWireResponse>{
  assertDocumentedPilotPath(request.path);
  const root=new URL(this.access.baseUrl);
  const target=new URL(request.path.replace(/^\//,''),root.href.endsWith('/')?root.href:root.href+'/');
  let response:Response;
  try{
   response=await this.fetchImpl(target,{method:request.method,headers:{Accept:'application/json',Authorization:`Bearer ${this.access.bearer}`,...request.headers,...(request.body===undefined?{}:{'Content-Type':'application/json'})},body:request.body===undefined?undefined:JSON.stringify(request.body)});
  }catch(error){const name=error instanceof Error?error.name:'';throw new LiveBackendUnavailable(name==='AbortError'||name==='TimeoutError'?'The live EKAS call timed out. Demo mode was not used as a substitute.':undefined);}
  const text=await response.text();
  let body:unknown;
  try{body=text?JSON.parse(text):null;}catch{throw new LiveBackendUnavailable('The live EKAS response was not JSON. Demo mode was not used as a substitute.');}
  return {status:response.status,body};
 }
}
export function openLivePilot(access:LiveAccess,fetchImpl:typeof fetch=fetch){return new PilotAdapter(new LivePilotWire(access,fetchImpl));}
/** Unauthenticated liveness probes from apps/api/ekas_api/main.py and runtime_identity.py. Readiness is not this shape. */
export function validateRuntimeProbe(path:'/healthz'|'/livez',body:unknown){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new Error('Invalid runtime probe.');
 const probe=body as Record<string,unknown>;
 const component=path==='/healthz'?'ui-shell-api':'api-runtime';
 if(probe.status!=='ok'||probe.component!==component||typeof probe.wp!=='string'||!probe.wp.trim())throw new Error('Invalid runtime probe.');
}
/** Investigation and workflow commands stay on the demo manufacturing service. Live mode does not borrow that service. */
export function refuseLiveInvestigationCommand():never{
 throw new UnsupportedBackendOperation('The documented pilot contract has no investigation or workflow command route. The call was not sent. Demo mode was not used as a substitute.');
}
