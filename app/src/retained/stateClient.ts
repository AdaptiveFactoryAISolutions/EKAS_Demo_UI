import {workspaceSemanticIdentity,compatibleWorkspaceIdentity,semanticRecoveryMessage} from './semanticIdentity';
import {validWorkspaceSnapshot} from './stateValidation';
import {useSyncExternalStore} from 'react';
import {namespaceKey} from '../experience';
import {browserDocumentStore,DurableStorageError,type DocumentStore,type DocumentSession} from '../platform/documentStore';
import {registerCommitBarrier} from './commitBarrier';
type Setter<T>=(patch:Partial<T>|((state:T)=>Partial<T>|T))=>boolean;
type Initializer<T>=(set:Setter<T>,get:()=>T)=>T;
type Options<T>={name:string;skipHydration?:boolean;storage?:unknown;documents?:DocumentStore|false;partialize?:(s:T)=>Partial<T>};
const options=new WeakMap<Function,Options<any>>();
export const workspaceCalls:{operation:string;version:number;expectedVersion:number;request:unknown;response:unknown;durationMs:number;at:string;synthetic:true}[]=[];
export function createJSONStorage(fn:()=>unknown){return fn}
export function persist<T>(initialize:Initializer<T>,o:Options<T>){options.set(initialize,o);return initialize}
/** Sync UI drafts with explicit async durability. No success acknowledgment before commit. */
export function create<T>(){return (initialize:Initializer<T>)=>{
 const o=options.get(initialize),listeners=new Set<()=>void>(),documents=o?.documents===false?undefined:o?.documents||browserDocumentStore();let state:T,initial:T,committedState:Partial<T>|null=null,version=0,hydrated=false,recoveryIssue='',saveIssue='',pending=0,session:DocumentSession|undefined,tail=Promise.resolve(),hydration:Promise<void>|undefined;
 const key=namespaceKey('retained.'+(o?.name||'workspace'));
 const notifyReact=()=>{if(typeof window!=='undefined')listeners.forEach(f=>f())};
 const notify=()=>{state={...state};notifyReact()};
 const notice=(message:string)=>{if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('ekas-notice',{detail:message}))};
 const dataOf=(next:T)=>JSON.parse(JSON.stringify(o?.partialize?o.partialize(next):next));
 const encode=(data:unknown)=>JSON.stringify({...workspaceSemanticIdentity,schemaVersion:1,version:version+1,synthetic:true,notDispatched:true,notGranted:true,state:data});
 const admitted=(raw:string)=>{const doc=JSON.parse(raw);if(!compatibleWorkspaceIdentity(doc))throw new Error(semanticRecoveryMessage);if(doc.schemaVersion!==1||!Number.isSafeInteger(doc.version)||doc.version<0||doc.synthetic!==true||!validWorkspaceSnapshot(doc.state,initial as Record<string,unknown>))throw new Error('Invalid workspace snapshot. Export retained data before any explicit reset or restore.');return doc};
 const record=(data:unknown,start:number)=>{committedState=structuredClone(data) as Partial<T>;version++;workspaceCalls.push({operation:'workspace.patch',version,expectedVersion:version-1,request:{schemaVersion:1,state:data},response:{version,synthetic:true,notDispatched:true,notGranted:true},durationMs:performance.now()-start,at:new Date().toISOString(),synthetic:true})};
 const enqueue=(data:unknown)=>{const start=performance.now();pending++;const job=tail.then(async()=>{if(saveIssue)throw new Error(saveIssue);if(!session)throw new Error('Durable workspace not ready; save refused.');await documents!.write(session,encode(data));record(data,start)});tail=job.catch(error=>{saveIssue=error instanceof Error?error.message:'Workspace save failed';notice('Not saved: '+saveIssue+' Current draft retained; export or retry before leaving.')}).then(()=>{pending--;notify()});};
 const flush=():void|Promise<void>=>{if(saveIssue)throw new Error(saveIssue);if(!pending)return;if(documents)return tail.then(()=>{if(saveIssue)throw new Error(saveIssue)})};
 registerCommitBarrier(flush);
 const set:Setter<T>=patch=>{if(recoveryIssue||saveIssue){notice('Not saved: '+(recoveryIssue||saveIssue));return false;}const next={...state,...(typeof patch==='function'?patch(state):patch)};try{if(hydrated&&typeof localStorage!=='undefined'){const data=dataOf(next);if(!validWorkspaceSnapshot(data,initial as Record<string,unknown>))throw new Error('Invalid workspace state; change was not saved.');if(documents){enqueue(data)}else{const start=performance.now(),current=localStorage.getItem(key);if(current&&JSON.parse(current).version!==version)throw new Error('Workspace changed in another session. Reload before saving.');localStorage.setItem(key,encode(data));record(data,start)}}}catch(error){saveIssue=error instanceof Error?error.message:'Workspace save failed';notice('Not saved: '+saveIssue);notify();return false;}state=next;notifyReact();return true;};
 state=initialize(set,()=>state);initial=state;
 const hook=<R,>(select:(s:T)=>R):R=>select(useSyncExternalStore(cb=>{listeners.add(cb);return()=>listeners.delete(cb)},()=>state,()=>state));
 const rehydrate=()=>{if(hydration)return hydration;hydration=(async()=>{try{let raw:string|null;if(documents){session=await documents.open(key,raw=>{try{admitted(raw);return true}catch{return false}});raw=session.value}else raw=typeof localStorage==='undefined'?null:localStorage.getItem(key);if(raw){const doc=admitted(raw);state={...state,...doc.state};version=doc.version;committedState=dataOf(state) as Partial<T>;}hydrated=true;notify();}catch(error){if(error instanceof DurableStorageError&&error.retainedRaw){try{admitted(error.retainedRaw)}catch(reason){error=reason}}recoveryIssue=error instanceof Error?error.message:'Recovery failed';notify();notice(recoveryIssue);}})();return hydration;};
 return Object.assign(hook,{getState:()=>state,setState:set,persist:{getCommittedState:()=>committedState?structuredClone(committedState):null,getRecoveryIssue:()=>recoveryIssue,getSaveIssue:()=>saveIssue,getStatus:()=>recoveryIssue||saveIssue?'failed' as const:!hydrated?'loading' as const:pending?'pending' as const:'saved' as const,backend:documents?'IndexedDB':'localStorage compatibility',rehydrate,flush,exportDraft:()=>encode(dataOf(state)),retry:async()=>{if(recoveryIssue)throw new Error(recoveryIssue);saveIssue='';if(documents){enqueue(dataOf(state));await flush()}else{set({});if(saveIssue)throw new Error(saveIssue)}notify()}}});
 }}
