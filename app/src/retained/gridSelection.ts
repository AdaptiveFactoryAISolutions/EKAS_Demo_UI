import type {Row} from './model';
const escaped=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function sliceCell(value:unknown){return '<button type="button" class="ekas-grid-slice" aria-label="Select slice '+escaped(String(value??''))+'">'+escaped(String(value??''))+'</button>'}
/** Native Grid formatter and ordinary delegated button events retain exact row identity after native sorting. */
export function selectGridSlice(target:EventTarget|null,rows:Row[],group:string|undefined,onPoint:(field:string,value:string,dimensions:Record<string,string>)=>void){if(!(target instanceof Element)||!group)return;const button=target.closest('button.ekas-grid-slice');if(!button)return;const row=rows.find(r=>r.key===button.textContent);if(row&&row.dims[group]!==undefined)onPoint(group,row.dims[group],{...row.dims});}
