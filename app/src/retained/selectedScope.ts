import type {Filter} from './model';
export type SelectedPoint={col:string;value:string;dimensions?:Record<string,string>};
export function selectedDimensions(point:SelectedPoint){return {...(point.dimensions??{}),[point.col]:point.value};}
export function selectedScopeFilters(filters:Filter[],point:SelectedPoint){const dims=selectedDimensions(point),next=filters.map(f=>f.op==='in'&&dims[f.col]!==undefined?{...f,values:f.values.filter(v=>v===dims[f.col])}:structuredClone(f));for(const [col,value] of Object.entries(dims))if(!next.some(f=>f.col===col&&f.op==='in'))next.push({col,op:'in',values:[value]});return next;}
