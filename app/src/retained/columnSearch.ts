import type {Column} from './model';
const normalize=(value:string)=>value.toLowerCase().replace(/[^a-z0-9%]+/g,' ').trim();
export function columnMatchesSearch(column:Column,search:string){const words=normalize(search).split(/\s+/).filter(Boolean);const text=normalize([column.id,column.name,column.description,column.unit??'',column.agg,column.kind,...column.synonyms].join(' '));return words.every(word=>text.includes(word));}
