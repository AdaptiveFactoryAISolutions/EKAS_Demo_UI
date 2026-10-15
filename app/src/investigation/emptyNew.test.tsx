// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';import {act} from 'react';import {createRoot} from 'react-dom/client';import {IDBFactory} from 'fake-indexeddb';
it('empty Ask offers New conversation and creates an empty durable identity',async()=>{
 vi.resetModules();vi.stubGlobal('indexedDB',new IDBFactory());(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 const {useEkas}=await import('../retained/store'),{ManufacturingContext}=await import('./Replies'),{manufacturingClient}=await import('./unified');await useEkas.persist.rehydrate();
 const host=document.createElement('div'),root=createRoot(host);document.body.append(host);
 try{await act(async()=>{useEkas.setState({manufacturingConversationId:undefined,conversationRoute:undefined,askThread:[],askText:''});root.render(<ManufacturingContext/>)});
 const button=[...host.querySelectorAll('button')].find(b=>b.textContent==='New conversation');expect(button).toBeTruthy();await act(async()=>{button!.click();await new Promise(r=>setTimeout(r,100))});
 for(let i=0;i<500&&!useEkas.getState().manufacturingConversationId;i++)await act(async()=>new Promise(r=>setTimeout(r,20)));const id=useEkas.getState().manufacturingConversationId;expect(id).toBeTruthy();expect((await manufacturingClient().readConversation(id!)).content.conversation.turns).toHaveLength(0);
 }finally{await act(async()=>root.unmount());host.remove();vi.unstubAllGlobals();}
},30000);
