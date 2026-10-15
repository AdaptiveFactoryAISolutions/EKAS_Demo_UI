// @vitest-environment jsdom
import React,{act} from 'react';import {createRoot} from 'react-dom/client';import {it,expect,vi} from 'vitest';
vi.mock('./viz',()=>({Viz:()=>null}));
import {ScreenBody,Overlays} from './screens';import {useEkas} from './store';import {emptyQuery} from './model';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
for(const edited of [false,true])it('Create after '+(edited?'editing':'viewing')+' preserves original across routes, repeated Save and reload',async()=>{
 await useEkas.persist.rehydrate();const before=useEkas.getState(),host=document.createElement('div'),root=createRoot(host);document.body.append(host);
 const original={id:'original-oee',query:{...emptyQuery(),title:'OEE by Job',columns:['oee','job'],chart:'line' as const,filters:[{col:'job',op:'in' as const,values:['UIA-HIGH-OEE']}]},updated:'original timestamp'};
 try{
 await act(async()=>{useEkas.setState({screen:'answers',answers:[structuredClone(original)],openedAnswerId:undefined,past:[],future:[]});root.render(<><ScreenBody/><Overlays/></>)});
 const open=[...host.querySelectorAll('button')].find(b=>b.textContent?.startsWith('OEE by Job'))!;await act(async()=>open.click());
 if(edited)await act(async()=>useEkas.getState().patchQuery({title:'Uncommitted edit',chart:'bar'}));
 async function create(){await act(async()=>useEkas.setState({createOpen:true}));const dialog=host.querySelector('[role="dialog"]')!;await act(async()=>[...dialog.querySelectorAll('button')].find(b=>b.textContent==='Answer')!.click())}
 await create();expect(useEkas.getState().openedAnswerId).toBeUndefined();expect(useEkas.getState().past).toEqual([]);expect(useEkas.getState().query.columns).toEqual([]);
 await act(async()=>{useEkas.getState().patchQuery({...emptyQuery(),title:'Downtime by Job',columns:['downtime','job'],chart:'bar',filters:[{col:'job',op:'in',values:['UIA-ZERO-OEE']}]});useEkas.getState().go('home');useEkas.getState().go('search');useEkas.getState().saveAnswer()});
 const id=useEkas.getState().openedAnswerId;expect(id).not.toBe(original.id);expect(useEkas.getState().answers).toHaveLength(2);expect(useEkas.getState().answers.find(a=>a.id===original.id)).toEqual(original);
 await act(async()=>useEkas.getState().saveAnswer());expect(useEkas.getState().answers).toHaveLength(2);
 await useEkas.persist.flush();await act(async()=>useEkas.persist.rehydrate());expect(useEkas.getState().openedAnswerId).toBe(id);expect(useEkas.getState().query.chart).toBe('bar');expect(useEkas.getState().query.filters[0].values).toEqual(['UIA-ZERO-OEE']);expect(useEkas.getState().answers.find(a=>a.id===original.id)).toEqual(original);
 await create();await act(async()=>{useEkas.getState().patchQuery({title:'Third',columns:['fpy','part']});useEkas.getState().saveAnswer()});expect(useEkas.getState().answers).toHaveLength(3);
 await act(async()=>useEkas.getState().go('answers'));await act(async()=>[...host.querySelectorAll('button')].find(b=>b.textContent?.startsWith('OEE by Job'))!.click());await act(async()=>useEkas.getState().patchQuery({chart:'pie',title:'Deliberate edit'}));expect(useEkas.getState().answers.find(a=>a.id===original.id)).toEqual(original);
 await act(async()=>{useEkas.getState().saveAnswer();useEkas.getState().saveAnswer()});expect(useEkas.getState().answers).toHaveLength(3);expect(useEkas.getState().answers.find(a=>a.id===original.id)?.query.chart).toBe('pie');expect(useEkas.getState().answers.find(a=>a.id===id)?.query.title).toBe('Downtime by Job');
 }finally{await act(async()=>root.unmount());host.remove();useEkas.setState(before)}
});
