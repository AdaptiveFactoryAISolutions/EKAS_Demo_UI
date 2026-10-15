import type {Provider} from './conversationBoundary';
import {createOpenAIConversationProvider,type ProviderBudget} from './openAIProvider';
import {createScriptedCanonicalProvider} from './scriptedCanonicalProvider';
export type ConversationServerMode='server-disabled'|'server-fake'|'server-openai-mock'|'server-openai';
export type ProviderConfiguration={mode:'disabled'}|{mode:'scripted-test';delayMs?:number}|{mode:'openai-mock';model:string;maxOutputTokens:number;budget:ProviderBudget;fetchImpl:typeof fetch}|{mode:'openai';authority:{assertActivationAllowed():void};openAI:Parameters<typeof createOpenAIConversationProvider>[0]};
/** Explicit trusted-server composition, never an environment/secret/price reader.
 * Live authority must enforce fresh merged-artifact review, secure credentials,
 * reviewed pricing/budget and operator authorization. No default approval exists.
 * Mock mode is separately disclosed and supplies no real credential. */
export function selectConversationProvider(config:ProviderConfiguration={mode:'disabled'}):{mode:ConversationServerMode;provider:Provider|undefined}{
 if(config.mode==='disabled')return {mode:'server-disabled',provider:undefined};
 if(config.mode==='scripted-test')return {mode:'server-fake',provider:createScriptedCanonicalProvider({delayMs:config.delayMs})};
 if(config.mode==='openai-mock'){if(config.fetchImpl===globalThis.fetch)throw Error('MOCK_FETCH_REQUIRED');return {mode:'server-openai-mock',provider:createOpenAIConversationProvider({apiKey:'mock-only-no-credential',model:config.model,maxOutputTokens:config.maxOutputTokens,budget:config.budget,fetchImpl:config.fetchImpl})};}
 if(config.mode==='openai'){if(!config.authority||typeof config.authority.assertActivationAllowed!=='function')throw Error('LIVE_ACTIVATION_HELD');config.authority.assertActivationAllowed();const provider=createOpenAIConversationProvider(config.openAI);return {mode:'server-openai',provider:{id:provider.id,async respond(input){config.authority.assertActivationAllowed();const result=await provider.respond(input);config.authority.assertActivationAllowed();return result;}}};}
 throw Error('INVALID_PROVIDER_CONFIGURATION');
}
