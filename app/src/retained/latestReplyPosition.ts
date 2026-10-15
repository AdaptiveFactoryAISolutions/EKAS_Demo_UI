/** Follow only a newly appended or explicitly requested reply while its saved
 * content and charts settle. Native layout acceptance is separate from rAF. */
export function followLatestReplyUntilSettled(node:HTMLElement,isFollowing:()=>boolean=()=>true){let active=true,frame:number|null=null;
 const headerBottom=()=>Math.max(0,document.querySelector('.retained-header')?.getBoundingClientRect().bottom||0);
 const place=()=>{if(!active)return;node.style.scrollMarginTop=Math.ceil(headerBottom()+12)+'px';node.scrollIntoView?.({block:'start',behavior:'auto'})};
 const correct=()=>{frame=null;if(!active||!isFollowing()||!node.isConnected)return;const top=node.getBoundingClientRect().top,composer=document.querySelector('.ekas-composer')?.getBoundingClientRect().top,bottom=composer&&composer>0?composer:window.innerHeight;if(top<headerBottom()+8||top>bottom-80)place()};
 const queue=()=>{if(active&&frame===null)frame=requestAnimationFrame(correct)};
 const stop=()=>{active=false;if(frame!==null)cancelAnimationFrame(frame);frame=null};
 const key=(e:KeyboardEvent)=>{if(['PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(e.key))stop()};
 window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchmove',stop,{passive:true});window.addEventListener('keydown',key);
 const mutation=new MutationObserver(queue);mutation.observe(node.parentElement||node,{childList:true,subtree:true});const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(queue);resize?.observe(node);if(node.parentElement)resize?.observe(node.parentElement);const header=document.querySelector('.retained-header');if(header)resize?.observe(header);
 place();queue();const timeout=window.setTimeout(stop,3000);
 return()=>{stop();window.clearTimeout(timeout);mutation.disconnect();resize?.disconnect();window.removeEventListener('wheel',stop);window.removeEventListener('touchmove',stop);window.removeEventListener('keydown',key)};
}
