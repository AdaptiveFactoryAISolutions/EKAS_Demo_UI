/** A serialized Board contains Highcharts defaults. Only native layout and declared
 * editable presentation fields may override a governed analytical definition. */
export function restoreBoard(base:any,saved:any,metric:string):any {
 if(saved?.snapshotId!=='northworks-demo-v1'||saved.metric!==metric||!saved.board?.gui)return base;
 return {...base,gui:saved.board.gui,components:base.components.map((component:any,i:number)=>{
  const previous=saved.board.components?.[i];
  if(!previous||previous.type!==component.type)return component;
  const result={...component,renderTo:previous.renderTo||component.renderTo};
  if(component.chartOptions){const title=previous.chartOptions?.title?.text;result.chartOptions={...component.chartOptions,title:{...component.chartOptions.title,...(typeof title==='string'?{text:title}:{})}};}
  if(component.gridOptions){result.gridOptions={...component.gridOptions,columns:(component.gridOptions.columns||[]).map((column:any)=>{const old=previous.gridOptions?.columns?.find((c:any)=>c.id===column.id);const order=old?.sorting?.order;return {...column,...(['asc','desc',null].includes(order)?{sorting:{...column.sorting,order,...(Number.isInteger(old.sorting.priority)&&old.sorting.priority>0?{priority:old.sorting.priority}:{})}}:{})};})};}
  return result;
 })};
}
export type ResultStatus='frozen'|'stale'|'missing';
export function resultEligibility(condition:string,asOf:string){
 const status:ResultStatus=condition==='Missing data'?'missing':condition==='Stale'?'stale':'frozen';
 return {status,display:status!=='missing',decision:status==='frozen',asOf,label:status==='missing'?`Inputs missing · numeric results suppressed · snapshot ${asOf}`:status==='stale'?`Stale synthetic snapshot ${asOf} · historical illustration only · decisions blocked`:`Frozen synthetic snapshot ${asOf} · declared fixture, not a live feed`};
}
export function historyMatches(turn:{q:string,a:string},query:string){return `${turn.q} ${turn.a}`.toLowerCase().includes(query.trim().toLowerCase());}

export function readSavedBoard(text:string|null){try{return JSON.parse(text||'null')}catch{return null}}

/** Capture runtime Grid sorting using the documented options API. Board snapshots
 * otherwise contain initial user options and omit interactive sort changes. */
export function savedBoardOptions(board:any){
 const options=board.getOptions();
 for(const mounted of board.mountedComponents||[]){
  const component=mounted.component;
  if(component?.chart){const saved=options.components?.find((c:any)=>c.type==='Highcharts'&&c.renderTo===component.options.renderTo);if(saved?.chartOptions?.series)saved.chartOptions.series=saved.chartOptions.series.map((series:any)=>{const actual=component.chart.series.find((s:any)=>s.options.id===series.id);return actual?{...series,visible:actual.visible}:series})}if(!component?.grid)continue;
  const saved=options.components?.find((c:any)=>c.type==='Grid'&&c.renderTo===component.options.renderTo);
  if(!saved)continue;
  const columns=component.grid.getOptions(false).columns||[];
  saved.gridOptions={...saved.gridOptions,columns:columns.map((c:any)=>({id:c.id,...(typeof c.enabled==='boolean'?{enabled:c.enabled}:{}),...(c.sorting?{sorting:{order:c.sorting.order,priority:c.sorting.priority}}:{})}))};
 }
 return options;
}
