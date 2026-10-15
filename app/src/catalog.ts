import source from '../inputs/metrics-source-occurrences.json';
import sectionSource from '../inputs/metrics-source-sections.json';
import sourceGroups from '../inputs/canonical-metric-groups.json';
import guards from '../inputs/metric-alias-guards.json';
export type Occurrence={id:string,name:string,key:string,kind:string,family:string,formula:string,sourceLines:string,unit:string,readiness:string,section:number,requiredInputs:string,semanticFlags:string[],surface:string};
// Source transcription is preserved. No definition is activated or certified by catalog inclusion.
export const catalog:Occurrence[]=source.map(r=>({...r,unit:r.unit??'Not specified in source',readiness:'Definition only'}));
export const sourceSections=sectionSource;
export const missingIds=Array.from({length:322},(_,i)=>`KPI-${String(i+1).padStart(3,'0')}`).filter(id=>!catalog.some(x=>x.id===id));
export const groups=Object.entries(sourceGroups).map(([key,ids])=>({key,rows:ids.map(id=>catalog.find(x=>x.id===id)!)}));
export const allKindGroupCount=new Set(catalog.map(x=>x.key)).size;
export const aliasGuards=guards.alias_groups;
export function ambiguousChoices(text:string):string[]{const entry=Object.entries(guards.ambiguous_shorthand).find(([alias])=>alias.toLowerCase()===text.trim().toLowerCase());return entry?.[1]||[];}
export function catalogSearch(row:Occurrence,text:string){const q=text.trim().toLowerCase();if(!q)return true;const ambiguous=ambiguousChoices(text);if(ambiguous.length)return ambiguous.includes(row.key);const names=catalog.filter(x=>x.key===row.key).map(x=>x.name);const alias=aliasGuards.find(g=>g.canonical_id===row.key);return `${row.id} ${row.name} ${row.key} ${row.formula} ${names.join(' ')} ${alias?.aliases.join(' ')||''}`.toLowerCase().includes(q);}
export function catalogView(mode:string){return mode==='All source occurrences'?catalog:mode==='Governance, aliases & references'?catalog.filter(x=>!['metric','analytical_measure','model'].includes(x.kind)):groups.map(x=>x.rows[0]);}
