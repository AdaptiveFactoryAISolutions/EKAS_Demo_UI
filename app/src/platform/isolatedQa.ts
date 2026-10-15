/** Owned synthetic QA route. Never inferred from default/review routes or existing state. */
export const qaRoot=(path:string)=>path==='/ekas-qa-v42/'||path==='/ekas-qa-v43/'||path==='/ekas-qa-v45/'||path==='/ekas-qa-v46/'||path==='/ekas-qa-v47/'||path==='/ekas-qa-v48/';
export const qaNamespace=(path:string)=>path==='/ekas-qa-v48/'?'qa-v48-owned.':path==='/ekas-qa-v47/'?'qa-v47-owned.':path==='/ekas-qa-v46/'?'qa-v46-owned.':path==='/ekas-qa-v45/'?'qa-v45-owned.':path==='/ekas-qa-v43/'?'qa-v43-owned.':path==='/ekas-qa-v42/'?'qa-v42-owned.':'';
export const qaDatabase=(path:string)=>path==='/ekas-qa-v48/'?'ekas-qa-v48-owned':path==='/ekas-qa-v47/'?'ekas-qa-v47-owned':path==='/ekas-qa-v46/'?'ekas-qa-v46-owned':path==='/ekas-qa-v45/'?'ekas-qa-v45-owned':path==='/ekas-qa-v43/'?'ekas-qa-v43-owned':path==='/ekas-qa-v42/'?'ekas-qa-v42-owned':'ekas-local-persistence-v1';

export const qaNorthworksRoot=(path:string)=>path==='/ekas-qa-v43/'||path==='/ekas-qa-v45/'||path==='/ekas-qa-v46/'||path==='/ekas-qa-v47/'||path==='/ekas-qa-v48/';
