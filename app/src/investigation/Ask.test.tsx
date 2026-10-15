// @vitest-environment jsdom
import React,{act} from 'react';import {createRoot} from 'react-dom/client';import {it,expect,vi} from 'vitest';import {IDBFactory} from 'fake-indexeddb';
vi.mock('../retained/viz',()=>({Viz:()=>null}));
vi.mock('./EvidenceBoard',()=>({EvidenceBoard:({visual}:any)=><div aria-label="Service evidence chart">{visual.title}</div>}));
it('existing Ask composer drives the persistent investigation and restores natural history without new navigation',async()=>{
 vi.resetModules();vi.stubGlobal('indexedDB',new IDBFactory());(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 window.history.replaceState(null,'','/?demonstration=v55-component-owned');
 const {useEkas}=await import('../retained/store'),{ScreenBody}=await import('../retained/screens');await useEkas.persist.rehydrate();
 const host=document.createElement('div'),root=createRoot(host);document.body.append(host);
 try{
  await act(async()=>{useEkas.setState({screen:'ask',askThread:[],conversationId:undefined,manufacturingConversationId:undefined,conversationRoute:undefined});root.render(<ScreenBody/>)});
  const submit=async(text:string)=>{await act(async()=>useEkas.setState({askText:text}));await act(async()=>{[...host.querySelectorAll('button')].find(b=>b.textContent==='Run')!.click();await new Promise(resolve=>setTimeout(resolve,20))});for(let i=0;i<750;i++){if([...host.querySelectorAll('button')].some(b=>b.textContent==='Run'))break;await act(async()=>new Promise(resolve=>setTimeout(resolve,20)))}expect([...host.querySelectorAll('button')].some(b=>b.textContent==='Run')).toBe(true);};
  await submit('We missed our production goal.');expect(host.textContent).toContain('150 good units');expect(host.textContent).toContain('Line 03');expect(useEkas.getState().manufacturingConversationId).toBeTruthy();
  await submit('What job?');expect(host.textContent).toContain('JOB-8303');expect(host.textContent).toContain('NW-A');
  await submit('Assign it.');expect(host.textContent).toContain('Acceptance is still pending');await submit('Maintenance accepted it.');expect(host.textContent).toContain('maintenance acceptance is recorded');
  await submit('Was it approved?');expect(host.textContent).toContain('not recorded as approved');
  await act(async()=>[...host.querySelectorAll('button')].find(b=>b.textContent==='Evidence and investigation')!.click());expect(host.querySelector('[role="dialog"]')).toBeTruthy();expect(host.textContent).toContain('PFMEA-030');
  await act(async()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));expect(host.querySelector('[role="dialog"]')).toBeNull();
  const id=useEkas.getState().manufacturingConversationId;await useEkas.persist.flush();await act(async()=>useEkas.persist.rehydrate());expect(useEkas.getState().manufacturingConversationId).toBe(id);
  await act(async()=>{useEkas.getState().go('home');useEkas.getState().go('ask')});expect(host.textContent).toContain('not recorded as approved');
 }finally{await act(async()=>root.unmount());host.remove();vi.unstubAllGlobals();window.history.replaceState(null,'','/')}
},30000);
