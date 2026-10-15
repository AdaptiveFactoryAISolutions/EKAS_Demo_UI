import base from '../../inputs/metric-oracle/training-relational-seed.json';import domain from '../../inputs/metric-oracle/positive-extension-v2/additive-domain-records.json';import {MissingFact,InvalidFact} from './rawFacts';import {pilotTimestamp,comparePilotInstants} from './pilotTime';
type Tables=Record<string,any[]>;type Source={record:any;table:string;namespace:string};
const timeField=(field:string)=>field==='at'||field==='start'||field==='end'||field==='valid_from'||field==='valid_to_exclusive'||field.endsWith('_at')||field.endsWith('_start')||field.endsWith('_end');
const refField=(field:string)=>field.endsWith('_id')||field.endsWith('_ref');
/** Closed declared synthetic cohorts: structural reference/unit contracts are inferred from
 * the supplied domain schema records, never from expected outputs or operand totals.
 * Selected-source timestamps/provenance and required registers are checked before joins.
 */
export function validateSelectedSources(records:Source[],baseTables:Tables,domainTables:Tables){
 const inspected=new Set<string>();
 for(const source of records){const isBase=source.table.startsWith('base.'),table=source.table.replace(/^base\./,''),tables=isBase?baseTables:domainTables,declared=(isBase?base.tables:domain.tables) as Tables,namespace=isBase?base.namespace:domain.namespace,rows=tables[table],row=source.record,expected=declared[table]?.find(r=>r.id===row.id),locator=namespace+'/'+table+'/'+row.id;
  if(!inspected.has(source.table)){inspected.add(source.table);const identities=new Set<string>(),activeIds=new Set<string>();for(const entry of rows||[]){const key=entry.namespace+'/'+entry.id+'@'+entry.record_version;if(identities.has(key))throw new InvalidFact(namespace+'/'+table+'/'+entry.id+' duplicate namespace/id/version');identities.add(key);const active=entry.namespace+'/'+entry.id;if(activeIds.has(active))throw new InvalidFact(namespace+'/'+table+'/'+entry.id+' ambiguous active versions');activeIds.add(active);if(!declared[table]?.some(r=>r.id===entry.id))throw new InvalidFact(namespace+'/'+table+'/'+entry.id+' undeclared record identity');}}
  for(const field of ['namespace','id','record_version',...(Object.hasOwn(expected||{},'known_at')?['known_at']:[])])if(!Object.hasOwn(row,field)||row[field]===null||row[field]===undefined)throw new MissingFact(locator+'.'+field);
  if(row.namespace!==namespace)throw new InvalidFact(locator+'.namespace');if(typeof row.id!=='string'||!Number.isSafeInteger(row.record_version)||row.record_version<1)throw new InvalidFact(locator+' identity');
  for(const [field,value] of Object.entries(expected||{})){
   if(timeField(field)){
    if(!Object.hasOwn(row,field)||row[field]===undefined||row[field]===null&&value!==null)throw new MissingFact(locator+'.'+field);
    if(row[field]!==null&&typeof row[field]!=='string')throw new MissingFact(locator+'.'+field);
    if(row[field]!==null&&!pilotTimestamp(row[field]))throw new InvalidFact(locator+'.'+field+' invalid UTC instant');
   }
   if(refField(field)&&value!==null){if(!Object.hasOwn(row,field)||row[field]===null)throw new MissingFact(locator+'.'+field);const actual=row[field];if(typeof value==='object'){if(typeof actual!=='object'||actual.namespace!==(value as any).namespace||actual.id!==(value as any).id)throw new InvalidFact(locator+'.'+field+' namespace-qualified cohort binding');}else if(actual!==value)throw new InvalidFact(locator+'.'+field+' declared cohort/foreign-key binding');}
   if(['unit','currency'].includes(field)){if(!Object.hasOwn(row,field)||typeof row[field]!=='string')throw new MissingFact(locator+'.'+field);if(row[field]!==value)throw new InvalidFact(locator+'.'+field+' incompatible declared measurement basis');}
  }
  if(Object.hasOwn(row,'known_at')&&!pilotTimestamp(row.known_at))throw new InvalidFact(locator+'.known_at invalid UTC instant');
  for(const [first,last] of [['available_start','available_end'],['window_start','window_end'],['period_start','period_end'],['week_start','week_end']])if(row[first]&&row[last]&&comparePilotInstants(row[first],row[last])>=0)throw new InvalidFact(locator+'.'+first+'/'+last+' reversed or empty interval');
  if(row.start&&row.end&&comparePilotInstants(row.start,row.end)>=0)throw new InvalidFact(locator+'.start/end reversed or empty interval');
  if(['run_intervals','downtime_intervals'].includes(table)){const job=baseTables.jobs.find(j=>j.id===row.job_id);if(!job||comparePilotInstants(row.start,job.start)<0||comparePilotInstants(row.end,job.end)>0)throw new InvalidFact(locator+'.start/end outside exact job interval');}
  const observedEnd=(["jobs","run_intervals","downtime_intervals","daily_energy","demand_intervals","lot_journey_intervals","verification_stop_events","verification_shifts"].includes(table)?row.end:undefined)||(['shipments'].includes(table)?row.delivered_at:undefined)||(['qualified_measurements','gauge_study_readings','meter_readings'].includes(table)?row.at:undefined)||(['counts','labor_shifts'].includes(table)?baseTables.jobs.find(j=>j.id===row.job_id)?.end:undefined);
  if(observedEnd&&row.known_at&&comparePilotInstants(row.known_at,observedEnd)<0)throw new InvalidFact(locator+'.known_at precedes declared observation');
 }
}
