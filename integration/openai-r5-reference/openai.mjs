/** Server-only adapter. The UI consumes EKAS events, never provider wire objects. */
export function createOpenAIProvider({apiKey,model,maxOutputTokens=1200,fetchImpl=fetch,budget}) {
  if(!apiKey||!model)throw new Error('MODEL_CONFIGURATION_REQUIRED');
  if(!Number.isInteger(maxOutputTokens)||maxOutputTokens<1||maxOutputTokens>4096)throw new Error('INVALID_OUTPUT_LIMIT');
  if(fetchImpl===fetch&&!budget)throw new Error('DEMO_BUDGET_REQUIRED');
  if(budget&&(model!=='gpt-6.1-sol'||maxOutputTokens>1200))throw new Error('DEMO_MODEL_REFUSED');
  let busy=false;
  return {id:'openai-demo',model,maxOutputTokens,async *respond({history,tools,signal}) {
    if(busy)throw new Error('DEMO_PROVIDER_BUSY');
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    busy=true;try{
    if(JSON.stringify({history,tools}).length>64000)throw new Error('MODEL_CONTEXT_LIMIT');
    const input=history.flatMap(item=>{if(item.kind==='provider.frame'){if(item.provider!=='openai-demo')throw new Error('MODEL_HISTORY_PROVIDER_CONFLICT');return item.items;}if(item.kind==='tool.result')return [{type:'function_call_output',call_id:item.callId,output:JSON.stringify(item.result)}];return [item]});
    if(budget&&input.some(item=>item.role?(!['user','assistant','developer','system'].includes(item.role)||!(typeof item.content==='string'||Array.isArray(item.content)&&item.content.every(c=>['input_text','output_text','refusal'].includes(c.type)))):!['function_call','function_call_output','reasoning','compaction'].includes(item.type)))throw new Error('DEMO_INPUT_REFUSED');
    if(budget&&tools.some(tool=>tool.type!=='function'))throw new Error('DEMO_TOOL_REFUSED');
    // Byte cap is a resource limit only; cost uses the published model context maximum.
    if(new TextEncoder().encode(JSON.stringify({model,input,tools})).length>131072)throw new Error('MODEL_CONTEXT_LIMIT');
    const reservation=budget?.reserve({maxOutputTokens});
    let accounted=false;
    try{
    const boundedSignal=signal?AbortSignal.any([signal,AbortSignal.timeout(60000)]):AbortSignal.timeout(60000);
    boundedSignal.throwIfAborted();
    if(budget)budget.beforeRequest(reservation.id); // durable in-flight marker and fresh expiry check immediately before the sole network request
    const response=await fetchImpl('https://api.openai.com/v1/responses',{method:'POST',redirect:'error',signal:boundedSignal,headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,input,tools,store:false,stream:true,max_output_tokens:maxOutputTokens,parallel_tool_calls:false,...(budget?{service_tier:'default',reasoning:{effort:'low'}}:{})})});
    if(!response.ok||!response.body)throw new Error(response.status===429?'MODEL_RATE_LIMIT':'MODEL_UNAVAILABLE');
    let buffer='',completed=false;const decoder=new TextDecoder();const reader=response.body.getReader();
    try{while(true){const {value,done}=await reader.read();if(done)break;buffer=(buffer+decoder.decode(value,{stream:true})).replaceAll('\r\n','\n');let boundary;
      while((boundary=buffer.indexOf('\n\n'))!==-1){const frame=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);const data=frame.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n');if(!data||data==='[DONE]')continue;let event;try{event=JSON.parse(data)}catch{throw new Error('MODEL_PROTOCOL_ERROR')}
        if(completed)throw new Error('MODEL_PROTOCOL_ERROR');
        if(event.type==='response.output_text.delta'&&typeof event.delta==='string')yield {type:'text.delta',text:event.delta};
        else if(event.type==='response.completed'){if(!Array.isArray(event.response?.output))throw new Error('MODEL_PROTOCOL_ERROR');if(budget)budget.recordUsage(reservation.id,event.response.usage);accounted=true;completed=true;yield {type:'model.completed',calls:event.response.output.filter(item=>item.type==='function_call').map(item=>({id:item.call_id,name:item.name,arguments:item.arguments})),continuation:event.response.output};}
        else if(['error','response.failed','response.incomplete'].includes(event.type))throw new Error('MODEL_RESPONSE_FAILED');
      }
      if(buffer.length>1048576)throw new Error('MODEL_PROTOCOL_LIMIT');
    }if(!completed)throw new Error('MODEL_STREAM_INTERRUPTED');}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
    }catch(error){if(budget&&!accounted){try{budget.markUnknown(reservation.id)}catch{throw new Error('DEMO_BUDGET_RECOVERY_REQUIRED')}}throw error;}
    }finally{busy=false;}
  }};
}
