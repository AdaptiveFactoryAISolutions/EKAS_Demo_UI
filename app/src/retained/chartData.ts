import {formulaMetadataMissing} from './formulaDiagnostic';
import {activeGroup,activeMeasures,columnById,type Query,type Row,type Formula} from './model';
export function presentationData(rows:Row[],query:Query,mask=false,availableFormula?:Formula){
 const date=activeGroup(query).find(g=>g==='date'||g==='date_raw');if(date&&!query.orderBy&&['line','area'].includes(query.chart))rows=[...rows].sort((a,b)=>a.dims[date].localeCompare(b.dims[date])||a.key.localeCompare(b.key));
 const groups=activeGroup(query),measures=activeMeasures(query),label=(m:string)=>formulaMetadataMissing(query,m,availableFormula)?'Custom formula unavailable (units unknown)':(columnById(m)?.name||m)+' ('+(columnById(m)?.unit||'value')+')';
 const value=(r:Row,m:string,prior=false)=>{const n=(prior?r.prior:r.values)?.[m];return mask&&(m==='downtime'||m.startsWith('fx:'))||!Number.isFinite(n)?null:n!*(columnById(m)?.unit==='%'?100:1)};
 const compared=query.compare&&query.chart!=='pie';
 const series=measures.flatMap(m=>[{id:m,metric:m,name:label(m),prior:false},...(compared?[{id:'prior:'+m,metric:m,name:'Prior '+label(m),prior:true}]:[])]);
 if(query.chart==='pivot'&&groups.length>=2){
  const column=groups[1],rowDims=groups.filter(g=>g!==column),categories=[...new Set(rows.map(r=>r.dims[column]))],columns=categories.flatMap(category=>series.map(s=>({id:category+' · '+s.name,category,series:s})));
  const grouped=new Map<string,Row[]>();for(const row of rows){const key=rowDims.map(g=>row.dims[g]).join(' · ');grouped.set(key,[...(grouped.get(key)||[]),row])}
  const data=[['Slice',...columns.map(c=>c.id)],...[...grouped].map(([key,members])=>[key,...columns.map(c=>{const row=members.find(r=>r.dims[column]===c.category);return row?value(row,c.series.metric,c.series.prior):null})])];
  return {data,names:columns.map(c=>c.id),series:[],selectionRows:[...grouped].map(([key,members])=>({...members[0],key,dims:Object.fromEntries(rowDims.map(dim=>[dim,members[0].dims[dim]]))})),pivot:true};
 }
 return {data:[['Slice',...series.map(s=>s.name)],...rows.map(r=>[r.key,...series.map(s=>value(r,s.metric,s.prior))])],names:series.map(s=>s.name),series,selectionRows:rows,pivot:false};
}

export function chartEligibility(rows:Row[],query:Query){const measures=activeMeasures(query),first=measures[0],additive=first&&['goodUnits','downtime','laborHours'].includes(first);if(query.chart==='pie'&&(!additive||rows.some(r=>Number.isFinite(r.values[first])&&r.values[first]<0)))return 'Pie unavailable: use a nonnegative additive measure for composition; governed ratios are not shares.';if(query.chart==='waterfall'&&(!additive||measures.length!==1))return 'Waterfall unavailable: choose one additive measure with a consistent unit; ratios cannot be accumulated.';return null}

/** Captured denominator basis, never a mean of grouped percentages or a first-group substitute. */
export function headlineSummary(rows:Row[],measure:string){const complete=measure==='oee'&&rows.length>1&&new Set(rows.map(r=>r.key)).size===rows.length&&rows.every(r=>Number.isFinite(r.values.oee)&&r.aggregation?.oee.totalGroups===rows.length&&Number.isFinite(r.aggregation.oee.numerator)&&r.aggregation.oee.numerator>=0&&Number.isFinite(r.aggregation.oee.denominator)&&r.aggregation.oee.denominator>0);return {aggregate:complete,value:complete?rows.reduce((n,r)=>n+r.aggregation!.oee.numerator,0)/rows.reduce((n,r)=>n+r.aggregation!.oee.denominator,0):NaN,scope:complete?'All eligible groups · ratio of summed ideal-good minutes to summed planned minutes':'Aggregate unavailable; explicit returned scopes',rows};}
