import {COLUMNS,emptyQuery,type Query} from './model';
const names:Record<string,string>={good_units:'goodUnits',downtime_min:'downtime',labor_hours:'laborHours',oee:'oee',scrap_rate:'scrapRate',first_pass_yield:'fpy',schedule_attainment:'scheduleAttainment',energy_intensity:'energyIntensity'};
/** Bounded read-only grammar compiles to the shared governed query, not SQL eval/DB execution. */
export function compileStudio(sql:string):Query{
 const refuse=()=>{throw new Error('Refused. Supported SELECT dimensions, SUM(additive measure), METRIC(governed ratio) FROM manufacturing_shift_model [WHERE dimension = \'exact-ID\' AND ...] [GROUP BY dimensions]. No joins, writes, functions or ratio SUM.');};
 if(typeof sql!=='string'||sql.length>4000||/[;]|--|\/\*/.test(sql))return refuse();
 const normalized=sql.trim().replace(/\s+/g,' '),match=normalized.match(/^select (.+?) from manufacturing_shift_model(?: where (.+?))?(?: group by (.+))?$/i);if(!match)return refuse();
 const dimension=(name:string)=>COLUMNS.some(c=>c.id===name&&c.kind!=='measure');const groups=match[3]?match[3].split(',').map(x=>x.trim().toLowerCase()):[];if(groups.some(g=>!dimension(g))||new Set(groups).size!==groups.length)return refuse();
 const columns=match[1].split(',').map(item=>{const text=item.trim().toLowerCase(),call=text.match(/^(sum|metric)\(\s*([a-z_]+)\s*\)$/);if(!call){if(!dimension(text))return refuse();return text}const id=names[call[2]],c=COLUMNS.find(c=>c.id===id);if(!c||call[1]==='sum'&&c.agg!=='sum'||call[1]==='metric'&&c.agg!=='ratio')return refuse();return id});
 const projectionGroups=columns.filter(dimension);if(new Set(columns).size!==columns.length||!columns.some(c=>COLUMNS.find(x=>x.id===c)?.kind==='measure')||projectionGroups.length!==groups.length||projectionGroups.some(g=>!groups.includes(g)))return refuse();
 const filters=match[2]?match[2].split(/\s+and\s+/i).map(clause=>{const predicate=clause.match(/^([a-z_]+)\s*=\s*'([A-Za-z0-9._:-]{1,100})'$/i);if(!predicate||!dimension(predicate[1].toLowerCase()))return refuse();return {col:predicate[1].toLowerCase(),op:'in' as const,values:[predicate[2]]}}):[];
 if(new Set(filters.map(f=>f.col)).size!==filters.length)return refuse();
 return {...emptyQuery(),title:'Studio governed query',columns,filters};
}
