let barrier:(()=>void|Promise<void>)|undefined;
export function registerCommitBarrier(next:()=>void|Promise<void>){barrier=next}
export function afterCommitted(success:()=>void,failure:(message:string)=>void){try{const pending=barrier?.();if(pending instanceof Promise)void pending.then(success).catch(error=>failure(error instanceof Error?error.message:'Save failed'));else success()}catch(error){failure(error instanceof Error?error.message:'Save failed')}}
