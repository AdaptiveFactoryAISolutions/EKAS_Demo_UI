import {evaluateWorkspaceConversation} from '../platform/workspaceConversation';
import {emptyQuery,sourceRecords,columnById,formatValue,type Query,type RunCtx} from '../platform/workspaceQuery';
import {providerSites,providerFixture} from '../platform/fixtureSelection';
import {validWorkspaceQuery} from '../retained/stateValidation';
import seed from '../../inputs/metric-oracle/training-relational-seed.json';
import type {PresentedTurn} from './conversation';
export const trainingAssetIds=seed.tables.assets.map(a=>a.id);
export type TrainingCapture=ReturnType<typeof evaluateWorkspaceConversation>;
export function initialTrainingContext(){return emptyQuery()}
export function initialTrainingPresentation(query:Query):RunCtx{return {rls:false,site:providerSites(query.provider)[0],maskDowntime:false}}
export function executeTrainingTurn(text:string,query:Query,presentation:RunCtx,allowedAssetIds:string[],conversationId:string):{capture:TrainingCapture;answer:PresentedTurn}{
 if(!validWorkspaceQuery(query)||!providerSites(query.provider).includes(presentation.site))throw Error('Invalid retained dataset context.');
 if(sourceRecords(query,presentation).some(f=>!allowedAssetIds.includes(f.asset)))throw Error('Dataset assets outside simulated session scope.');
 const capture=evaluateWorkspaceConversation({text,memoryContext:[],presentationContext:presentation},query,allowedAssetIds,conversationId);
 const parts=capture.answers.map(a=>{if(a.intent!=='query')return a.intentNote;const metrics=a.queryContext.columns.filter(id=>columnById(id)?.kind==='measure');const values=a.rows.map(row=>row.key+': '+metrics.map(id=>(columnById(id)?.name||id)+' '+formatValue(id,row.values[id],a.queryContext.decimals,presentation.maskDowntime)).join('; '));return (values.length?values.join('\n'):'The requested cohort has no eligible observations.')+'\n'+a.note;});
 const sources=[...new Set(capture.rows.flatMap(row=>row.evidence||[]))],metric=capture.queryContext.columns.find(id=>columnById(id)?.kind==='measure')||'unavailable',unit=columnById(metric)?.unit||'';
 const visual=capture.rows.length&&capture.queryContext.columns.filter(id=>columnById(id)?.kind==='measure').length===1?{title:columnById(metric)?.name||metric,unit,categories:capture.rows.map(r=>r.key),values:capture.rows.map(r=>{const v=r.values[metric];return typeof v==='number'&&Number.isFinite(v)?(unit==='%'?v*100:v):null}),kind:'column' as const,sourceIds:sources}:undefined;
 return {capture,answer:{text:parts.join('\n\n')+'\n\nDataset: '+providerFixture(query.provider)+'; cutoff '+capture.asOf+'.',evidence:'metrics',chart:!!visual,metric,sourceIds:sources,qualification:capture.answers.some(a=>a.availability!=='synthetic_observation')?capture.note:null,...(visual?{visual}:{})}};
}
