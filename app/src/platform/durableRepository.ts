import {DocumentStore,DurableStorageError,type DocumentSession} from './documentStore';
import {MockRepository,PersistenceFailure,emptyRepository,validateRepository,type RepositoryState} from './mockRepository';
const valid=(raw:string)=>{try{return validateRepository(JSON.parse(raw))}catch{return false}};
export class DurableRepository extends MockRepository{
 private session?:DocumentSession;
 constructor(readonly documents:DocumentStore,readonly key:string){super();this.ready=this.load()}
 private async load(){try{this.session=await this.documents.open(this.key,valid);if(this.session.value){this.recoveryExport=this.session.value;this.state=JSON.parse(this.session.value);this.recovery='loaded'}}catch(error){this.recoveryExport=error instanceof DurableStorageError?error.retainedRaw:null;this.recovery=this.recoveryExport?'corrupt':'unavailable'}}
 override async reset(){const next=emptyRepository();try{await this.documents.replaceScope({[this.key]:JSON.stringify(next)},key=>key===this.key,undefined,[this.key]);this.session=await this.documents.open(this.key,valid);this.state=next;this.recovery='clean'}catch(error){throw new PersistenceFailure(error instanceof Error?error.message:'Reset not committed; original data retained.')}}
 override async commit(next:RepositoryState){if(!validateRepository(next))throw new Error('INVALID_REPOSITORY');if(!this.session)throw new PersistenceFailure('Local service storage is unavailable; existing data retained.');try{await this.documents.write(this.session,JSON.stringify(next))}catch(error){throw new PersistenceFailure(error instanceof Error?error.message:'Durable commit failed')}this.state=next}
}
