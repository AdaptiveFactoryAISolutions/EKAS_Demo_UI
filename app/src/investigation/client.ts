import {namespaceKey} from '../experience';
import {browserDocumentStore} from '../platform/documentStore';
import {DurableRepository} from '../platform/durableRepository';
import {MockRepository} from '../platform/mockRepository';
import {InvestigationTransport,createInvestigationApi} from './api';

/** Uses the accepted durable document boundary; refuses unavailable persistence
 * rather than acknowledging a component-only save. */
const repositories=new Map<string,DurableRepository>();
export function createDurableInvestigationApi(){
 const key=namespaceKey('investigation.v1');let repository=repositories.get(key);
 if(!repository){const documents=browserDocumentStore();if(!documents)throw Error('STORAGE_UNAVAILABLE: Durable investigation storage is unavailable; no changes were saved.');repository=new DurableRepository(documents,key);repositories.set(key,repository)}
 return createInvestigationApi(new InvestigationTransport(repository));
}
export function createIsolatedInvestigationApi(repository=new MockRepository()){
 return createInvestigationApi(new InvestigationTransport(repository));
}
