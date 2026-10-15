import type {ConversationBook} from './conversationBook';
export const workspaceAreas=['Brief','Explore','Improvements','Knowledge','Metrics'] as const;
export type WorkspaceMatch={id:string;label:string;detail:string;kind:'area'|'conversation'|'journey'};
export function workspaceMatches(book:ConversationBook,query:string):WorkspaceMatch[]{
 const needle=query.trim().toLocaleLowerCase();
 const items:WorkspaceMatch[]=[...workspaceAreas.map(label=>({id:label,label,detail:'Manufacturing workspace',kind:'area' as const})),...([{id:'loss',label:'Production loss',detail:'Shift capacity and loss waterfall'},{id:'machine',label:'Machine troubleshooting',detail:'FEED-03 notes and uncertain causes'},{id:'verify',label:'Improvement verification',detail:'CASE-003 eligible shifts and sustainment'}].map(x=>({...x,kind:'journey' as const}))),...book.records.filter(r=>!r.archived).map(r=>({id:r.id,label:r.name,detail:`${r.snapshot.turns.length} captured answer${r.snapshot.turns.length===1?'':'s'}`,kind:'conversation' as const}))];
 return items.filter(x=>!needle||`${x.label} ${x.detail} ${x.kind==='conversation'?book.records.find(r=>r.id===x.id)?.snapshot.turns.map((t:any)=>`${t.q} ${t.a}`).join(' '):''}`.toLocaleLowerCase().includes(needle));
}
