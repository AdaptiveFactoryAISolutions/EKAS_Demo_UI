// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {IDBFactory} from 'fake-indexeddb';
import {NO_INVESTIGATION_YET,plantFacingReply} from './plantPresentation';

it('plant-facing replies hide training grammar and fixture diagnostics',()=>{
 const raw='Unsupported or ambiguous intent in this finite training grammar. Specify a supported metric, exact scope and observation period; no neighboring measure was substituted.\n\nDataset: training-plant-v1; cutoff 2026-09-29T00:00:00Z.';
 const shown=plantFacingReply(raw);
 expect(shown).not.toMatch(/finite training grammar|training-plant-v1|Dataset:/);
 expect(shown).toMatch(/supported metric/);
 expect(plantFacingReply('Dataset: training-plant-v1; cutoff 2026-09-29T00:00:00Z.')).toBe(NO_INVESTIGATION_YET);
});

it('a new conversation clears the visible case and does not inherit Investigate it',async()=>{
 vi.resetModules();
 vi.stubGlobal('indexedDB',new IDBFactory());
 vi.stubGlobal('ResizeObserver',class{observe(){}unobserve(){}disconnect(){}});
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 window.history.replaceState(null,'','/?demonstration=rc4-new-conversation');
 const {useEkas}=await import('../retained/store');
 const {CanonicalWorkspace}=await import('./CanonicalWorkspace');
 const {beginNewConversation,submitUnifiedConversation,manufacturingClient}=await import('./unified');
 await useEkas.persist.rehydrate();
 useEkas.setState({screen:'home',askThread:[],askText:'',manufacturingConversationId:undefined,help:false,northworksGuide:undefined,appearance:'light'});
 const host=document.createElement('div'),root=createRoot(host);
 document.body.append(host);
 const scope=()=>host.querySelector('.ekas-scope')?.textContent||'';
 const meta=()=>host.querySelector('.ekas-scope-meta')?.textContent||'';
 const settle=()=>act(async()=>new Promise(r=>setTimeout(r,30)));
 try{
  await act(async()=>root.render(<CanonicalWorkspace onAdvanced={()=>{}}/>));
  await settle();
  expect(scope()).not.toMatch(/FEED-03|JOB-8303|Line 03/);
  expect(meta()).toMatch(/No investigation selected/);
  expect(host.textContent).not.toMatch(/Sample dataset/);
  await act(async()=>{await submitUnifiedConversation('Run my plant review.');});
  await act(async()=>{await submitUnifiedConversation('Investigate it.');});
  await settle();
  expect(scope()).toMatch(/FEED-03/);
  expect(scope()).toMatch(/JOB-8303/);
  const oldId=useEkas.getState().manufacturingConversationId!;
  await act(async()=>{await beginNewConversation();});
  await settle();
  expect(useEkas.getState().manufacturingConversationId).not.toBe(oldId);
  expect(scope()).not.toMatch(/FEED-03|JOB-8303|Line 03/);
  expect(meta()).toBe('No investigation selected · Synthetic');
  expect(host.textContent).not.toMatch(/Sample dataset|finite training grammar|training-plant-v1/);
  await act(async()=>{await submitUnifiedConversation('Investigate it.');});
  await settle();
  const article=host.querySelector('article.ekas-captured-reply')!;
  expect(article.textContent).toContain(NO_INVESTIGATION_YET);
  expect(article.textContent).not.toMatch(/FEED-03|JOB-8303|finite training grammar|training-plant-v1|Line 03 missed by 138/);
  expect(scope()).not.toMatch(/FEED-03|JOB-8303|Line 03/);
  expect(meta()).toBe('No investigation selected · Synthetic');
  const saved=await manufacturingClient().readConversation(useEkas.getState().manufacturingConversationId!);
  expect(saved.content.conversation.context.caseFocus).toBeNull();
  expect(saved.content.conversation.context.dashboardCase??null).toBeNull();
  expect(saved.content.conversation.turns.at(-1)!.answer.text).toBe(NO_INVESTIGATION_YET);
  const prior=await manufacturingClient().readConversation(oldId);
  expect(prior.content.conversation.context.caseFocus).toBe('downtime');
 }finally{
  await act(async()=>root.unmount());
  host.remove();
  vi.unstubAllGlobals();
  window.history.replaceState(null,'','/');
 }
},30000);
