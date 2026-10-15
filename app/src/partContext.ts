import {resultEligibility} from './runtime';
export type PartContext={part:string|null,revision:string|null,status:'valid'|'pending'|'unsupported'};
export const suppliedContext=():PartContext=>({part:'NW-A',revision:'P2',status:'valid'});
export function hydratePartContext(value:any):PartContext{if(!value)return suppliedContext();const part=typeof value.part==='string'?value.part:null,revision=typeof value.revision==='string'?value.revision:null;return {part,revision,status:!part||!revision?'pending':part==='NW-A'&&revision==='P2'?'valid':'unsupported'}}
export function parseContextCorrection(text:string,current:PartContext):PartContext|null{
 const part=text.match(/\b(NW-[A-Z0-9-]+)\b/i)?.[1].toUpperCase()||null;
 const revision=text.match(/\b(?:revision|rev)\s+([A-Z0-9.-]+)\b/i)?.[1].toUpperCase()||text.match(/\b(P\d+)\b/i)?.[1].toUpperCase()||null;
 const correction=/(?:use|change|correct|switch|different|another).*\b(?:part|revision|rev|NW-)/i.test(text)||current.status==='pending'&&!!(part||revision);
 if(!correction)return null;
 const requestedPart=part||(/different.*part|another.*part/i.test(text)?null:revision?current.part:null);
 return hydratePartContext({part:requestedPart,revision});
}
export function contextEligibility(context:PartContext,fault:string,asOf:string){return resultEligibility(context.status==='valid'?fault:'Missing data',asOf)}
export function contextExplanation(context:PartContext){return context.status==='pending'?'Context correction pending. Which part and revision should this investigation use? Current numeric results and actions are withheld.':context.status==='unsupported'?'Requested context '+context.part+' / '+context.revision+' has no compatible supplied records. Current answers, charts, metrics and actions are withheld; no P2 evidence is substituted.':'Supplied NW-A / P2 context restored explicitly. Earlier responses retain their captured context and timestamp.'}
