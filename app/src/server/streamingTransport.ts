import type {Transport} from '../platform/contract';import {createSameOriginTransport,type ApplicationTransportOptions} from './sameOriginTransport';
// Committed envelopes include immutable history and source captures; a full lifecycle exceeds 1 MB.
const MAX_CAPTURE_FRAME_CHARS=16*1024*1024;
export type StreamEvent={version:'ekas-stream-v1';operationId:string;type:string;payload:unknown};
export function createStreamingApplicationTransport(options:ApplicationTransportOptions&{onProgress?:(event:StreamEvent)=>void}):Transport&{cancelCurrent:()=>void}{
 let current:AbortController|undefined;
 const base=createSameOriginTransport({...options,fetch:async(url,init)=>{
  const wire=JSON.parse(String(init?.body));if(!wire.path.endsWith('/messages'))return options.fetch(url,init);
  const abort=new AbortController();current=abort;try{
   const response=await options.fetch(url,{...init,signal:abort.signal,headers:{...init?.headers,Accept:'text/event-stream'}});if(!response.headers.get('Content-Type')?.includes('text/event-stream'))return response;
   if(!response.body)throw Error('STREAM_INTERRUPTED');const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
   try{for(;;){const {done,value}=await reader.read();abort.signal.throwIfAborted();if(done)throw Error('STREAM_INTERRUPTED');buffer+=decoder.decode(value,{stream:true});if(buffer.length>MAX_CAPTURE_FRAME_CHARS)throw Error('STREAM_LIMIT');let end;while((end=buffer.indexOf('\n\n'))>=0){const frame=buffer.slice(0,end);buffer=buffer.slice(end+2);if(!frame.startsWith('data: '))throw Error('INVALID_STREAM_FRAME');let event:StreamEvent;try{event=JSON.parse(frame.slice(6))}catch{throw Error('INVALID_STREAM_FRAME')}if(event.version!=='ekas-stream-v1'||event.operationId!==wire.idempotencyKey)throw Error('INVALID_STREAM_FRAME');if(event.type==='turn.committed'){const result=event.payload as any;return Response.json(result,{status:result.status});}if(event.type==='operation.error')throw Error(String((event.payload as any)?.message||'OPERATION_RECONCILIATION_REQUIRED'));if(event.type!=='operation.started'&&event.type!=='model.progress')throw Error('INVALID_STREAM_FRAME');options.onProgress?.(event);}}
   }finally{reader.releaseLock()}
  }finally{if(current===abort)current=undefined}
 }});
 return {...base,cancelCurrent(){current?.abort()}};
}
