import {validSemanticMetadata} from './semanticMetadata';
import {API_VERSION,type Query,type CanonicalResult,type Resource,type ResourceKind} from './contract';
export const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
export const text=(x:unknown):x is string=>typeof x==='string'&&x.trim().length>0&&x.length<=256;
export const utcInstant=(x:unknown):x is string=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(x)&&Number.isFinite(Date.parse(x))&&new Date(Date.parse(x)).toISOString().slice(0,19)===x.slice(0,19);
export const dimensions=['assetId','partId','revision','operationId','jobId','shiftId','siteId','lineId','day','scenarioId'];
export const resourceKinds:ResourceKind[]=['conversation','answer','board','tile','collection','comment','monitor','schedule','user','group','memory','formula','set','parameter','domain','webhook','action','authorization','verification','preference','notification','sync'];
const strings=(x:unknown,min=0,max=200):x is string[]=>Array.isArray(x)&&x.length>=min&&x.length<=max&&x.every(text)&&new Set(x).size===x.length;
const integer=(x:unknown,min=0)=>Number.isSafeInteger(x)&&Number(x)>=min;
export function validQuery(x:unknown):x is Query{
 if(!object(x)||x.simulationCase!==undefined&&(!['masked_evidence','zero_exposure','production_protocol','unrelated_cohorts'].includes(String(x.simulationCase))||x.fixtureVersion!=='training-positive-v2')||!['ekas-platform-synthetic-v2','training-plant-v1','training-positive-v2'].includes(String(x.fixtureVersion))||!strings(x.metricIds,1)||!x.metricIds.every(id=>/^[A-Za-z][\w.:-]{0,127}$/.test(id))||!object(x.definitionVersions)||!x.metricIds.every(id=>integer((x.definitionVersions as Record<string,unknown>)[id],1))||!object(x.scope)||!strings(x.scope.assetIds,1)||Object.entries(x.scope).some(([k,v])=>k!=='assetIds'&&(!dimensions.includes(k)||!text(v)))||![x.from,x.to,x.asOf].every(utcInstant)||Date.parse(x.from as string)>=Date.parse(x.to as string)||Date.parse(x.to as string)>Date.parse(x.asOf as string)||!strings(x.groupBy)||!x.groupBy.every(g=>dimensions.includes(g))||!Array.isArray(x.filters)||x.filters.length>50||!object(x.page)||!integer(x.page.offset)||!integer(x.page.limit,1)||Number(x.page.limit)>200)return false;
 return x.filters.every(f=>object(f)&&text(f.field)&&dimensions.includes(f.field)&&['eq','in'].includes(String(f.operator))&&Array.isArray(f.values)&&f.values.length>=1&&f.values.length<=100&&(f.operator!=='eq'||f.values.length===1)&&f.values.every(v=>text(v)||typeof v==='boolean'||typeof v==='number'&&Number.isFinite(v)));
}
const finiteOrNull=(x:unknown)=>x===null||typeof x==='number'&&Number.isFinite(x);
export function validResult(x:unknown):x is CanonicalResult{
 if(!object(x)||!text(x.id)||!integer(x.version,1)||x.apiVersion!==API_VERSION||!validQuery(x.query)||x.fixtureVersion!==x.query.fixtureVersion||!object(x.definitionVersions)||JSON.stringify(x.definitionVersions)!==JSON.stringify(x.query.definitionVersions)||!utcInstant(x.createdAt)||x.synthetic!==true||x.financiallyValidated!==false||!Array.isArray(x.rows)||!integer(x.total)||!integer(x.returned)||x.returned!==x.rows.length||Number(x.total)<Number(x.returned)||x.offset!==x.query.page.offset||x.limit!==x.query.page.limit||x.returned>x.limit||typeof x.truncated!=='boolean'||x.truncated!==(Number(x.offset)+Number(x.returned)<Number(x.total)))return false;
 const query=x.query;const keys=new Set();return x.rows.every(r=>{
  if(!object(r)||!text(r.key)||keys.has(r.key)||!object(r.dimensions)||!object(r.values))return false;keys.add(r.key);
  const dimensionsOfRow=r.dimensions,allowedDimensions=[...dimensions,'cohort','scenario'];
  if(Object.entries(dimensionsOfRow).some(([field,value])=>!allowedDimensions.includes(field)||!text(value))||query.groupBy.some(field=>dimensionsOfRow[field]===undefined))return false;
  if(typeof dimensionsOfRow.assetId==='string'&&!query.scope.assetIds.includes(dimensionsOfRow.assetId))return false;
  for(const [field,slot] of Object.entries(query.scope))if(field!=='assetIds'&&dimensionsOfRow[field]!==undefined&&dimensionsOfRow[field]!==slot)return false;
  if(dimensionsOfRow.scenario!==undefined&&dimensionsOfRow.scenario!==query.scope.scenarioId)return false;
  if(query.filters.some(filter=>dimensionsOfRow[filter.field]!==undefined&&!filter.values.some(value=>String(value)===dimensionsOfRow[filter.field])))return false;
  if(Object.keys(r.values).length!==query.metricIds.length||query.metricIds.some(id=>!Object.hasOwn(r.values as object,id)))return false;
  return Object.entries(r.values).every(([id,v])=>query.metricIds.includes(id)&&object(v)&&['observed','no_data','zero_denominator','masked','unsupported','invalid_definition','missing_input','future_record','partial_coverage'].includes(String(v.availability))&&text(v.unit)&&(finiteOrNull(v.value)||typeof v.value==='boolean'&&v.unit==='boolean')&&finiteOrNull(v.numerator)&&finiteOrNull(v.denominator)&&(v.reason===null||typeof v.reason==='string'&&v.reason.length<=20000)&&strings(v.evidenceIds,0,10000)&&(v.availability==='observed'?(typeof v.value==='number'||typeof v.value==='boolean')&&v.evidenceIds.length>0:v.value===null)&&(v.availability!=='masked'||v.numerator===null&&v.denominator===null&&v.evidenceIds.length===0)&&validSemanticMetadata(v,id,query));
 });
}
export function validResource(x:unknown):x is Resource{return object(x)&&text(x.id)&&resourceKinds.includes(x.kind as ResourceKind)&&integer(x.version,1)&&object(x.content)&&utcInstant(x.createdAt)&&utcInstant(x.updatedAt)&&Date.parse(x.createdAt)<=Date.parse(x.updatedAt)&&x.synthetic===true&&x.notDispatched===true&&x.notGranted===true&&text(x.ownerSessionId)&&strings(x.assetIds,1)}
