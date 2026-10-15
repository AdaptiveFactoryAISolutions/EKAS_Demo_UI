import type {Query,Formula} from './model';
export type LocalGuideSelection={query:Query;formulas?:readonly Formula[];siteScope:string;rls:boolean;maskDowntime:boolean;screen:string;boardId?:string;openedAnswerId?:string};
/** Match the complete supported data query; only proven presentation fields are omitted.
 * New query properties default to binding rather than silently bypassing cohort checks. */
export function localGuideScope(s:LocalGuideSelection){const {chart,decimals,labels,description,...query}=s.query;void chart;void decimals;void labels;void description;const formula=s.query.formulaSnapshot!==undefined?s.query.formulaSnapshot:s.formulas?.find(f=>f.id===s.query.formulaId)||null;return JSON.stringify({workspace:s.siteScope,query,formula,rls:s.rls,maskDowntime:s.maskDowntime});}
export function localGuideEntity(s:LocalGuideSelection){return s.screen==='board'?'board:'+s.boardId:s.screen==='answers'?'answers':s.screen==='search'&&s.openedAnswerId?'answer:'+s.openedAnswerId:'no-conversation';}
export function localGuideCutoff(s:LocalGuideSelection){return s.query.asOf||'unavailable';}
