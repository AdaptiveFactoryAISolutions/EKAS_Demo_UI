import {browserDocumentStore,type DocumentSession} from './platform/documentStore';
import {qaNorthworksKey,validQaNorthworksRaw,captureQaNorthworks,restoreQaNorthworks} from './qaNorthworksBackup';
let session:Promise<DocumentSession>|undefined,queue:Promise<void>=Promise.resolve(),failure='',draft:string|null=null;
const store=()=>{const d=browserDocumentStore();if(!d)throw new Error('Owned QA document store unavailable; no fallback or deletion.');return d};
export async function openQaNorthworks(){session??=store().open(qaNorthworksKey,validQaNorthworksRaw);return (await session).value}
export function saveQaNorthworks(raw:string){draft=raw;queue=queue.then(async()=>{const s=await (session??=store().open(qaNorthworksKey,validQaNorthworksRaw));await store().write(s,raw);failure='';if(draft===raw)draft=null}).catch(error=>{failure=(error instanceof Error?error.name+': '+error.message:String(error));throw error});return queue}
export async function flushQaNorthworks(){await queue;if(failure)throw new Error(failure)}
export async function exportCommittedQaNorthworks(at:string){await flushQaNorthworks();const raw=await store().readExact(qaNorthworksKey);return captureQaNorthworks({getItem:()=>raw},qaNorthworksKey,at)}
export async function importCommittedQaNorthworks(text:string){await flushQaNorthworks();let raw:string|null=null;restoreQaNorthworks({getItem:()=>null,setItem:(_key,value)=>{raw=value}},text,qaNorthworksKey);await store().replaceScope({[qaNorthworksKey]:raw!},key=>key===qaNorthworksKey);session=undefined;draft=null;failure=''}
export function unsavedQaNorthworks(){return draft}
