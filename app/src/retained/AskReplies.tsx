import{followLatestReplyUntilSettled}from'./latestReplyPosition';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ManufacturingReply} from '../investigation/Replies';
import {useEkas} from './store';
import type {Capture} from './capturedView';
type Reply=ReturnType<typeof useEkas.getState>['askThread'][number];
function ReplyCard({reply,index,latest,renderCapture}:{reply:Reply;index:number;latest?:boolean;renderCapture:(capture:Capture)=>ReactNode}){
 const [chartOpen,setChartOpen]=useState(!!latest&&!!reply.capture?.rows.length),feedback=useEkas(s=>s.feedback['answer:'+index]);
 if(reply.manufacturing)return <ManufacturingReply reference={reply.manufacturing}/>;
 return <article className="rounded-lg border border-line bg-surface p-4 space-y-3"><h2 className="font-semibold">{reply.q}</h2><p className="text-sm text-muted">{reply.note}</p>{reply.resultId&&<small>Captured result {reply.resultId}</small>}{reply.capture?<><button className="min-h-11 rounded-lg border border-line px-3" aria-expanded={chartOpen} onClick={()=>setChartOpen(open=>!open)}>{chartOpen?'Hide':'Show'} captured chart and query</button>{chartOpen&&renderCapture(reply.capture)}</>:<p>Historical chart unavailable for this older capture; original note retained.</p>}<div className="flex flex-wrap gap-2"><button className="min-h-11 rounded-lg border border-line px-3" onClick={()=>useEkas.setState(s=>({feedback:{...s.feedback,['answer:'+index]:'useful'}}))}>Useful answer</button><button className="min-h-11 rounded-lg border border-line px-3" onClick={()=>useEkas.setState(s=>({feedback:{...s.feedback,['answer:'+index]:'unclear'}}))}>Unclear answer</button><span role="status">{feedback?'Marked '+feedback:''}</span></div></article>;
}
/** Latest response stays by the composer. Opening earlier replies explicitly pauses follow. */
export function AskReplies({thread,renderCapture}:{thread:Reply[];renderCapture:(capture:Capture)=>ReactNode}){
 const [historyOpen,setHistoryOpen]=useState(false),[unread,setUnread]=useState(false),latestRef=useRef<HTMLDivElement>(null),previous=useRef(thread.length),latest=thread.at(-1),follow=useRef(true);follow.current=!historyOpen;
 const positionCleanup=useRef<(()=>void)|undefined>(undefined);
 const reveal=()=>{positionCleanup.current?.();const node=latestRef.current;if(node)positionCleanup.current=followLatestReplyUntilSettled(node,()=>follow.current)};
 useEffect(()=>()=>positionCleanup.current?.(),[]);
 useEffect(()=>{const appended=thread.length>previous.current;previous.current=thread.length;if(appended){if(historyOpen)setUnread(true);else reveal()}},[thread.length,historyOpen]);
 const jump=()=>{setHistoryOpen(false);setUnread(false);reveal();latestRef.current?.focus({preventScroll:true})};
 if(!latest)return null;
 return <section aria-label="Conversation replies" className="space-y-3"><div className="flex flex-wrap items-center gap-2"><strong>Latest reply</strong><button className="min-h-11 rounded-lg border border-line px-3" onClick={jump}>{unread?'New reply · ':''}Jump to latest reply</button>{historyOpen&&<span>Reading earlier replies · automatic following paused</span>}</div><div ref={latestRef} tabIndex={-1} aria-label="Latest conversation reply" aria-live="polite" style={{scrollMarginTop:100}}><ReplyCard key={thread.length-1} reply={latest} index={thread.length-1} latest renderCapture={renderCapture}/></div><button className="min-h-11 rounded-lg border border-line px-3" aria-expanded={historyOpen} disabled={thread.length<2} onClick={()=>{setHistoryOpen(open=>!open);setUnread(false)}}>Earlier replies ({thread.length-1})</button>{historyOpen&&<div aria-label="Earlier conversation replies" role="region" tabIndex={0} className="space-y-3" style={{maxHeight:'min(60vh, 36rem)',overflowY:'auto',overscrollBehavior:'contain',minWidth:0}}>{thread.slice(0,-1).map((reply,index)=><ReplyCard key={index} reply={reply} index={index} renderCapture={renderCapture}/>)}</div>}</section>;
}
