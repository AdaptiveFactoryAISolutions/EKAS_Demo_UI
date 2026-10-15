import type {ConversationRecord} from './service';
/** Saved-record labels do not rename or restate historical turns. */
export function conversationHistorySummary(record:ConversationRecord){
 const c=record.content.conversation,first=c.turns[0]?.question;
 if(!first)return 'New conversation · No question recorded';
 const started='Started: '+first;
 if(c.dataset==='metric-demonstration'&&c.metricDemonstrationContext){const d=c.metricDemonstrationContext;return started+' · Current request: explicit synthetic metric demonstration · '+d.metricId+' · '+d.contextId+' · cutoff '+d.asOf}
 if(c.dataset==='training'){const q=c.trainingContext;return started+' · Current request: training · '+q.title+' · cutoff '+(q.asOf||'not captured')}
 if(c.comparisonId)return started+' · Current request: separate comparison '+c.comparisonId+' · captured '+(c.turns.at(-1)?.asOf||'not captured');
 const x=c.context,tuple=[x.caseFocus,x.metric,x.plant,x.line,x.machine,x.part,x.revision,x.job,x.operation,x.period,x.shift].filter(Boolean);
 return started+' · Current request: '+tuple.join(' / ');
}
