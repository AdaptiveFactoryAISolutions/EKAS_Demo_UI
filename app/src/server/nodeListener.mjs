import {createServer} from 'node:http';
/** Loopback caller chooses listen port. Importing never binds or reads config. */
export function createNodeApplicationListener({handler}){
 return createServer(async(incoming,outgoing)=>{
  const abort=new AbortController();incoming.on('aborted',()=>abort.abort());outgoing.on('close',()=>{if(!outgoing.writableEnded)abort.abort()});
  try{let bytes=0;const chunks=[];for await(const chunk of incoming){const b=Buffer.from(chunk);bytes+=b.length;if(bytes>1000000){outgoing.writeHead(413);outgoing.end('Request too large');return}chunks.push(b)}
   const headers=new Headers();for(const [key,value] of Object.entries(incoming.headers)){if(typeof value==='string')headers.set(key,value);else if(value)headers.set(key,value.join(', '))}
   const method=incoming.method||'GET',url='http://127.0.0.1:'+incoming.socket.localPort+(incoming.url||'/');const request=new Request(url,{method,headers,...(method==='GET'||method==='HEAD'?{}:{body:Buffer.concat(chunks)}),signal:abort.signal});const result=await handler(request);outgoing.statusCode=result.status;result.headers.forEach((value,key)=>outgoing.setHeader(key,value));
   if(result.body){const reader=result.body.getReader();try{for(;;){const {done,value}=await reader.read();if(done)break;abort.signal.throwIfAborted();if(!outgoing.write(value))await new Promise(resolve=>outgoing.once('drain',resolve))}}finally{reader.releaseLock()}}outgoing.end();
  }catch{if(!outgoing.headersSent)outgoing.writeHead(500,{'Content-Type':'text/plain'});if(!outgoing.destroyed)outgoing.end('Application request failed.');}
 });
}
