import {activeMeasures,compilePhrase,compileRankingRequest,requestedScopeIssue,columnById,valuesFor,type Query,type ChartKind} from './workspaceQuery';
export type Followup={kind:'query'|'definition'|'clarification';query:Query;note:string};
/** Finite training grammar. No model, causal inference or external tool execution. */
export function boundedFollowup(text:string,previous:Query):Followup{
 const t=text.trim().toLowerCase().replace(/[’]/g,"'").replace(/[?.!]$/,'');
 const unchanged=(kind:'definition'|'clarification',note:string):Followup=>({kind,query:structuredClone(previous),note});
 const current=()=>({...structuredClone(previous),title:text.trim()});
 if(/\b(intervention|cause|caused|causal|repair|approve|release)\b/.test(t))return unchanged('clarification','This finite training grammar cannot establish performed intervention, causal attribution or execute an approval/repair. Select the explicit supported case and simulation snapshot; approval is not performed work.');
 const definition=t.match(/^what does (.+) mean$/);
 if(definition){const name=definition[1];if(name==='availability')return unchanged('definition','Availability is run time divided by planned production time. This definition is informational; this workspace grammar does not expose an Availability result. Select an existing supported measure for a numeric query.');const col=columnById(name)||['goodUnits','downtime','oee','laborHours','scrapRate','fpy','scheduleAttainment','energyIntensity'].map(columnById).find(c=>c?.name.toLowerCase()===name);return col?unchanged('definition',col.name+': '+col.description+' No numeric result was calculated.'):unchanged('clarification','Name an existing supported metric to inspect its definition. No replacement metric was calculated.');}
 if(/^(what about the other machine|show me the loss|what should i investigate first|go back to the first result)$/.test(t))return unchanged('clarification',t.includes('other machine')?'Specify the exact asset ID; “other machine” does not identify a unique scope.':t.includes('loss')?'Specify Downtime, Scrap rate or another exact supported metric; “loss” is ambiguous.':t.includes('first result')?'Open the captured historical answer in History; this grammar does not infer which capture you mean or recalculate it as current.':'Specify an existing measure and scope for a descriptive comparison; this grammar does not prescribe a root cause or intervention.');
 const correction=t.match(/^actually by (site|line|asset|part|revision|operation|job|date)$/);
 if(correction){if(!activeMeasures(previous).length)return unchanged('clarification','Select an existing measure before correcting its grouping.');const q=current();q.columns=[...activeMeasures(previous),correction[1]];return {kind:'query',query:q,note:'Grouping corrected explicitly; metric, filters, cutoff, formula and presentation retained.'};}
 const decimalWords=['zero','one','two','three','four','five','six'];
 const round=t.match(/^round to ([0-6]|zero|one|two|three|four|five|six) decimals$/);
 const chart=t.match(/^show (?:this|it) as (?:a |an )?(column|bar|line|area|pie|table|headline|pivot|waterfall)(?: chart)?(?: with ([0-6]|zero|one|two|three|four|five|six) decimal places?)?$/);
 if(chart||round||t==="don't show fractions"){
  if(!activeMeasures(previous).length)return unchanged('clarification','Select a supported measure before changing its presentation.');
  const q=current();if(chart)q.chart=chart[1] as ChartKind;const decimals=round?.[1]||chart?.[2];if(decimals!==undefined)q.decimals=/^\d$/.test(decimals)?Number(decimals):decimalWords.indexOf(decimals);else if(t==="don't show fractions")q.decimals=0;return {kind:'query',query:q,note:'Presentation changed; metric, scope, cutoff and comparison retained. Rounding does not change source values.'};
 }
 const date=t.match(/^(?:no,? i meant|use the same machine but) (\d{4}-\d{2})$/);
 if(date){if(!activeMeasures(previous).length||!valuesFor('date',previous.provider).includes(date[1]))return unchanged('clarification','Specify an exact available YYYY-MM observation month and an existing metric. No year or data coverage was guessed.');const q=current();q.bucket='month';q.filters=[...q.filters.filter(f=>f.col!=='date'&&f.col!=='date_raw'),{col:'date',op:'in',values:[date[1]]}];return {kind:'query',query:q,note:'Exact observation month corrected; metric, asset scope and data cutoff retained.'};}
 if(/^(?:no,? i meant|use the same machine but) /.test(t))return unchanged('clarification','Specify an exact available YYYY-MM observation month; month names alone do not establish a year. Scope and cutoff retained.');
 if(/^(what changed|why is this lower|compare this with last month)$/.test(t)){
  if(!activeMeasures(previous).length)return unchanged('clarification','Select an existing metric and scope before comparing observed calendar buckets.');
  const q=current();q.compare=true;q.bucket='month';q.columns=[...q.columns.filter(id=>id!=='date_raw'),...(!q.columns.includes('date')?['date']:[])];
  // Include prior observed buckets; preserve every non-temporal scope and the original cutoff.
  q.filters=q.filters.filter(f=>f.col!=='date'&&f.col!=='date_raw');
  return {kind:'query',query:q,note:'Descriptive exact prior calendar-month comparison across available observations. No causal explanation; unequal exposure and missing prior observations remain qualified. Last month means prior observed calendar bucket, not the wall-clock month.'};
 }
 const ranking=compileRankingRequest(text,previous);if(ranking)return ranking;
 const scopeIssue=requestedScopeIssue(text,previous);if(scopeIssue)return unchanged('clarification',scopeIssue);
 const q=compilePhrase(text,previous);return activeMeasures(q).length?{kind:'query',query:q,note:''}:unchanged('clarification','Unsupported or ambiguous intent in this finite training grammar. Specify a supported metric, exact scope and observation period; no neighboring measure was substituted.');
}
