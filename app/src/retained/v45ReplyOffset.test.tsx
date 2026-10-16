// @vitest-environment jsdom
import React,{act} from 'react';import {createRoot} from 'react-dom/client';import {it,expect,vi} from 'vitest';import {AskReplies} from './AskReplies';
it('remeasures a settled 173px sticky header after automatic completion at a narrow viewport',async()=>{
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;let height=120;const frames:FrameRequestCallback[]=[];
 const raf=vi.spyOn(window,'requestAnimationFrame').mockImplementation(fn=>{frames.push(fn);return frames.length});
 const rect=vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return {top:this.classList.contains('retained-header')?0:132.5,bottom:this.classList.contains('retained-header')?height:200,height,width:305,left:0,right:305,x:0,y:0,toJSON:()=>({})}});
 const scroll=vi.fn();Object.defineProperty(HTMLElement.prototype,'scrollIntoView',{configurable:true,value:scroll});
 const host=document.createElement('div');document.body.append(host);const header=document.createElement('header');header.className='retained-header';document.body.prepend(header);const root=createRoot(host);
 try{const old=[{q:'initial',note:'immutable note'}];await act(async()=>root.render(<AskReplies thread={old} renderCapture={()=>null}/>));await act(async()=>root.render(<AskReplies thread={[...old,{q:'new precision answer',note:'new note'}]} renderCapture={()=>null}/>));expect(scroll).toHaveBeenCalledTimes(1);height=173;await act(async()=>frames.shift()!(0));expect(host.querySelector<HTMLElement>('[aria-label="Latest conversation reply"]')!.style.scrollMarginTop).toBe('197px');expect(scroll).toHaveBeenCalledTimes(2);expect(old[0].note).toBe('immutable note');}
 finally{await act(async()=>root.unmount());host.remove();header.remove();raf.mockRestore();rect.mockRestore();delete (HTMLElement.prototype as any).scrollIntoView}
});
