// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {prebuiltSnapshots} from './model';
const key='qa-v43-owned.northworks.guided-v1-main.workspace.v1';
const raw=(note:string)=>JSON.stringify({asOf:'2026-11-03T14:20:00Z',caseState:prebuiltSnapshots().reopened,turns:[{q:'Initial?',a:'Captured initial observation',scope:'Line 03',asOf:'2026-10-06T14:45:00Z'}],role:'CI engineer',scope:'Line 03',metric:'oee',view:'Decomposition',q:'',reason:'',record:'',confirmation:'',notes:note,revision:3});
it('commits/export/restores exact QA bytes despite localStorage writes failing, preserving originals',async()=>{
 vi.resetModules();vi.stubGlobal('indexedDB',new IDBFactory());window.history.replaceState(null,'','/ekas-qa-v43/');localStorage.setItem('unowned.synthetic','untouched');
 const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Quota exhausted','QuotaExceededError')});
 try{const d=await import('./qaNorthworksDurability');expect(await d.openQaNorthworks()).toBeNull();const original=raw('recurrence note');await d.saveQaNorthworks(original);const backup=await d.exportCommittedQaNorthworks('2026-10-11T01:00:00Z');expect(backup.raw).toBe(original);await d.saveQaNorthworks(raw('changed'));await d.importCommittedQaNorthworks(JSON.stringify(backup));expect(await d.openQaNorthworks()).toBe(original);expect(localStorage.getItem('unowned.synthetic')).toBe('untouched');expect(localStorage.getItem(key)).toBeNull();const {browserDocumentStore}=await import('./platform/documentStore');expect(Object.keys((await browserDocumentStore()!.snapshot(()=>true)).entries)).toEqual([key]);}
 finally{spy.mockRestore();vi.unstubAllGlobals();localStorage.removeItem('unowned.synthetic');window.history.replaceState(null,'','/')}
});
it('failed transaction retains committed bytes and latest draft and refuses misleading export',async()=>{
 vi.resetModules();vi.stubGlobal('indexedDB',new IDBFactory());window.history.replaceState(null,'','/ekas-qa-v43/');
 try{const d=await import('./qaNorthworksDurability'),{browserDocumentStore}=await import('./platform/documentStore');await d.openQaNorthworks();const original=raw('committed');await d.saveQaNorthworks(original);(browserDocumentStore()! as any).hooks={beforeWrite:(tx:IDBTransaction)=>tx.abort()};await expect(d.saveQaNorthworks(raw('unsaved recurrence note'))).rejects.toThrow(/transaction.*not active|transaction failed/i);expect(await browserDocumentStore()!.readExact(key)).toBe(original);expect(d.unsavedQaNorthworks()).toBe(raw('unsaved recurrence note'));await expect(d.exportCommittedQaNorthworks('2026-10-11T01:00:00Z')).rejects.toThrow(/transaction.*not active|transaction failed/i);(browserDocumentStore()! as any).hooks=undefined;}
 finally{vi.unstubAllGlobals();window.history.replaceState(null,'','/')}
});

it('invalid legacy QA bytes block initialization without overwrite or substitute',async()=>{
 vi.resetModules();vi.stubGlobal('indexedDB',new IDBFactory());window.history.replaceState(null,'','/ekas-qa-v43/');localStorage.setItem(key,'{broken owned original');
 try{const d=await import('./qaNorthworksDurability');await expect(d.openQaNorthworks()).rejects.toThrow('original retained');expect(localStorage.getItem(key)).toBe('{broken owned original');const {browserDocumentStore}=await import('./platform/documentStore');expect(await browserDocumentStore()!.readExact(key)).toBeNull();}finally{localStorage.removeItem(key);vi.unstubAllGlobals();window.history.replaceState(null,'','/')}
});
