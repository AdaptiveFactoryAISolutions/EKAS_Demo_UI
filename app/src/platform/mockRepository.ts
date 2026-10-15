import type {CanonicalResult,Resource} from './contract';
import {object,text,validResult,validResource} from './validation';
export type RepositoryState={schemaVersion:1;seedVersion:string;sequence:number;resources:Resource[];results:CanonicalResult[];idempotency:Record<string,{fingerprint:string;result:Resource}>};
export interface StoragePort{read():string|null;write(value:string):void}
export class PersistenceFailure extends Error{}
export function emptyRepository():RepositoryState{return {schemaVersion:1,seedVersion:'ekas-platform-synthetic-v2',sequence:0,resources:[],results:[],idempotency:{}}}
export function validateRepository(value:unknown):value is RepositoryState{
 if(!object(value)||value.schemaVersion!==1||value.seedVersion!=='ekas-platform-synthetic-v2'||!Number.isSafeInteger(value.sequence)||Number(value.sequence)<0||!Array.isArray(value.resources)||!Array.isArray(value.results)||!object(value.idempotency))return false;
 const ids=new Set<string>();
 const allocation=(id:string)=>{const n=id.match(/-(\d+)$/);return !!n&&Number(n[1])>=1&&Number(n[1])<=Number(value.sequence)};
 if(!value.resources.every(r=>validResource(r)&&!ids.has(r.id)&&!!ids.add(r.id)&&allocation(r.id))||!value.results.every(r=>validResult(r)&&!ids.has(r.id)&&!!ids.add(r.id)&&allocation(r.id)))return false;
 return Object.values(value.idempotency).every(entry=>object(entry)&&typeof entry.fingerprint==='string'&&entry.fingerprint.length>0&&entry.fingerprint.length<1000000&&validResource(entry.result)&&allocation(entry.result.id));
}
export class MockRepository{
 ready:Promise<void>=Promise.resolve();private mutations:Promise<unknown>=Promise.resolve();
 exclusive<T>(job:()=>Promise<T>):Promise<T>{const next=this.mutations.then(job);this.mutations=next.catch(()=>{});return next}
 state:RepositoryState=emptyRepository();recovery:'clean'|'loaded'|'corrupt'|'unavailable'='clean';recoveryExport:string|null=null;
 constructor(readonly storage?:StoragePort){if(storage){let raw:string|null=null;try{raw=storage.read()}catch{this.recovery='unavailable';return}if(raw){this.recoveryExport=raw;try{const value=JSON.parse(raw);if(validateRepository(value)){this.state=value;this.recovery='loaded'}else this.recovery='corrupt'}catch{this.recovery='corrupt'}}}}
 commit(next:RepositoryState):void|Promise<void>{if(!validateRepository(next))throw new Error('INVALID_REPOSITORY');if(this.storage)try{this.storage.write(JSON.stringify(next))}catch(e){throw new PersistenceFailure(e instanceof Error?e.message:'Local persistence unavailable')}this.state=next;}
 reset():void|Promise<void>{const commit=this.commit(emptyRepository());if(commit instanceof Promise)return commit.then(()=>{this.recovery='clean'});this.recovery='clean'}
}
