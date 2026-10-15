// @vitest-environment jsdom
import {it,expect} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {DocumentStore} from '../platform/documentStore';
import {DurableRepository} from '../platform/durableRepository';
import {InvestigationTransport,createInvestigationApi} from './api';

it('reopens the exact investigation from durable storage and refuses a competing stale writer',async()=>{
 const factory=new IDBFactory(),legacy={getItem:()=>null},name='v55-isolated-investigation-test',key='owned-investigation.v1';
 const documents=new DocumentStore(factory,legacy,name),first=new DurableRepository(documents,key);
 const api=createInvestigationApi(new InvestigationTransport(first));
 const record=await api.create('complete','draft','create');
 const second=new DurableRepository(new DocumentStore(factory,legacy,name),key);
 await second.ready;
 const competing=createInvestigationApi(new InvestigationTransport(second));
 expect(await competing.read(record.id)).toEqual(record);
 const captured=await api.command(record.id,1,{kind:'capture-analysis'},'capture');
 await expect(competing.command(record.id,1,{kind:'capture-analysis'},'competing')).rejects.toThrow('STORAGE_UNAVAILABLE');
 const reopened=createInvestigationApi(new InvestigationTransport(new DurableRepository(new DocumentStore(factory,legacy,name),key)));
 expect(await reopened.read(record.id)).toEqual(captured);
 expect((await documents.snapshot(k=>k===key)).archives).toEqual([]);
});

it('retains invalid stored originals and refuses replacement or false successful creation',async()=>{
 const original='{damaged owned investigation';const documents=new DocumentStore(new IDBFactory(),{getItem:()=>original},'v55-corrupt-investigation-test');
 const repository=new DurableRepository(documents,'owned-investigation.v1');await repository.ready;
 expect(repository.recovery).toBe('corrupt');expect(repository.recoveryExport).toBe(original);
 const api=createInvestigationApi(new InvestigationTransport(repository));
 await expect(api.create('complete','draft','create')).rejects.toThrow('STORAGE_UNAVAILABLE');
 expect(repository.recoveryExport).toBe(original);expect(repository.state.resources).toEqual([]);
});
