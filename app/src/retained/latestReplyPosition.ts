/** Follow only a newly appended or explicitly requested reply while its saved
 * content and charts settle. Native layout acceptance is separate from rAF. */
export function followLatestReplyUntilSettled(node:HTMLElement,isFollowing:()=>boolean=()=>true){let active=true,frame:number|null=null;const domOpen=()=>typeof window!=='undefined'&&typeof document!=='undefined';
 const headerBottom=()=>Math.max(0,document.querySelector('.retained-header')?.getBoundingClientRect().bottom||0);
 const contextLimit=()=>{const scroller=node.closest('[aria-label="Workspace content"]');const scrollerTop=scroller?.getBoundingClientRect().top||0;const contextBottom=document.querySelector('.ekas-context')?.getBoundingClientRect().bottom||headerBottom();return Math.max(headerBottom(),contextBottom)+24-scrollerTop};
 const clearHeading=()=>{const scroller=node.closest('[aria-label="Workspace content"]');const heading=document.querySelector('#ekas-chat-main > h1');if(!scroller||!heading)return;const limit=(document.querySelector('.ekas-context')?.getBoundingClientRect().bottom||headerBottom())+20;const overlap=limit-heading.getBoundingClientRect().top;if(overlap>0.5)scroller.scrollTop=Math.max(0,scroller.scrollTop-overlap)};
 const place=()=>{if(!active||!domOpen())return;node.style.scrollMarginTop=Math.ceil(contextLimit())+'px';node.scrollIntoView?.({block:'start',behavior:'auto'});clearHeading()};
 const correct=()=>{frame=null;if(!active||!domOpen()||!isFollowing()||!node.isConnected)return;const top=node.getBoundingClientRect().top,composer=document.querySelector('.ekas-composer')?.getBoundingClientRect().top,bottom=composer&&composer>0?composer:window.innerHeight,limit=(document.querySelector('.ekas-context')?.getBoundingClientRect().bottom||headerBottom())+16;if(top<limit||top>bottom-80)place();else clearHeading()};
 const queue=()=>{if(active&&domOpen()&&frame===null)frame=requestAnimationFrame(correct)};
 const stop=()=>{active=false;if(frame!==null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(frame);frame=null};
 const key=(e:KeyboardEvent)=>{if(['PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(e.key))stop()};
 window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchmove',stop,{passive:true});window.addEventListener('keydown',key);
 const mutation=new MutationObserver(queue);mutation.observe(node.parentElement||node,{childList:true,subtree:true});const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(queue);resize?.observe(node);if(node.parentElement)resize?.observe(node.parentElement);const header=document.querySelector('.retained-header');if(header)resize?.observe(header);
 place();queue();const timeout=window.setTimeout(stop,3000);
 return()=>{stop();if(!domOpen())return;window.clearTimeout(timeout);mutation.disconnect();resize?.disconnect();window.removeEventListener('wheel',stop);window.removeEventListener('touchmove',stop);window.removeEventListener('keydown',key)};
}
