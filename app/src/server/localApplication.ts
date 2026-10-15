import{createApplicationHandler,type Principal}from'./applicationHandler';
import{createLocalAiAdminHandler}from'./localAiAdminHandler';import{localAiAdminMessages}from'../admin/localAiAdminMessages';
import type{ManufacturingService}from'../investigation/service';import type{createLocalAiRuntime}from'./localAiRuntime';import type{createLocalOwnerAuthority}from'./localOwnerAuthority';
/** Local demo composition. Business role and paid-request owner authority remain distinct.
 * Each generation captures a provider; policy is rechecked after awaited work.
 * Disabling/rotating/logging out cannot publish an obsolete pending result. */
export function createLocalApplicationHandler({canonical,runtime,owner,principal,audit}:{canonical:ManufacturingService;runtime:ReturnType<typeof createLocalAiRuntime>;owner:ReturnType<typeof createLocalOwnerAuthority>;principal:(request:Request)=>Principal|null;audit?:Parameters<typeof createLocalAiAdminHandler>[0]['audit']}){
 const admin=createLocalAiAdminHandler({owner,runtime,audit}),modelRequests=new WeakSet<Request>();let generation='',application:ReturnType<typeof createApplicationHandler>|undefined;
 const mode=()=>runtime.status().effectiveMode==='openai'?'server-openai':runtime.status().effectiveMode==='mock'?'server-openai-mock':'server-disabled';
 const trusted=(request:Request):Principal|null=>{const p=principal(request);if(!p)return null;const enabled=runtime.status().effectiveMode==='openai'&&modelRequests.has(request);let authority='unpaid';if(enabled){try{const identity=owner.authorize(request,true);if(identity.scope!=='local-demo-ai')return null;authority=identity.subject+':'+identity.expiresAt}catch{return null}}return{...p,policyRevision:p.policyRevision+':'+runtime.policyRevision()+':'+authority}};
 return async(request:Request):Promise<Response>=>{const path=new URL(request.url).pathname;
  if(path.startsWith('/api/v1/admin/'))return admin(request);
  if(path==='/api/v1/demo/ai-status'&&request.method==='GET')return Response.json({version:1,synthetic:true,mode:mode(),localAdmin:true},{headers:{'Cache-Control':'no-store'}});
  if(path==='/api/v1/application'&&runtime.status().effectiveMode==='openai'){let wire;try{wire=await request.clone().json()}catch{}if(wire?.method==='POST'&&typeof wire.path==='string'&&wire.path.endsWith('/messages'))modelRequests.add(request)}
  if(modelRequests.has(request))try{if(owner.authorize(request,true).scope!=='local-demo-ai')throw Error('LOCAL_OWNER_REQUIRED')}catch(e){const code=e instanceof Error&&Object.hasOwn(localAiAdminMessages,e.message)?e.message:'LOCAL_OWNER_REQUIRED';return Response.json({error:{code,message:localAiAdminMessages[code]}},{status:code==='LOCAL_OWNER_REQUIRED'?401:403,headers:{'Cache-Control':'no-store'}})}
  const next=runtime.policyRevision();if(!application||generation!==next){generation=next;application=createApplicationHandler({canonical,provider:runtime.provider(),principal:trusted})}
  return application(request);
 };
}
