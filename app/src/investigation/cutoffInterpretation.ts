export type CutoffInterpretation={kind:'absent'}|{kind:'explicit';asOf:string}|{kind:'unsupported';reason:string};
export function interpretCutoff(question:string):CutoffInterpretation{
 if(!/\bas of\b/i.test(question))return {kind:'absent'};
 const token=question.match(/\bas of\s+(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)(?=[\s.,!?]|$)/i)?.[1];
 if(!token||!Number.isFinite(Date.parse(token)))return {kind:'unsupported',reason:'Specify an exact UTC cutoff such as 2026-10-06T13:59:59Z. No current values were substituted.'};
 const asOf=new Date(token).toISOString().replace('.000Z','Z');if(asOf.slice(0,19)!==token.slice(0,19))return {kind:'unsupported',reason:'That UTC date/time is invalid. No current values were substituted.'};return {kind:'explicit',asOf};
}
