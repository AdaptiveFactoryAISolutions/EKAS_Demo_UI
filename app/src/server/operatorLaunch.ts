import type{ProviderConfiguration}from'./providerConfiguration';import type{ProviderBudget}from'./openAIProvider';
export type ReviewedOperatorPolicy={model:string;maxOutputTokens:number;inputByteBound:number;framingTokenAllowance:number;inputContextTokenBound:number};
export type OperatorOptions={port:number;directory:string;statePath:string};
export type OperatorDependencies={assertAuthority():ReviewedOperatorPolicy;openBudget(policy:ReviewedOperatorPolicy):{budget:ProviderBudget;assertEligible():void;close():void};readCredential():Promise<string>;fetchImpl?:typeof fetch};
/** Default inert. Live dependencies are the separately accepted operator composition,
 * never browser configuration, synthetic role approval, environment or a key file. */
export async function prepareOperatorLaunch(config:{options:OperatorOptions;mode?:'disabled'|'openai'},deps:OperatorDependencies){
 if(!config.mode||config.mode==='disabled')return{...config.options,providerConfiguration:{mode:'disabled'}as ProviderConfiguration,close:()=>{}};
 if(config.mode!=='openai')throw Error('LIVE_ACTIVATION_HELD');
 const policy=deps.assertAuthority();const held=deps.openBudget(policy);
 try{held.assertEligible();const apiKey=await deps.readCredential();deps.assertAuthority();held.assertEligible();if(typeof apiKey!=='string'||!apiKey.trim()||apiKey.length>512||/[\r\n]/.test(apiKey))throw Error('PRIVATE_OPERATOR_CREDENTIAL_REQUIRED');
 const assertActivationAllowed=()=>{deps.assertAuthority();held.assertEligible()};
 return{...config.options,providerConfiguration:{mode:'openai',authority:{assertActivationAllowed},openAI:{apiKey,model:policy.model,maxOutputTokens:policy.maxOutputTokens,budget:held.budget,fetchImpl:deps.fetchImpl??globalThis.fetch,wirePolicy:{inputByteBound:policy.inputByteBound,framingTokenAllowance:policy.framingTokenAllowance,inputContextTokenBound:policy.inputContextTokenBound,serviceTier:'default'}}}as ProviderConfiguration,close:held.close};
 }catch(error){held.close();throw error}
}
