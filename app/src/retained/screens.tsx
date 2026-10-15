import {retainedAuditWindow} from './auditWindow';
import {createLocalBoardComment,validCommentAttribution} from './commentAttribution';
import {flushSync} from 'react-dom';
import {emitGuideUiObservation} from '../guideUiObservation';
import{useModelProgress}from'../investigation/useModelProgress';
import {CurrentScheduleButton} from './CurrentScheduleButton';
import {EvidenceCaptureView} from '../investigation/EvidenceCaptureView';
import {withGuideInspection,objectInspectionReference,copyGuidePayload} from './guideInspection';
import {createQueryGuideAction,withQueryGuideAction,prepareLocalQuestionDraft} from './queryGuideAction';
import {runLocalPatternScan,setPatternPreferences} from './patternRun';
import {saveLocalPreference} from './localPreferences';
import {ContextualGuide} from '../Guide';
import {SourceEditor} from '../investigation/SourceEditor';
import {emptyGroupFixture} from './emptyGroupFixture';
import {effectiveBoardQuery} from './boardScope';
import {AskReplies} from './AskReplies';
import {ResultEvidence} from './ResultEvidence';
import type {Capture} from './capturedView';
import {DeveloperHome,EmbedPlayground} from './developerSurfaces';
import {formulaMetadataMissing,missingFormulaCopy} from './formulaDiagnostic';
import {ExpertNote} from './expertNote';
import {providerFixture} from '../platform/fixtureSelection';
import {objectMetadata} from './objectMetadata';
import {captureBoardSchedule,runBoardSchedule} from './boardSchedule';
import {columnMatchesSearch} from './columnSearch';
import {selectedScopeFilters,selectedDimensions} from './selectedScope';
import {CanonicalGapLab} from './CanonicalGapLab';
import {headlineSummary} from './chartData';
import {boardCommentPresentation} from './boardSeedComment';
import {Dialog} from './dialog';
import {eligibleCapture,capturedScopeSummary} from "./capturedView";
import {requestLocalAction,authorizeLocalAction,performLocalAction} from "./localActions";
import {testLocalWebhook,addAllowedDomain} from "./localWebhooks";
import {removeCollectionMember,undoCollectionRemoval,openCollectionMember,addCollectionMember} from "./collectionActions";
import {compileStudio} from "./studioGrammar";
import {inspectBoard} from "./boardReview";
import {ApiPlayground} from './ApiPlayground';
import {applyParameter,disableParameter,runCapturedSchedule,evaluatedMonitor,createCurrentMonitor,createCurrentSchedule} from './workflowRuntime';
import {toggleFavorite,removeLibraryItem,restoreLibraryItem} from './libraryActions';
import {exportAliases,importAliases,saveAliases} from './synonyms';
import {CanonicalTile} from './CanonicalTile';
import {submitUnifiedConversation,conversationTransitionEpoch} from '../investigation/unified';
import {ManufacturingContext} from '../investigation/Replies';
import {loadConversationContext} from './conversationClient';
import {MetricLab} from './MetricLab';
import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { toast } from "./notices";
import { Viz } from "./viz";
import { WORKFLOWS } from "./workflows";
import { useEkas, type Screen } from "./store";
import {
  COLUMNS,
  DEFINITIONS,
  sourceRecords,
  resultIdentity,
  resultMeta,
  activeGroup,
  activeMeasures,
  analyze,
  columnById,
  compilePhrase,
  emptyQuery,
  queryFormula,
  selectFormulaQuery,
  formatValue,
  runQuery,
  sqlOf,
  toCsv,
  valuesFor,
  type Query,
} from "./model";

function ctxOf() {
  const s = useEkas.getState();
  return { rls: s.rls, site: s.siteScope, maskDowntime: s.maskDowntime };
}

function useRows(query: Query,enabled=true) {
  const rls = useEkas((s) => s.rls);
  const siteScope = useEkas((s) => s.siteScope);
  const maskDowntime = useEkas((s) => s.maskDowntime);
  const formulas = useEkas((s) => s.formulas);
  const formula = formulas.find((f) => f.id === query.formulaId);
  return useMemo(
    () => enabled?runQuery(query, { rls, site: siteScope, maskDowntime }, formula):[],
    [query, rls, siteScope, maskDowntime, formula,enabled],
  );
}

function Btn({ children, onClick, tone = "ghost",disabled=false,...publicProps }: { children: ReactNode; onClick?: () => void; tone?: "ghost" | "solid";disabled?:boolean;[key:`data-${string}`]:string|undefined }) {
  return (
    <button
      {...publicProps}
      disabled={disabled}
      onClick={onClick}
      className={
        tone === "solid"
          ? "min-h-11 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-fg"
          : "min-h-11 rounded-lg border border-line px-3 text-sm text-fg"
      }
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-line bg-surface p-4">{children}</div>;
}

function download(name: string, text: string, type = "text/plain", kind:import("./guideInspection").LocalGuideInspection["kind"]="export-prepared") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  withGuideInspection(kind,()=>({filename:name,mediaType:type,bytes:new Blob([text],{type}).size,preparedText:text.slice(0,12000),textFullyCaptured:text.length<=12000,filePrepared:true,fileSaved:false,nativeDeliveryConfirmed:false}),()=>a.click());
  setTimeout(()=>URL.revokeObjectURL(a.href),0);
}

export function ScreenBody(){const screen=useEkas(s=>s.screen);return <section data-guide-page={screen} tabIndex={-1} aria-label={"Current workspace page: "+screen} style={{minWidth:0}}><ScreenContents/></section>;}

function ScreenContents() {
  const screen = useEkas((s) => s.screen);
  if (screen === "canonicalmetrics") return <CanonicalGapLab/>;
  if (screen === "metriclab") return <MetricLab/>;
  if (screen === "home") return <Home />;
  if (screen === "ask") return <Ask />;
  if (screen === "search") return <Search />;
  if (screen === "boards") return <Boards />;
  if (screen === "board") return <BoardView key={useEkas.getState().boardId}/>;
  if (screen === "answers") return <Answers />;
  if (screen === "collections") return <Collections />;
  if (screen === "schedules") return <Schedules />;
  if (screen === "monitors") return <Monitors />;
  if (screen === "patterns") return <Patterns />;
  if (screen === "inspection") return <Inspection />;
  if (["objects", "connections", "studio", "utilities", "sync", "memory", "catalog", "usage", "dbt", "verify"].includes(screen))
    return <DataScreens />;
  if (["devhome", "embed", "playground", "apiguide", "apiplay", "theme", "actions", "styles", "links", "security", "webhooks"].includes(screen))
    return <Develop />;
  return <Admin />;
}

function Home() {
  const homeInput=useRef<HTMLInputElement>(null);
  const welcome = useEkas((s) => s.welcome);
  const askText = useEkas((s) => s.askText);
  const watch = useEkas((s) => s.watch);
  const answers = useEkas((s) => s.answers);
  const boards = useEkas((s) => s.boards);
  const favorites=useEkas(s=>s.favorites),removedLibrary=useEkas(s=>s.removedLibrary);
  const librarySearch = useEkas((s) => s.librarySearch);
  const attachment=useRef<HTMLInputElement>(null);const attachments=useEkas(s=>s.attachments);const [submitting,setSubmitting]=useState(false);
  const submitHome=async()=>{if(submitting)return;setSubmitting(true);try{await submitUnifiedConversation(homeInput.current?.value??useEkas.getState().askText);useEkas.getState().go('ask')}catch(error){toast(error instanceof Error?error.message:'Conversation failed')}finally{setSubmitting(false)}};
  const q = librarySearch.toLowerCase();
  const recents = [
    ...boards.map((b) => ({ id: b.id, kind: "Board", name: b.name, query:b.tiles[0]?.query, screen: "board" as Screen })),
    ...answers.map((a) => ({ id: a.id, kind: "Answer", name: a.query.title, query:a.query, screen: "answers" as Screen })),
  ].filter((r) => r.name.toLowerCase().includes(q));
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{welcome}</h1>
      <Card>
        <div className="text-sm text-muted">Source · Manufacturing leadership model · definition1 · synthetic</div>
        <div className="mt-2 flex flex-col gap-2 md:flex-row">
          <input ref={homeInput}
            value={askText}
            onChange={(e) => useEkas.setState({ askText: e.target.value })}
            className="min-h-11 flex-1 rounded-lg border border-line bg-bg px-3"
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void submitHome()}}}
            placeholder="Ask about output, downtime, OEE or first-pass yield"
          />
          <Btn
            tone="solid"
            onClick={submitHome}
          >
            Submit
          </Btn>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn onClick={()=>attachment.current?.click()}>Add file</Btn><input hidden type="file" ref={attachment} onChange={async event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>2000000){toast('Attachment exceeds the 2 MB local evidence limit.');return}try{const bytes=await file.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');useEkas.setState(s=>({attachments:[...s.attachments,{id:crypto.randomUUID(),name:file.name,bytes:file.size,sha256:hash,capturedAt:new Date().toISOString(),status:'unreviewed'}]}));toast('Local evidence reference attached. It does not establish cause or change governed measurements.')}catch{toast('Attachment could not be read; no evidence added.')}}}/>{attachments.map(file=><small key={file.id}>{file.name} · {file.bytes} bytes · SHA256 {file.sha256} · unreviewed reference <button onClick={()=>useEkas.setState(s=>({attachments:s.attachments.filter(a=>a.id!==file.id)}))}>Remove attachment</button></small>)}
          <Btn
            onClick={() => {
              useEkas.getState().setQuery(compilePhrase(askText));
              useEkas.setState({ patternRan: true });
              useEkas.getState().go("patterns");
            }}
          >
            Deep analysis
          </Btn>
          <Btn onClick={() => useEkas.getState().go("objects")}>Know the model</Btn><Btn onClick={()=>useEkas.getState().addKpi()}>Add KPI from current query</Btn>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        {watch.map((w) => {
          const formula=queryFormula(w.query,w.formula || useEkas.getState().formulas.find(f=>f.id===w.query.formulaId));
          const missingFormula=!!w.query.formulaId&&!formula;
          const kpiRows=missingFormula?[]:runQuery(w.query,ctxOf(),formula);
          const title=formula?.name || (w.title.startsWith("fx:")?"Custom formula":w.title);
          const r=kpiRows.length===1?kpiRows[0]:undefined;
          const m = activeMeasures(w.query)[0] ?? "goodUnits";
          const summary=headlineSummary(kpiRows,m);
          return (
            <Card key={w.id}>
              <div className="flex items-start justify-between gap-2">
                <button className="text-left" onClick={() => { useEkas.getState().setQuery({...structuredClone(w.query),...(w.query.formulaId?{formulaSnapshot:formula?structuredClone(formula):null}:{}),title}, false); useEkas.getState().go("search"); }}>
                  <div className="text-sm text-muted">{title}</div>
                  <div className="text-sm text-muted">{missingFormula?"Formula metadata unavailable":columnById(activeMeasures(w.query)[0])?.unit || "Units unavailable"}</div>
                  <div className="text-2xl font-semibold">{summary.aggregate?<><span>{formatValue(m,summary.value,w.query.decimals,useEkas.getState().maskDowntime)}</span><small className="block text-sm">{summary.scope}</small></>:kpiRows.length?kpiRows.map(row=><span className="block" key={row.key}>{row.key}: {formatValue(m,row.values[m],w.query.decimals,useEkas.getState().maskDowntime)}</span>):"Unavailable"}</div>
                </button>
                <Btn
                  onClick={() => {
                    useEkas.setState((s) => ({ watch: s.watch.filter((x) => x.id !== w.id) }));
                    toast("Removed from watchlist");
                  }}
                >
                  More
                </Btn>
              </div>
              <div className={w.unavailable ? "text-sm text-amber" : "text-sm text-muted"}>{r?.prior?w.compareLabel:"Comparison unavailable"}</div>
            </Card>
          );
        })}
      </div>
      <Card>
        <h2 className="font-semibold">Recents</h2>
        <ul className="mt-2 flex flex-col">
          {recents.map((r) => (
            <li key={r.id} className="retained-recent-row border-t border-line py-2">
              <button data-guide-action="recent-open" className="retained-recent-title text-left" onClick={() => withGuideInspection("recent-opened",()=>({id:r.id,kind:r.kind,name:r.name,destination:useEkas.getState().screen}),() => { if (r.screen === "board") useEkas.setState({ boardId: r.id });else {const answer=answers.find(a=>a.id===r.id);if(answer){useEkas.getState().setQuery(answer.query,false);useEkas.setState({openedAnswerId:answer.id});}} useEkas.getState().go(r.screen); },()=>objectInspectionReference(r.kind==="Board"?"boards":"answers",r.id))}>
                <span className="text-sm text-muted">{r.kind}</span>
                <div>{favorites.includes(r.id)?"★ ":""}{r.name}</div>
              </button>
              <div className="retained-recent-actions">
              <Btn onClick={()=>{if(!r.query){toast("No captured query is available for this item.");return}useEkas.getState().setQuery(structuredClone(r.query),false);useEkas.setState({shareOpen:true})}}>Share {r.kind.toLowerCase()}</Btn><Btn onClick={()=>{try{toggleFavorite(r.id)}catch(error){toast(error instanceof Error?error.message:'Save failed')}}}>{favorites.includes(r.id)?'Unfavorite':'Favorite'}</Btn><Btn onClick={()=>{try{removeLibraryItem(r.id,r.kind as 'Board'|'Answer');useEkas.getState().log('Removed local library item '+r.id+'; restorable')}catch(error){toast(error instanceof Error?error.message:'Removal failed')}}}>Remove from library</Btn>
              <Btn
                onClick={async () => {try{const board=r.kind==='Board'?useEkas.getState().boards.find(b=>b.id===r.id):undefined;if(r.kind==='Board'&&!board)throw new Error('Exact board missing.');const binding=board?{targetBoard:await captureBoardSchedule(board,ctxOf())}:{targetQuery:structuredClone(r.query)};useEkas.setState(s=>({schedules:[...s.schedules,{id:crypto.randomUUID(),name:r.name,...binding,cadence:'Weekdays 06:30',target:'You',status:'ok',last:'not run',statusNote:board?'Full board captured with content revision; local only.':'Captured single query; local only.'}]}));toast('Local schedule recorded; no external delivery')}catch(error){toast(error instanceof Error?error.message:'Schedule not created')}}}
              >
                Schedule
              </Btn>
              </div>
            </li>
          ))}
        </ul>{removedLibrary.length>0&&<details><summary>Removed local items · restorable</summary>{removedLibrary.map(r=><p key={r.id}>{r.kind} · {r.id} <Btn onClick={()=>{try{restoreLibraryItem(r.id)}catch(error){toast(error instanceof Error?error.message:'Restore failed')}}}>Restore item</Btn></p>)}</details>}
      </Card>
    </div>
  );
}

function CapturedQuestion({capture}:{capture:import("./capturedView").Capture}){const current={rls:useEkas(s=>s.rls),site:useEkas(s=>s.siteScope),maskDowntime:useEkas(s=>s.maskDowntime)},visible=eligibleCapture(capture,current);return <section><p>Historical query · {capture.capturedAt} · {visible.allowed?capturedScopeSummary(capture):"Captured query scope withheld under current restrictions"} · {visible.reason}</p>{visible.allowed&&<><Viz rows={visible.rows} query={capture.query} maskDowntime={visible.maskDowntime} onPoint={()=>{}}/><details><summary>Captured query details</summary><pre className="overflow-x-auto font-mono">{sqlOf(capture.query,capture.context)}</pre></details></>}</section>}
function Ask() {
  const askInput=useRef<HTMLTextAreaElement>(null);
  const askText = useEkas((s) => s.askText);
  const manufacturingActive=useEkas(s=>s.conversationRoute==='manufacturing');
  const memory = useEkas((s) => s.memory);
  const modelProgress=useModelProgress();
  const thread = useEkas((s) => s.askThread);
  const query = useEkas((s) => s.query);
  const feedback = useEkas((s) => s.feedback);
  const rows = useRows(query);
  const sql = sqlOf(query, ctxOf());
  const [running,setRunning]=useState(false);const runningRef=useRef<{epoch:number}|null>(null);const currentEpoch=conversationTransitionEpoch();const busy=running&&runningRef.current?.epoch===currentEpoch;const [submissionStatus,setSubmissionStatus]=useState({epoch:-1,text:''});
  const conversationId=useEkas(s=>s.conversationId);const [conversationScope,setConversationScope]=useState<{id:string;query?:Query;version?:number;error?:string}>({id:''});
  useEffect(()=>{let active=true;if(!conversationId){setConversationScope({id:''});return}setConversationScope({id:conversationId});void loadConversationContext(conversationId).then(result=>{if(active)setConversationScope({id:conversationId,...result})}).catch(error=>{if(active)setConversationScope({id:conversationId,error:error instanceof Error?error.message:'Conversation context unavailable.'})});return()=>{active=false}},[conversationId,thread.length]);
  const suggestionQuery=conversationId?(conversationScope.id===conversationId?conversationScope.query:undefined):query;
  const suggestions = manufacturingActive?["What evidence do we have?","What should we test?","What should we do next?","Did it work?"]:["Good units by line", "OEE by line", "FPY by part", "OEE trend"];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Ask</h1>
      <ManufacturingContext/><SourceEditor/>
      <textarea
        ref={askInput} aria-label="Ask EKAS"
        value={askText}
        onChange={(e) => useEkas.setState({ askText: e.target.value })}
        className="min-h-24 rounded-lg border border-line bg-surface p-3"
      />
      <div className="flex flex-wrap gap-2">
        {!manufacturingActive&&<section aria-label="Suggestion scope" className="retained-suggestion-context">{suggestionQuery?<>
          <dl><div><dt>Context</dt><dd>{conversationId?'Saved conversation context':'Current working query'}</dd></div><div><dt>Grouping</dt><dd>{activeGroup(suggestionQuery).join(', ')||'none'}</dd></div><div><dt>Filters</dt><dd>{suggestionQuery.filters.map(f=>f.col+' '+f.op+' ['+f.values.join(', ')+']').join('; ')||'none'}</dd></div><div><dt>Cutoff</dt><dd>{suggestionQuery.asOf}</dd></div><div><dt>Tuple exclusions</dt><dd>{suggestionQuery.excludedScopes?.length||0}</dd></div></dl>
          <details><summary>Conversation context details</summary><p>{conversationId?'Existing conversation '+conversationId+' uses saved conversation context (last retrieved version '+conversationScope.version+').':'New conversation uses the current working query.'} Suggestions continue the current grouping, filters and cutoff unless the text explicitly changes them. Submission reads the current saved conversation context.</p></details>
        </>:<p role="status">{conversationScope.error?'Saved conversation context unavailable: '+conversationScope.error:'Loading saved conversation scope; no working-query scope substituted.'}</p>}</section>}
        {suggestions.map((s) => (
          <Btn data-guide-action="ask-suggestion" key={s} onClick={() => prepareLocalQuestionDraft(s)}>
            {s}
          </Btn>
        ))}
        <Btn
          tone="solid" disabled={busy}
          onClick={async () => {
            const epoch=conversationTransitionEpoch();if(runningRef.current?.epoch===epoch)return;const request={epoch};const submitted=askInput.current?.value??useEkas.getState().askText;runningRef.current=request;setRunning(true);setSubmissionStatus({epoch,text:'Saving this question locally…'});try{
              const result=await submitUnifiedConversation(submitted);if(conversationTransitionEpoch()!==epoch)return;const latest=result.content.conversation.turns.at(-1);if(useEkas.getState().manufacturingConversationId!==result.id||!useEkas.getState().askThread.some(r=>r.manufacturing?.conversationId===result.id&&r.manufacturing.turnId===latest?.id))throw Error('The turn was saved, but its current reply is not indexed. Open saved history to recover it.');setSubmissionStatus({epoch,text:'Reply saved.'});
            }catch(e){if(conversationTransitionEpoch()!==epoch)return;const message=e instanceof Error?e.message:'Local conversation failed';setSubmissionStatus({epoch,text:message+' Your draft remains available; retry the same question to reconcile its saved receipt.'});toast(message)}finally{if(runningRef.current===request){runningRef.current=null;setRunning(false)}}
          }}
        >
          {busy?"Preparing reply…":"Run"}
        </Btn><Btn onClick={()=>{runLocalPatternScan();useEkas.getState().go("patterns")}}>Add analysis · Pattern scans</Btn>
      </div>
      <p role="status" aria-live="polite">{submissionStatus.epoch===currentEpoch?submissionStatus.text:''}</p>
      {busy&&modelProgress&&<p role="status">{modelProgress}</p>}<AskReplies thread={thread} renderCapture={capture=><CapturedQuestion capture={capture}/>}/>
      {!manufacturingActive&&<Card>
        <Viz onExclude={(col,value)=>withQueryGuideAction('legend-excluded',()=>useEkas.getState().addFilter({col,op:"not",values:[value]}))} rows={rows} query={query} maskDowntime={useEkas.getState().maskDowntime} onPoint={(col, value,dimensions) => useEkas.setState({ selectedPoint: { col, value,dimensions }, screen: "search" })} />
        <details className="mt-2"><summary>Working query details</summary><pre className="mt-2 overflow-x-auto rounded-lg bg-bg p-3 font-mono text-sm text-muted">{sql}</pre></details>
      </Card>}
      <Card>
        <h2 className="font-semibold">Local workspace notes and feedback</h2>
        <p className="text-sm text-muted">This feedback records a local workspace preference. It does not train a model, change captured answers or submit a question.</p>
        <details><summary data-guide-action="ask-memory-inspect">Current local notes</summary><p className="mt-2 text-sm text-amber">Current working query · demonstrated sample. {memory.length?memory.join(" "):"No local notes saved."}</p><p>These editable local phrases are not evidence of a root cause or provider memory. Inspect a saved reply’s original context separately; later note changes do not rewrite it.</p></details>
        <div className="mt-2 flex gap-2">
          <Btn onClick={() => saveLocalPreference("feedback",{...useEkas.getState().feedback,ask:"useful"})}>Useful</Btn>
          <Btn onClick={() => saveLocalPreference("feedback",{...useEkas.getState().feedback,ask:"unclear"})}>Unclear</Btn>
          <span className="text-sm text-muted">{feedback.ask ? `Marked ${feedback.ask}` : ""}</span>
        </div>
      </Card>
    </div>
  );
}

function Search() {
  const query = useEkas((s) => s.query);
  const [ran,setRan]=useState(()=>query.columns.length>0);
  const [executedHere,setExecutedHere]=useState(false);
  const rows=useRows(query,ran);
  const coach = useEkas((s) => s.coach);
  const colTab = useEkas((s) => s.colTab);
  const colQuery = useEkas((s) => s.colQuery);
  const infoCol = useEkas((s) => s.infoCol);
  const selected = useEkas((s) => s.selectedPoint);
  const explore = useEkas((s) => s.explore);
  const underlying = useEkas((s) => s.underlying);
  const sqlOpen = useEkas((s) => s.sqlOpen);
  const formulas = useEkas((s) => s.formulas);
  const sets = useEkas((s) => s.sets);
  const params = useEkas((s) => s.params);
  const opened = useEkas((s) => s.openedAnswerId);
  const boards = useEkas((s) => s.boards);
  const [draft, setDraft] = useState("");
  const [setsMode,setSetsMode]=useState<"all"|"yours">("all");
  const [pinBoard,setPinBoard]=useState(boards[0]?.id||""),[pinTab,setPinTab]=useState(boards[0]?.tabs[0]||"Overview");
  const filterTrigger=useRef<HTMLElement|null>(null);
  const closeFilter=()=>{setFilterCol(null);filterTrigger.current?.focus()};
  const canUndo=useEkas(s=>s.past.length>0);
  const [filterCol, setFilterCol] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);const [filterOp,setFilterOp]=useState<"in"|"not">("in");
  const measures = activeMeasures(query);
  const groups = activeGroup(query);
  const list = COLUMNS.filter((c) => (colTab === "all" || c.popular) && columnMatchesSearch(c,colQuery));
  const suggestions = COLUMNS.filter((c) => draft && (c.name.toLowerCase().includes(draft.toLowerCase()) || c.synonyms.some((sy) => sy.includes(draft.toLowerCase())))).slice(0, 6);
  const info = COLUMNS.find((c) => c.id === infoCol);
  const drillTargets = COLUMNS.filter((c) => c.kind !== "measure" && !query.columns.includes(c.id));
  const sourceInspectionPayload=()=>{if(!resultIdentity.get(rows))return null;const sources=[...new Set(rows.flatMap(r=>r.evidence))];return {fixture:providerFixture(query.provider),sourceContext:query.provider||null,resultId:resultIdentity.get(rows),cutoff:query.asOf||null,rowCount:rows.length,sourceIds:sources.slice(0,200),sourceIdsTotal:sources.length,sourceIdsComplete:sources.length<=200,units:measures.map(id=>({id,unit:columnById(id)?.unit||'unit unavailable'})),eligibility:rows.slice(0,40).map(r=>({key:r.key,eligibility:r.eligibility})),eligibilityTotal:rows.length,eligibilityComplete:rows.length<=40,synthetic:true,businessCompleted:false,qualification:'Actual local source inspection; no source switch, warehouse connection, calibration/cause certification or workflow completion.'}};


  function applyDraft(id?: string) {
    setRan(true);setExecutedHere(true);
    const q = id ? { ...query, columns: query.columns.includes(id) ? query.columns : [...query.columns, id] } : compilePhrase(draft,query);
    if (!id) q.chart = query.chart;
    const executed=id?q:{...query,title:q.title,columns:[...new Set([...query.columns,...q.columns])],filters:q.filters};
    if(executed.title==="Untitled answer")executed.title=activeMeasures(executed).map(m=>columnById(m)?.name||m).join(" and ")+(activeGroup(executed).length?" by "+activeGroup(executed).map(g=>columnById(g)?.name||g).join(", "):"");
    withQueryGuideAction(id?'query-suggestion':'query-confirmed',()=>useEkas.getState().setQuery(executed));
    setDraft("");
    useEkas.getState().log("Search go");
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
      {(query.columns.filter(id=>id.startsWith("fx:")).length>1||measures.some(m=>formulaMetadataMissing(query,m,formulas.find(f=>f.id===query.formulaId))))&&<div style={{gridColumn:"1 / -1"}}>{query.columns.filter(id=>id.startsWith("fx:")).length>1&&<p role="status">Multiple custom formula tokens are unavailable. Select one custom formula before interpreting its result.</p>}
      {measures.some(m=>formulaMetadataMissing(query,m,formulas.find(f=>f.id===query.formulaId)))&&<p role="status">{missingFormulaCopy}</p>}</div>}
      <Card>
        <div className="flex gap-2">
          <Btn onClick={() => useEkas.setState({ colTab: "popular" })}>Popular</Btn>
          <Btn onClick={() => useEkas.setState({ colTab: "all" })}>All</Btn>
        </div>
        <input data-guide-action="column-find" value={colQuery} onChange={(e) => useEkas.setState({ colQuery: e.target.value })} placeholder="Find columns" className="mt-2 min-h-11 w-full rounded-lg border border-line bg-bg px-3" />
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn onClick={() => useEkas.setState({ formulaOpen: true })}>Add formula</Btn>
          <Btn onClick={() => useEkas.setState({ setOpen: true })}>Add set</Btn>
          <Btn onClick={() => useEkas.setState({ paramOpen: true })}>Add parameter</Btn>
          <Btn onClick={() => withGuideInspection("column-inspected",()=>{const c=list[0];return c?{id:c.id,name:c.name,unit:c.unit||"not numeric",aggregation:c.agg||"dimension",description:c.description,definition:DEFINITIONS[c.id]||c.description}:null},()=>useEkas.setState({infoCol:list[0]?.id}))}>Column information</Btn>
        </div>
        {(["measure", "attribute", "date"] as const).map((kind) => (
          <div key={kind} className="mt-3">
            <div className="text-sm uppercase text-muted">{kind === "date" ? "Dates" : kind === "measure" ? "Measures" : "Attributes"}</div>
            {list.filter((c) => c.kind === kind).map((c) => (
              <div key={c.id} className="mt-1 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={query.columns.includes(c.id)} onChange={() => withQueryGuideAction('column-toggled',()=>useEkas.getState().toggleColumn(c.id))} />
                  {c.name}
                </label>
                {c.kind !== "measure" && (
                  <button data-guide-action="column-filter" className="text-sm text-info" onClick={(event) => {filterTrigger.current=event.currentTarget; setFilterCol(c.id);const existing=query.filters.filter(f=>f.col===c.id).at(-1);setPicked(existing?[...existing.values]:[]);setFilterOp(existing?.op||"in"); }}>
                    Filter
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
        {sets.filter(set=>setsMode==="all"||set.yours).map(set=><div key={set.id}><span>{set.name} · {set.values.join(', ')}</span><Btn onClick={()=>useEkas.getState().addFilter({col:set.col,op:'in',values:set.values})}>Apply set</Btn><Btn onClick={()=>useEkas.setState(s=>({sets:s.sets.filter(x=>x.id!==set.id)}))}>Remove set</Btn></div>)}{params.map(param=><div key={param.id}><span>{param.name} · {param.value}</span><Btn onClick={()=>{applyParameter(param)}}>Apply parameter</Btn><Btn onClick={()=>{try{disableParameter(param)}catch(error){toast(error instanceof Error?error.message:'Parameter refused')}}}>Disable parameter</Btn></div>)}
        <div className="mt-3 text-sm text-muted">Formulas {formulas.length ? formulas.map((f) => f.name).join(", ") : "— add one"}</div>
        <div className="text-sm text-muted">Sets {sets.length ? `${sets.length} saved` : "— add one"} · <button onClick={()=>setSetsMode("all")}>All sets</button> <button onClick={()=>setSetsMode("yours")}>Your sets</button></div>
        <div className="text-sm text-muted">Parameters {params.length ? params.map((p) => `${p.name}${p.applied ? " on" : ""}`).join(", ") : "— add one"}</div>
        {info && (
          <div className="mt-3 rounded-lg border border-line p-2 text-sm">
            <div className="font-semibold">{info.name}</div>
            <p>{info.description}</p>
            <p className="text-muted">Aggregation: {info.agg}. Synonyms: {info.synonyms.join(", ")}</p>
          </div>
        )}
      </Card>
      <div className="flex flex-col gap-3">
        <Card>
          <details><summary data-guide-action="search-source-inspect" onClick={event=>{event.preventDefault();const details=event.currentTarget.parentElement as HTMLDetailsElement;if(details.open){details.open=false;return;}withGuideInspection('source-model-inspected',sourceInspectionPayload,()=>{details.open=true});}}>Source · manufacturing shift model</summary><p>Local synthetic manufacturing shift model. Inspect the result source IDs, cutoff and eligibility before interpreting a number. This selector does not connect an external warehouse or switch source models.</p><dl><dt>Current result identity</dt><dd>{resultIdentity.get(rows)||'No captured result; source inspection is not recorded as complete.'}</dd><dt>Fixture and cutoff</dt><dd>{providerFixture(query.provider)} · {query.asOf||'Cutoff unavailable'}</dd><dt>Operand units</dt><dd>{measures.map(m=>(columnById(m)?.name||m)+' · '+(columnById(m)?.unit||'unit unavailable')).join('; ')||'No measure selected'}</dd><dt>Source anchors</dt><dd>{[...new Set(rows.flatMap(r=>r.evidence))].slice(0,200).join(' · ')||'No eligible source anchors'}</dd></dl>{rows.slice(0,40).map(r=><p key={r.key}>{r.key}: {Object.entries(r.eligibility).map(([k,v])=>k+' '+v).join('; ')}</p>)}{rows.length>40&&<p>Showing40 of{rows.length} result groups; use Source and eligibility for the full returned result.</p>}</details>
          <div className="mt-2 flex flex-col gap-2 md:flex-row">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask EKAS — enter a column or manufacturing question" className="min-h-11 flex-1 rounded-lg border border-line bg-bg px-3" />
            <Btn tone="solid" onClick={() => applyDraft()}>Go</Btn>
            <Btn onClick={() => { useEkas.getState().setQuery({ ...emptyQuery(), chart: query.chart }); setDraft(""); setRan(false);setExecutedHere(false); }}>Clear</Btn>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button data-guide-action="search-suggestion" key={s.id} className="rounded-full border border-line px-3 py-1 text-sm" onClick={() => applyDraft(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {query.columns.map((id) => (
              <button key={id} className="rounded-full bg-surface-2 px-3 py-1 text-sm" onClick={() => useEkas.getState().toggleColumn(id)}>
                {columnById(id)?.name ?? id} ×
              </button>
            ))}
            {query.excludedScopes?.map((scope,i)=><span key={'tuple'+i}>Excluded scope {Object.entries(scope.dimensions).map(([key,value])=>key+' = '+value).join(' / ')} ({scope.bucket}) <Btn onClick={()=>useEkas.getState().patchQuery({excludedScopes:query.excludedScopes?.filter((_,j)=>j!==i)})}>Remove excluded scope {i+1}</Btn></span>)}
            {query.filters.map((f, i) => (
              <button key={i} className="rounded-full border border-amber px-3 py-1 text-sm text-amber" onClick={() => useEkas.getState().setQuery({ ...query, filters: query.filters.filter((_, j) => j !== i) })}>
                {f.op === "not" ? "not " : ""}{columnById(f.col)?.name}: {f.values.join(", ")} ×
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn disabled={!canUndo} onClick={() => withQueryGuideAction('query-history-restored',()=>useEkas.getState().undo())}>Undo</Btn>
            <Btn onClick={() => withQueryGuideAction('query-history-restored',()=>useEkas.getState().redo())}>Redo</Btn>
            <Btn onClick={() => (opened ? withQueryGuideAction('query-history-restored',()=>useEkas.getState().resetQuery()) : toast("Reset only after the answer is saved"))}>Reset</Btn>
          </div>
          {coach && (
            <div className="mt-3 rounded-lg border border-line bg-bg p-3 text-sm">
              {ran?(executedHere?"Executed current query is shown. Clear starts a pending query.":"Restored query is shown. Query controls update its preview; Go confirms and names it. Clear starts a pending query."):"Results wait for Go. A token is not an answer until it runs on the model."}
              <button data-guide-action="coach-dismiss" className="ml-2 text-primary" onClick={() => {if(useEkas.setState({coach:false}))useEkas.getState().log("Dismissed local coach mark")}}>Got it</button>
            </div>
          )}
        </Card>
        <Card>
          <div className="flex flex-wrap gap-2">
            {(["column", "bar", "line", "area", "pie", "table", "headline", "pivot", "waterfall"] as const).map((c) => (
              <button data-guide-action="chart-choice" key={c} className={query.chart === c ? "min-h-11 rounded-lg bg-primary px-3 text-sm text-primary-fg" : "min-h-11 rounded-lg border border-line px-3 text-sm"} onClick={() => {if(query.chart!==c){useEkas.getState().patchQuery({chart:c});useEkas.getState().log("Changed local chart kind")}}}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn data-guide-action="chart-labels" onClick={() => {useEkas.getState().patchQuery({labels:!query.labels});useEkas.getState().log("Changed local chart labels")}}>Labels {query.labels ? "on" : "off"}</Btn>
            <Btn onClick={() => useEkas.getState().patchQuery({ decimals: query.decimals === 1 ? 2 : 1 })}>Decimals {query.decimals}</Btn>
            <Btn onClick={() => useEkas.getState().patchQuery({ compare: !query.compare })}>Compare prior</Btn>
            {(["month", "quarter", "year", "week"] as const).map((b) => (
              <button key={b} className="min-h-11 rounded-lg border border-line px-3 text-sm" onClick={() => useEkas.getState().patchQuery({ bucket: b })}>
                {b}
              </button>
            ))}
          </div>
          {groups.length > 1 && query.chart !== "table" && query.chart !== "pivot" && (
            <details open className="mt-2 text-sm text-amber"><summary data-guide-action="unvisualized-axis">Not visualized as its own axis: {columnById(groups[1])?.name}. Switch to pivot or table.</summary><p>The second grouped dimension remains in exact source rows. Use the normal table or pivot control to inspect both dimensions.</p></details>
          )}
          <div className="mt-3">
            {!ran&&<p role="status">Results wait for Go. Choose tokens, then run the governed query.</p>}
            <Viz
              onExclude={(col,value)=>withQueryGuideAction('legend-excluded',()=>useEkas.getState().addFilter({col,op:"not",values:[value]}))}
              rows={rows}
              query={query}
              maskDowntime={useEkas.getState().maskDowntime}
              onPoint={(col, value,dimensions) => {
                useEkas.setState({ selectedPoint: { col, value,dimensions } });
                useEkas.getState().log(`Selected ${col}=${value}`);
              }}
            />
          </div>
          {selected && (
            <div className="mt-3 rounded-lg border border-line p-3">
              <div className="font-semibold">Point · {Object.entries(selectedDimensions(selected)).map(([col,value])=>(columnById(col)?.name??col)+' = '+value).join(' · ')}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {drillTargets.map((c) => (
                  <Btn data-guide-action="slice-drill" key={c.id} onClick={() => withQueryGuideAction('slice-drilled',()=>useEkas.getState().drill(c.id))}>Drill by {c.name}</Btn>
                ))}
                <Btn onClick={() => withQueryGuideAction('slice-kept',()=>useEkas.getState().keepOnly())}>Keep only</Btn>
                <Btn onClick={() => withQueryGuideAction('slice-excluded',()=>useEkas.getState().excludePoint())}>{Object.keys(selectedDimensions(selected)).length>1?"Exclude selected scope":"Exclude"}</Btn>
                <Btn onClick={() => withGuideInspection("underlying-inspected",()=>{const scoped=selected?{...query,filters:selectedScopeFilters(query.filters,selected)}:query,rows=runQuery(scoped,ctxOf());return rows.length?{query:scoped,resultId:resultIdentity.get(rows)||null,rowCount:rows.length,evidenceIds:[...new Set(rows.flatMap(r=>r.evidence))].slice(0,200),evidenceLimit:200,qualification:"Exact selected synthetic result; raw inputs separate from derived values."}:null},()=>useEkas.setState({underlying:true}))}>Underlying</Btn>
              </div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => useEkas.getState().saveAnswer()}>Save</Btn>
            <label>Pin board<select aria-label="Pin board" value={pinBoard} onChange={e=>{setPinBoard(e.target.value);setPinTab(boards.find(b=>b.id===e.target.value)?.tabs[0]||"Overview")}}>{boards.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Pin tab<select aria-label="Pin tab" value={pinTab} onChange={e=>setPinTab(e.target.value)}>{boards.find(b=>b.id===pinBoard)?.tabs.map(t=><option key={t} value={t}>{t}</option>)}</select></label><Btn onClick={() => pinBoard && useEkas.getState().pinTo(pinBoard,pinTab)}>Pin</Btn>
            <Btn onClick={() => useEkas.setState({ shareOpen: true })}>Share</Btn>
            <Btn onClick={() => download("answer.csv", toCsv(rows, query), "text/csv","csv-prepared")}>CSV</Btn>
            <Btn onClick={() => window.print()}>Print</Btn>
            <Btn onClick={() => withGuideInspection("sql-inspected",()=>!sqlOpen?{sql:sqlOf(query,ctxOf()),query,executed:false}:null,()=>useEkas.setState({sqlOpen:!sqlOpen}))}>SQL</Btn>
            <Btn onClick={() => withQueryGuideAction('explore-inspected',()=>useEkas.setState({explore:!explore}))}>Explore</Btn>
            <Btn onClick={() => { useEkas.setState({ patternRan: true }); useEkas.getState().go("patterns"); }}>Pattern scan</Btn>
            <Btn onClick={() => useEkas.getState().addKpi()}>Watch</Btn>
            <Btn onClick={() => useEkas.getState().go("embed")}>Embed</Btn>
            <Btn
              onClick={() => {
                try{createCurrentMonitor();toast('Monitor created for captured cohort')}catch(error){toast(error instanceof Error?error.message:'Monitor refused')}
              }}
            >
              Monitor
            </Btn>
          </div>
          {sqlOpen && <pre className="mt-3 overflow-x-auto rounded-lg bg-bg p-3 font-mono text-sm">{sqlOf(query, ctxOf())}</pre>}
          {explore && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn onClick={() => useEkas.getState().addFilter({ col: "site", op: "in", values: ["TP-S1"] })}>Only TP-S1</Btn>
              <Btn onClick={() => useEkas.getState().patchQuery({ columns: [...measures, "line"] })}>Replace with line</Btn>
              <Btn onClick={() => useEkas.getState().patchQuery({ columns: [...new Set([...query.columns, "part"])] })}>Add part</Btn>
              <Btn onClick={() => useEkas.getState().patchQuery({ compare: true })}>Compare</Btn><Btn onClick={()=>useEkas.getState().undo()}>Back</Btn>
            </div>
          )}
          {underlying && (()=>{const scoped=selected?{...query,filters:selectedScopeFilters(query.filters,selected)}:query;const context=ctxOf(),formula=formulas.find(f=>f.id===query.formulaId);return <div className="mt-3 text-sm"><h3>Underlying selected result</h3><p>Exact selected point, filters and cutoff. Raw inputs are separate from derived values.</p><ResultEvidence label="Underlying result evidence" query={scoped} context={context} rows={runQuery(scoped,context,formula)} formula={formula}/></div>})()}
          {rows.length === 0 && <p className="mt-3 text-sm text-amber">No rows. A filter or the row rule removed every slice.</p>}
        </Card>
        {filterCol && (
          <Card>
            <div className="font-semibold">Filter {columnById(filterCol)?.name}</div><label>Operation<select aria-label="Query filter operation" value={filterOp} onChange={e=>{const op=e.target.value as "in"|"not";setFilterOp(op);const existing=query.filters.find(f=>f.col===filterCol&&f.op===op);if(existing)setPicked(existing.values.slice())}}><option value="in">Include</option><option value="not">Exclude</option></select></label><p>Current {filterOp==='in'?'include':'exclude'} selection. Include and Exclude save the chosen values; Close cancels edits.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {valuesFor(filterCol).map((v) => (
                <label key={v} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={picked.includes(v)} onChange={() => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))} />
                  {v}
                </label>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Btn tone="solid" onClick={() => { if (picked.length) withQueryGuideAction('filter-applied',()=>useEkas.getState().addFilter({ col: filterCol, op: "in", values: picked })); closeFilter(); }}>Include</Btn>
              <Btn onClick={() => { if (picked.length) withQueryGuideAction('filter-applied',()=>useEkas.getState().addFilter({ col: filterCol, op: "not", values: picked })); closeFilter(); }}>Exclude</Btn>
              <Btn onClick={closeFilter}>Close</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Boards() {
  const [ownerFilter,setOwnerFilter]=useState("all"),[tagFilter,setTagFilter]=useState("");
  const localOwner=useEkas(s=>s.displayName);
  const boards = useEkas((s) => s.boards);
  const [name, setName] = useState("");
  const shownBoards=boards.filter(b=>(ownerFilter!=="yours"||(b.owner||localOwner)===localOwner)&&(!tagFilter||b.tags.includes(tagFilter)));
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Boards</h1>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New board name" className="min-h-11 flex-1 rounded-lg border border-line bg-surface px-3" />
        <Btn tone="solid" onClick={() => name.trim() && useEkas.getState().saveBoard(name.trim())}>Create</Btn>
      </div>
      <label>Owner<select data-guide-action="boards-owner" aria-label="Board owner" value={ownerFilter} onChange={e=>withGuideInspection("board-list-inspected",()=>{const matches=boards.filter(b=>(e.target.value!=="yours"||(b.owner||localOwner)===localOwner)&&(!tagFilter||b.tags.includes(tagFilter)));return matches.length?{owner:e.target.value,tag:tagFilter,items:matches.map(b=>({id:b.id,name:b.name,owner:b.owner,tags:b.tags}))}:null},()=>setOwnerFilter(e.target.value))}><option value="all">All local owners</option><option value="yours">Yours</option></select></label>
      <label>Tag<select aria-label="Board tag" value={tagFilter} onChange={e=>setTagFilter(e.target.value)}><option value="">All tags</option>{[...new Set(boards.flatMap(b=>b.tags))].sort().map(tag=><option key={tag} value={tag}>{tag}</option>)}</select></label>
      <p role="status">{shownBoards.length} matching local boards{!shownBoards.length?". Clear owner/tag filters or create a board.":"."}</p>
      {shownBoards.map((b) => (
        <Card key={b.id}>
          <button className="text-left" onClick={() => { useEkas.setState({ boardId: b.id, boardTab: b.tabs[0] }); useEkas.getState().go("board"); }}>
            <div className="font-semibold">{b.name}</div>
            <div className="text-sm text-muted">{b.verified ? "Locally reviewed definition" : "Unverified"} · {b.tags.join(", ") || "no tags"} · {b.tiles.length} tiles</div>
          </button>
        </Card>
      ))}
    </div>
  );
}

function BoardView() {
  const boards = useEkas((s) => s.boards);
  const provider=useEkas(s=>s.query.provider);
  const boardId = useEkas((s) => s.boardId);
  const tab = useEkas((s) => s.boardTab);
  const present = useEkas((s) => s.present);
  const presentIndex = useEkas((s) => s.presentIndex);
  const comments = useEkas((s) => s.comments);
  const board = boards.find((b) => b.id === boardId);
  const noteRef=useRef<HTMLTextAreaElement>(null);
  const [note, setNote] = useState(board?.notes ?? "");
  const [layerCol,setLayerCol]=useState("site"),[layerValue,setLayerValue]=useState(()=>valuesFor("site",provider)[0]||""),[layerOp,setLayerOp]=useState<"in"|"not">("in");
  const [comment, setComment] = useState("");
  const [tabName, setTabName] = useState("");
  const [tagInput,setTagInput]=useState("");
  const layerOptions=valuesFor(layerCol,provider);
  useEffect(()=>{if(!layerOptions.includes(layerValue))setLayerValue(layerOptions[0]||"")},[layerCol,JSON.stringify(provider),layerOptions.join("|"),layerValue]);
  if (!board) return <Card>Exact board {boardId} is unavailable. No neighboring board was loaded.</Card>;
  const tiles = board.tiles.filter((t) => t.tab === tab);
  const shown = present ? board.tiles.filter(t=>t.tab===tab)[presentIndex] : undefined;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{board.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Btn data-guide-action="board-review" onClick={() => patchBoard(board.id,{verified:!board.verified})}>{board.verified ? "Locally reviewed" : "Mark locally reviewed"}</Btn>
          <Btn onClick={() => patchBoard(board.id,{followed:!board.followed})}>{board.followed ? "Following" : "Follow"}</Btn>
          <Btn disabled={!tiles.length} onClick={() => withGuideInspection("presentation-opened",()=>tiles[0]?{boardId:board.id,tab,tileId:tiles[0].id,query:tiles[0].query,canonicalResultId:tiles[0].canonicalResultId||null,nativePresentationConfirmed:false}:null,()=>useEkas.setState({present:true,presentIndex:0}),()=>objectInspectionReference("boards",board.id))}>Present</Btn>{!tiles.length&&<p role="status">Add a tile to this tab to present it.</p>}
          <CurrentScheduleButton context={ctxOf()} board={board}/>
          <Btn onClick={() => download(`${board.name}.json`, JSON.stringify(board, null, 2), "application/json","board-export-prepared")}>Export</Btn>
          <Btn onClick={() => window.print()}>Print</Btn>
        </div>
      </div>
      <p className="text-sm text-muted">{board.description} · Owner: {board.owner||"Local session (legacy capture)"}</p>
      <label>Board tags<input aria-label="Board tags" value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="Comma-separated tags"/></label><Btn onClick={()=>{const tags=[...new Set(tagInput.split(",").map(t=>t.trim()).filter(Boolean))];if(tags.length<=20&&tags.every(t=>t.length<=80))patchBoard(board.id,{tags});else toast("At most20 tags of80 characters.")}}>Save tags</Btn>
      <div className="flex flex-wrap gap-2">
        {board.tabs.map((t) => (
          <button key={t} className={t === tab ? "min-h-11 rounded-lg bg-primary px-3 text-sm text-primary-fg" : "min-h-11 rounded-lg border border-line px-3 text-sm"} onClick={() => useEkas.setState({ boardTab: t })}>
            {t}
          </button>
        ))}
        <input value={tabName} onChange={(e) => setTabName(e.target.value)} placeholder="New tab" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
        <Btn onClick={() => {if(tabName.trim()&&!board.tabs.includes(tabName.trim())&&useEkas.setState({boards:boards.map(b=>b.id===board.id?{...b,tabs:[...b.tabs,tabName.trim()]}:b),boardTab:tabName.trim()}))useEkas.getState().log("Added local Board tab")}}>Add tab</Btn>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-muted">Saved filters {board.filters.length}. Personal {board.personal.length}.</span>
        <label>Filter dimension<select aria-label="Board filter dimension" value={layerCol} onChange={e=>{setLayerCol(e.target.value);setLayerValue(valuesFor(e.target.value,provider)[0]||"")}}>{COLUMNS.filter(c=>c.kind!=="measure").map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Operation<select aria-label="Board filter operation" value={layerOp} onChange={e=>setLayerOp(e.target.value as "in"|"not")}><option value="in">Keep only</option><option value="not">Exclude</option></select></label><label>Value<select aria-label="Board filter value" value={layerValue} onChange={e=>setLayerValue(e.target.value)}>{layerOptions.map(v=><option key={v} value={v}>{v}</option>)}</select></label><Btn onClick={()=>{if(!layerOptions.includes(layerValue)){toast("Choose an available filter value for this fixture.");return;}patchBoard(board.id,{personal:[...board.personal.filter(f=>f.col!==layerCol),{col:layerCol,op:layerOp,values:[layerValue]}]})}}>Apply personal filter</Btn>
        <Btn onClick={() => patchBoard(board.id, { personal: [], filters: board.filters })}>Reset personal</Btn>
        <Btn onClick={()=>{if(!layerOptions.includes(layerValue)){toast("Choose an available filter value for this fixture.");return;}patchBoard(board.id,{filters:[...board.filters.filter(f=>f.col!==layerCol),{col:layerCol,op:layerOp,values:[layerValue]}]})}}>Save board filter</Btn>{board.filters.map((f,i)=><span key={"saved"+i}>Saved {f.col} {f.op} {f.values.join(", ")} <Btn onClick={()=>patchBoard(board.id,{filters:board.filters.filter((_,j)=>j!==i)})}>Remove saved filter {i+1}</Btn></span>)}{board.personal.map((f,i)=><span key={"personal"+i}>Personal {f.col} {f.op} {f.values.join(", ")} <Btn onClick={()=>patchBoard(board.id,{personal:board.personal.filter((_,j)=>j!==i)})}>Remove personal filter {i+1}</Btn></span>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {tiles.map((t, idx) => {
          const q = effectiveBoardQuery(t.query,board.filters,board.personal);
          const rows = runQuery(q, ctxOf());
          return (
            <Card key={t.id}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.title}</div>
                <Btn onClick={() => idx===0?(()=>{noteRef.current?.scrollIntoView?.({block:'center',behavior:'smooth'});noteRef.current?.focus()})():moveTile(board.id, t.id, -1)}>{idx === 0 ? "Note" : "Up"}</Btn>
              </div>
              <>{t.evidenceCaptureId?<EvidenceCaptureView captureId={t.evidenceCaptureId}/>:t.canonicalResultId?<><p>Immutable captured result: board and personal filters do not recompute this historical tile. Create a new capture for changed filters.</p><CanonicalTile resultId={t.canonicalResultId}/></>:<Viz rows={rows} query={q} maskDowntime={useEkas.getState().maskDowntime} onPoint={(col, value,dimensions) => patchBoard(board.id, { personal: [...board.personal.filter(f=>f.col!==col),{ col, op: "in", values: [value] }] })}/>}</>
              <Btn data-guide-action="tile-open" onClick={() => withGuideInspection("tile-opened",()=>{const current=useEkas.getState();return current.screen==="search"||current.screen==="metriclab"?{boardId:board.id,tileId:t.id,query:t.query,canonicalResultId:t.canonicalResultId||null,destination:current.screen}:null},() => { if(t.evidenceCaptureId){const answer=useEkas.getState().answers.find(a=>a.evidenceCaptureId===t.evidenceCaptureId);if(answer){useEkas.setState({openedAnswerId:answer.id});useEkas.getState().go("metriclab");}else toast("Save this capture to Answers to reopen it; its exact source remains visible in this tile.");}else if(t.canonicalResultId){const answer=useEkas.getState().answers.find(a=>a.canonicalResultId===t.canonicalResultId);if(answer){useEkas.setState({openedAnswerId:answer.id});useEkas.getState().go("metriclab");}else toast("Captured result is shown in the tile; save an answer from Metric workbench to reopen it.");}else{useEkas.getState().startNewAnswer(q);useEkas.getState().go("search");} },()=>objectInspectionReference("boards",board.id))}>Open</Btn>
            </Card>
          );
        })}
      </div>
      <Card>
        <div className="font-semibold">Note</div>
        <textarea ref={noteRef} aria-label="Board note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 min-h-20 w-full rounded-lg border border-line bg-bg p-2" />
        <Btn onClick={() => patchBoard(board.id, { notes: note })}>Save note</Btn>
      </Card>
      <Card>
        <div className="font-semibold">Comments</div>
        {comments.filter((c) => c.boardId === board.id).map((c) => (
          <div key={c.id} className="mt-2 text-sm" style={{overflowWrap:'anywhere'}}>{boardCommentPresentation(c).text} <span className="text-muted">{c.mark}</span><div className="text-xs text-muted">{validCommentAttribution(c.attribution)?<>Simulated local actor: {c.attribution.displayName||'Display name not recorded'} · role {c.attribution.role} · Recorded locally: <time dateTime={c.attribution.recordedAt}>{c.attribution.recordedAt}</time> · not authenticated</>:<>Actor not recorded · Time not recorded</>} · Comment ID {c.id} · Board ID {c.boardId}</div>{boardCommentPresentation(c).original&&<details><summary>Historical seed correction</summary><p>Original seed text retained: {boardCommentPresentation(c).original}</p><p>Finance wording was not supported by this manufacturing fixture. User-authored comments are unchanged.</p></details>}</div>
        ))}
        <div className="mt-2 flex gap-2">
          <input aria-label="Board comment" value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-11 flex-1 rounded-lg border border-line bg-bg px-3" />
          <Btn onClick={() => { const current=useEkas.getState(),created=createLocalBoardComment({boardId:board.id,text:comment,mark:"Useful",displayName:current.displayName,role:current.manufacturingChatActor||'manager'});if(!created)return;if(useEkas.setState({comments:[...current.comments,created]}))setComment(""); }}>Useful</Btn>
          <Btn onClick={() => { const current=useEkas.getState(),created=createLocalBoardComment({boardId:board.id,text:comment,mark:"Question",displayName:current.displayName,role:current.manufacturingChatActor||'manager'});if(!created)return;if(useEkas.setState({comments:[...current.comments,created]}))setComment(""); }}>Question</Btn>
        </div>
      </Card>
      {shown && present && (
        <Dialog title={shown.title} wide presentation onClose={()=>useEkas.setState({present:false})} footer={<div className="flex gap-2">
          <Btn onClick={()=>useEkas.setState({presentIndex:Math.max(0,presentIndex-1)})}>Back</Btn>
          <Btn onClick={()=>useEkas.setState({presentIndex:Math.min(tiles.length-1,presentIndex+1)})}>Next</Btn>
          <Btn onClick={()=>useEkas.setState({present:false})}>Close</Btn>
        </div>}>
          {shown.evidenceCaptureId?<EvidenceCaptureView captureId={shown.evidenceCaptureId}/>:shown.canonicalResultId?<CanonicalTile resultId={shown.canonicalResultId}/>:<Viz presentation rows={runQuery(effectiveBoardQuery(shown.query,board.filters,board.personal),ctxOf(),useEkas.getState().formulas.find(f=>f.id===shown.query.formulaId))} query={effectiveBoardQuery(shown.query,board.filters,board.personal)} maskDowntime={useEkas.getState().maskDowntime} onPoint={()=>{}}/>}
        </Dialog>
      )}
    </div>
  );
}

function patchBoard(id: string, partial: Record<string, unknown>) {
  const before=useEkas.getState().boards.find(b=>b.id===id);if(!before)return;
  if(!useEkas.setState((s) => ({ boards: s.boards.map((b) => (b.id === id ? { ...b, ...partial } : b)) })))return;
  if(Object.hasOwn(partial,'filters')&&JSON.stringify(before.filters)!==JSON.stringify(partial.filters))useEkas.getState().log('Saved local Board filter');
  if(Object.hasOwn(partial,'notes')&&before.notes!==partial.notes)useEkas.getState().log('Saved local Board note');
  const saved=useEkas.getState().boards.find(b=>b.id===id)!;if(Object.hasOwn(partial,'personal')&&JSON.stringify(before.personal)!==JSON.stringify(saved.personal))useEkas.getState().log('Saved local Board personal '+JSON.stringify({id,personal:saved.personal}));if(['verified','followed'].some(key=>Object.hasOwn(partial,key)&&(before as any)[key]!==partial[key]))useEkas.getState().log('Saved local Board flags '+JSON.stringify({id,verified:saved.verified,followed:saved.followed}));
}

function moveTile(boardId: string, tileId: string, dir: number) {
  const original=useEkas.getState().boards.find(b=>b.id===boardId),i=original?.tiles.findIndex(t=>t.id===tileId)??-1;if(!original||i<0||i+dir<0||i+dir>=original.tiles.length)return;
  if(!useEkas.setState((s) => ({
    boards: s.boards.map((b) => {
      if (b.id !== boardId) return b;
      const i = b.tiles.findIndex((t) => t.id === tileId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.tiles.length) return b;
      const tiles = [...b.tiles];
      const [sp] = tiles.splice(i, 1);
      tiles.splice(j, 0, sp);
      return { ...b, tiles };
    }),
  })))return;
  useEkas.getState().log('Reordered local Board tile');
}

function Answers() {
  const answers = useEkas((s) => s.answers);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Answers</h1>
      {!answers.length&&<div role="status"><p>No saved answers yet. Create a query in Search, then use Save to keep its definition.</p><Btn onClick={()=>useEkas.getState().go("search")}>Create an answer</Btn></div>}
      {answers.map((a) => (
        <Card key={a.id}>
          <button data-guide-action="saved-answer-open" className="text-left" onClick={() => withGuideInspection("answer-opened",()=>({id:a.id,query:a.query,updated:a.updated,canonicalResultId:a.canonicalResultId||null}),() => { useEkas.setState({ openedAnswerId: a.id }); useEkas.getState().setQuery(structuredClone(a.query), false); useEkas.getState().go(a.evidenceCaptureId||a.canonicalResultId?"metriclab":"search"); },()=>objectInspectionReference("answers",a.id))}>
            <div className="font-semibold">{a.query.title}</div>
            <div className="text-sm text-muted">{a.updated} · {a.query.columns.join(", ")}</div>
          </button>
        </Card>
      ))}
    </div>
  );
}

function Collections() {
  const [selectedItem,setSelectedItem]=useState("");
  const removals=useEkas(s=>s.collectionRemovals);
  const boards=useEkas(s=>s.boards),answers=useEkas(s=>s.answers);
  const items=[...answers.map(a=>({id:a.id,name:a.query.title,kind:"Answer"})),...boards.map(b=>({id:b.id,name:b.name,kind:"Board"}))];
  const [name,setName]=useState("");
  const collections = useEkas((s) => s.collections);
  const opened = useEkas((s) => s.openedAnswerId);
  const validOpened=!!opened&&answers.some(answer=>answer.id===opened);
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Collections</h1>{!collections.length&&<p role="status">No collections yet. Name a collection, then add saved answers or boards.</p>}<label>New collection name<input value={name} onChange={e=>setName(e.target.value)}/></label><Btn onClick={()=>{if(name.trim()){useEkas.setState(s=>({collections:[...s.collections,{id:crypto.randomUUID(),name:name.trim(),members:[]}]}));setName("")}}}>Create collection</Btn>
      {!validOpened&&<p role="status">Open a saved answer to enable Add open answer, or choose an exact item below.</p>}<label>Member<select aria-label="Collection item" value={selectedItem} onChange={e=>setSelectedItem(e.target.value)}><option value="">Choose exact board or answer</option>{items.map(item=><option key={item.id} value={item.id}>{item.kind}: {item.name}</option>)}</select></label>
      {collections.map((c) => (
        <Card key={c.id}>
          <div className="font-semibold">{c.name}</div>{!c.members.length&&<p role="status">This collection has no members. Choose a saved answer or board, then Add selected item.</p>}
          <div className="text-sm text-muted">{c.members.map(id=>{const item=items.find(i=>i.id===id);return <div key={id}>{item?.name||("Unavailable exact member "+id)}{item&&<Btn onClick={()=>{try{openCollectionMember(id)}catch(error){toast(error instanceof Error?error.message:"Member unavailable")}}}>Open {item.name}</Btn>}<Btn onClick={()=>removeCollectionMember(c.id,id)}>Remove {item?.name||id}</Btn></div>})}</div>
          {removals.some(r=>r.collectionId===c.id)&&<Btn onClick={()=>undoCollectionRemoval(c.id)}>Undo removal</Btn>}
          <Btn onClick={()=>{if(!items.some(item=>item.id===selectedItem)){toast("Choose an existing exact board or answer.");return}addCollectionMember(c.id,selectedItem)}}>Add selected item</Btn>
          <Btn disabled={!validOpened} onClick={() => validOpened && opened && addCollectionMember(c.id,opened)}>Add open answer</Btn>
        </Card>
      ))}
    </div>
  );
}

function Schedules() {
  const schedules = useEkas((s) => s.schedules);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Schedules</h1>
      {schedules.map((s) => (
        <Card key={s.id}>
          <div className="font-semibold">{s.name}</div>
          <div className="text-sm text-muted">{s.cadence} · {s.target} · {s.status} · {s.last}<p>{s.statusNote||"Local simulated schedule; no automatic external delivery."} {s.resultId}</p></div>
          {s.targetBoard&&<p>Board {s.targetBoard.boardId} · revision {s.targetBoard.sourceRevision} · {s.targetBoard.source.tabs.join(', ')} · {s.targetBoard.source.tiles.length} tiles</p>}{!s.targetBoard&&<p>Single-query schedule · legacy board schedules retain only their original captured query.</p>}{s.boardRun?.tiles.map(t=><p key={t.id}>{t.tab} / {t.title} · {t.status} · {t.rows.length} rows</p>)}<Btn onClick={async()=>{try{const next=s.targetBoard?await runBoardSchedule(s.targetBoard,ctxOf()):undefined;useEkas.setState(st=>({schedules:st.schedules.map(x=>x.id===s.id&&(!next||x.targetBoard?.sourceRevision===next.sourceRevision)?(next?{...x,boardRun:next,last:next.runAt,status:next.status,statusNote:next.note}:runCapturedSchedule(x,ctxOf())):x)}))}catch(error){toast(error instanceof Error?error.message:'Run failed')}}}>Run now</Btn>
        </Card>
      ))}
      <CurrentScheduleButton context={ctxOf()}/>
    </div>
  );
}

function Monitors() {
 const monitors=useEkas(s=>s.monitors);
 const patch=(id:string,changes:Partial<(typeof monitors)[number]>)=>useEkas.setState(s=>({monitors:s.monitors.map(m=>m.id===id?{...m,...changes}:m)}));
 return <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold">Monitors</h1><Btn onClick={()=>{try{createCurrentMonitor()}catch(error){toast(error instanceof Error?error.message:'Monitor refused')}}}>Create current monitor</Btn><p>Local evaluation of the explicit historical synthetic cutoff. Muting changes in-app notices. Change compares the latest eligible daily aggregate with its previous calendar day; missing prior exposure stays unavailable. Channels are simulated; nothing is emailed or dispatched.</p>{monitors.map(m=>{const {status,value,prior}=evaluatedMonitor(m,ctxOf());return <Card key={m.id}><strong>{m.name}</strong><p>{m.muted?'Muted':status} · {formatValue(m.measure,value,2,useEkas.getState().maskDowntime)} · {m.channel} (simulated)</p><label>Measure<select aria-label={'Monitor measure '+m.id} value={m.measure} onChange={e=>patch(m.id,{measure:e.target.value})}>{COLUMNS.filter(c=>c.kind==='measure').map(c=><option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}</select></label><label>Channel (simulated)<select aria-label={'Monitor channel '+m.id} value={m.channel} onChange={e=>{if(["In-app","Email"].includes(e.target.value))patch(m.id,{channel:e.target.value})}}>{[...new Set(["In-app","Email",m.channel])].map(channel=><option key={channel}>{channel}</option>)}</select></label><label>Rule<select aria-label={'Monitor rule '+m.id} value={m.rule} onChange={e=>patch(m.id,{rule:e.target.value as typeof m.rule})}>{['below','above','change'].map(r=><option key={r}>{r}</option>)}</select></label><label>Threshold (raw definition units)<input aria-label={'Monitor threshold '+m.id} type="number" value={m.threshold} onChange={e=>patch(m.id,{threshold:Number(e.target.value)})}/></label><p>{m.rule==='change'&&prior===undefined?'Comparison unavailable; no pass or clear status inferred.':''} Percentage measures use raw ratios:0.8 means80%.</p><Btn onClick={()=>patch(m.id,{muted:!m.muted})}>{m.muted?'Unmute':'Mute'}</Btn></Card>})}</div>;
}

function Patterns() {
  const query = useEkas((s) => s.query);
  const prefs = useEkas((s) => s.patternPrefs);
  const ran = useEkas((s) => s.patternRan);
  const feedback = useEkas((s) => s.insightFeedback);
  const blocked = activeGroup(query).length === 0;
  const lastRun=useEkas(s=>s.patternRuns?.at(-1));
  const matchingRun=lastRun&&JSON.stringify({query,context:ctxOf(),prefs})===JSON.stringify({query:lastRun.query,context:lastRun.context,prefs:lastRun.prefs});
  const insights = ran&&!blocked ? lastRun?(matchingRun?lastRun.insights:[]):analyze(query,ctxOf(),undefined,prefs) : [];
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Pattern scan</h1>{lastRun&&<p role="status">Saved synthetic scan {lastRun.id} · captured {lastRun.capturedAt} · {matchingRun?lastRun.status:"Historical: query, scope or preferences changed. Run explicitly for the new context."}. No causal proof.</p>}
      <p className="text-sm text-muted">Scans locate change. They do not establish cause. Grouped headline-only answers are a weak scan.</p>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => runLocalPatternScan()}>Run</Btn>
        <Btn data-guide-action="pattern-empty" onClick={() => setPatternPreferences({...prefs,dropNulls:!prefs.dropNulls})}>Drop empty: {prefs.dropNulls ? "on" : "off"}</Btn>
        <Btn onClick={() => setPatternPreferences({...prefs,dropZeros:!prefs.dropZeros})}>Drop zeros: {prefs.dropZeros ? "on" : "off"}</Btn>
      </div>
      {blocked && <p className="text-sm text-amber">A single headline has no slice to compare. Add an attribute first.</p>}
      {ran&&!blocked&&insights.length===0&&<p role="status">No matching observations for this scan and its current filters. Drop empty hides missing or unavailable values; Drop zeros hides observed zero values. Adjust the filters or these controls to inspect excluded slices.</p>}
      {insights.map((ins) => (
        <Card key={ins.id}>
          <div className="text-sm text-info">{ins.kind}</div>
          <div className="font-semibold">{ins.title}</div>
          <p className="text-sm">{ins.detail}</p>
          <p className="text-sm text-amber">{ins.uncertainty}</p>
          <div className="mt-2 flex gap-2">
            <Btn onClick={() => useEkas.setState((s) => ({ insightFeedback: { ...s.insightFeedback, [ins.id]: "useful" } }))}>Useful</Btn>
            <Btn onClick={() => useEkas.setState((s) => ({ insightFeedback: { ...s.insightFeedback, [ins.id]: "not" } }))}>Not useful</Btn>
            <span className="text-sm text-muted">{feedback[ins.id]}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Inspection() {
  const [q, setQ] = useState("");
  const items = WORKFLOWS.filter((w) => (w.area + w.name + w.detail).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Workflow inventory</h1>
      <p className="text-sm text-muted">{WORKFLOWS.length} documented local workflows with EKAS data and source boundaries. Open any row.</p>
      <input aria-label="Find a workflow" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a workflow" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
      {q&&<Btn onClick={()=>setQ("")}>Clear workflow search</Btn>}
      {!items.length&&<p role="status">No workflows match. Change your search or clear it to see all documented workflows.</p>}
      {items.map((w) => (
        <Card key={w.area + w.name}>
          <div className="text-sm text-muted">{w.area}</div>
          <div className="font-semibold">{w.name}</div>
          <p className="text-sm">{w.detail}</p>
          <Btn onClick={() => useEkas.getState().go(w.screen)}>Open</Btn>
        </Card>
      ))}
    </div>
  );
}

const OBJECTS = [
  { type: "Model", name: "Manufacturing leadership model", source: "Local synthetic fixture", tags: "synthetic metadata", author: "You", when: "Today" },
  { type: "Worksheet", name: "Manufacturing leadership worksheet", source: "Local synthetic fixture", tags: "definition1 · synthetic", author: "You", when: "Today" },
  { type: "Table", name: "fact_jobs", source: "Local synthetic fixture", tags: "", author: "System", when: "Today" },
  { type: "Table", name: "dim_site", source: "Local synthetic fixture", tags: "", author: "System", when: "Today" },
  { type: "Table", name: "dim_date", source: "Local synthetic fixture", tags: "monday", author: "System", when: "Today" },
];

function DataScreens() {
  const screen = useEkas((s) => s.screen);
  const reviews=useEkas(s=>s.boardReviews);
  const aliasRevision=useEkas(s=>s.aliasRevision);
  const syncAt=useEkas(s=>s.dbtAt);
  const yours = useEkas((s) => s.objectYours);
  const objectSearch = useEkas((s) => s.objectSearch);
  const memory = useEkas((s) => s.memory);
  const [page, setPage] = useState(0);
  useEffect(()=>setPage(0),[yours,objectSearch]);
  const savedOeeAliases=useEkas(s=>s.synonyms.oee);
  const [syn, setSyn] = useState(()=>savedOeeAliases?.join(", ")??"overall equipment effectiveness");
  useEffect(()=>setSyn(savedOeeAliases?.join(", ")??"overall equipment effectiveness"),[savedOeeAliases]);
  const [phrase, setPhrase] = useState("");
  const [detail, setDetail] = useState<string | null>(null);
  const [selectedObjects,setSelectedObjects]=useState<string[]>([]);
  const rows = OBJECTS.filter((o) => (!yours || o.author === "You") && o.name.toLowerCase().includes(objectSearch.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(rows.length / 3));
  const currentPage = Math.min(page, pageCount - 1);
  const slice = rows.slice(currentPage * 3, currentPage * 3 + 3);
  if (screen === "objects") {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Data objects</h1>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => useEkas.setState({ objectYours: false })}>All</Btn>
          <Btn onClick={() => useEkas.setState({ objectYours: true })}>Yours</Btn>
          <input data-guide-action="definition-find" value={objectSearch} onChange={(e) => useEkas.setState({ objectSearch: e.target.value })} placeholder="Search" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {OBJECTS.slice(0, 3).map((o) => (
            <Card key={o.name}><div className="text-sm text-muted">{o.type}</div><div className="font-semibold">{o.name}</div><div className="text-sm text-muted">{o.when}</div></Card>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted"><th></th><th>Type</th><th>Name</th><th>Source</th><th>Tags</th><th>Author</th><th>Modified</th></tr></thead>
            <tbody>
              {slice.map((o) => (
                <tr key={o.name} className="border-t border-line">
                  <td><input type="checkbox" aria-label={`select ${o.name}`} checked={selectedObjects.includes(o.name)} onChange={()=>setSelectedObjects(v=>v.includes(o.name)?v.filter(n=>n!==o.name):[...v,o.name])} /></td>
                  <td>{o.type}</td>
                  <td><button data-guide-action="object-open" className="text-left text-info" onClick={() => withGuideInspection("object-inspected",()=>({name:o.name,type:o.type,metadata:objectMetadata(o.name,useEkas.getState().query.provider),editableSchema:false}),()=>setDetail(o.name))}>{o.name}</button></td>
                  <td>{o.source}</td><td>{o.tags}</td><td>{o.author}</td><td>{o.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p role="status">{selectedObjects.length} objects selected</p><Btn onClick={()=>download("selected-data-objects.json",JSON.stringify(OBJECTS.filter(o=>selectedObjects.includes(o.name)),null,2),"application/json")}>Export selected metadata</Btn>
        <Btn onClick={() => setPage((p) => (Math.min(p, pageCount - 1) + 1) % pageCount)}>Next</Btn>
        {detail && (
          <Card>
            <div className="font-semibold">{detail}</div>
            <p>{objectMetadata(detail,useEkas.getState().query.provider).description}</p><p>Source: {objectMetadata(detail,useEkas.getState().query.provider).source}</p><p>Joins: {objectMetadata(detail,useEkas.getState().query.provider).joins}</p>
            <p className="text-sm">Row rule: site = selected simulated site when enforcement is on. This is a presentation policy, not authentication.</p>
            <p className="text-sm">Columns: {objectMetadata(detail,useEkas.getState().query.provider).columns.join(", ")}</p>
            {!['dim_date','dim_site'].includes(detail)&&<><label className="mt-2 block text-sm">Synonyms for OEE
              <input value={syn} onChange={(e) => setSyn(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-line bg-bg px-3" />
            </label>
            <Btn onClick={()=>{try{saveAliases({oee:syn.split(",").map(s=>s.trim()).filter(Boolean)});toast("Local OEE aliases saved; governed formula and units retained.")}catch(error){toast(error instanceof Error?error.message:"Aliases rejected")}}}>Save synonyms</Btn><p>Local alias revision {useEkas.getState().aliasRevision}; production definitions unchanged.</p><p className="text-sm text-muted">{DEFINITIONS.oee}</p></>}
          </Card>
        )}
      </div>
    );
  }
  if (screen === "connections") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Connections</h1>
        <Card><details><summary data-guide-action="connections-inspect" onClick={event=>{event.preventDefault();const details=event.currentTarget.parentElement as HTMLDetailsElement;if(details.open){details.open=false;return;}withGuideInspection('connection-status-inspected',()=>({localSynthetic:true,externalConnected:false,credentialsAvailable:false,liveTestPerformed:false,localService:'EKAS synthetic query service',adapters:['Snowflake','Databricks','BigQuery','Postgres','Upload'].map(name=>({name,status:'not-connected'})),qualification:'Read-only authored connection status; no live connectivity, credential setup or backend conformance.'}),()=>{details.open=true});}}>EKAS warehouse connection status</summary><p className="text-sm">Local synthetic query service. No external connection.</p><p>Tom’s API version, authentication, permissions and source contracts require integration conformance. No connection credentials or live connectivity test is available here.</p></details></Card>
        {["Snowflake", "Databricks", "BigQuery", "Postgres", "Upload"].map((n) => (
          <Card key={n}><div className="font-semibold">{n}</div><p className="text-sm text-muted">Not connected in this shell.</p></Card>
        ))}
      </div>
    );
  }
  if (screen === "studio") return <Studio />;
  if (screen === "utilities") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Utilities</h1>
        <p>Export local alias definitions with their source module, local revision and current query context. This is not a full model or source-data export; importing aliases changes synonyms only.</p><Btn onClick={() => download("ekas-aliases.json", JSON.stringify(exportAliases(), null, 2), "application/json","alias-export-prepared")}>Export alias definitions JSON</Btn>
        <label className="text-sm">Import synonyms JSON
          <input type="file" accept="application/json" className="mt-1 block" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try{if(file.size>2000000)throw new Error("Synonyms file exceeds2MB.");importAliases(await file.text());toast("Validated aliases imported into local query suggestions and interpretation.")}catch(error){toast(error instanceof Error?error.message:"Invalid synonyms JSON; no change saved.")}
          }} />
        </label>
      </div>
    );
  }
  if (screen === "sync") {
    return (
      <Card>
        <h1 className="text-2xl font-semibold">Sync</h1>
        <p className="text-sm">{useEkas.getState().syncNote}</p>
        <Btn data-guide-action="sync-run" onClick={async()=>{try{if(!useEkas.setState({syncNote:"Completed locally. No external job."}))throw Error("Local sync note could not be saved.");await useEkas.persist.flush();useEkas.getState().log("Sync");}catch(error){toast(error instanceof Error?error.message:"Local sync note failed; no external job.")}}}>Run sync</Btn>
      </Card>
    );
  }
  if (screen === "memory") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Memory sources</h1>
        {memory.map((m) => (
          <Card key={m}><div className="flex justify-between gap-2"><span>{m}</span><Btn onClick={() => useEkas.setState({ memory: memory.filter((x) => x !== m) })}>Remove</Btn></div></Card>
        ))}
        <div className="flex gap-2">
          <input value={phrase} onChange={(e) => setPhrase(e.target.value)} className="min-h-11 flex-1 rounded-lg border border-line bg-surface px-3" />
          <Btn tone="solid" onClick={async() => { const value=phrase.trim(); const current=useEkas.getState().memory; if (!value || value.length>2000 || current.length>=100 || current.includes(value)) return; useEkas.setState({ memory: [...current, value] }); if (!useEkas.getState().memory.includes(value)) return; useEkas.getState().log("Added local memory phrase"); try{await useEkas.persist.flush();setPhrase("")}catch(error){toast(error instanceof Error?error.message:"Local memory save failed; draft retained.")} }}>Add</Btn>
        </div>
      </div>
    );
  }
  if (screen === "catalog") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <input data-guide-action="definition-find" value={objectSearch} onChange={(e) => withGuideInspection("definition-searched",()=>{const matches=COLUMNS.filter(c=>columnMatchesSearch(c,e.target.value));return matches.length?{text:e.target.value,definitions:matches.map(c=>({id:c.id,name:c.name,description:c.description,unit:c.unit||"not numeric",aggregation:c.agg||"dimension"}))}:null},()=>useEkas.setState({objectSearch:e.target.value}))} placeholder="Search definitions" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
        {!COLUMNS.some(c=>columnMatchesSearch(c,objectSearch))&&<p role="status">No matching definitions. Clear or change the search.</p>}{COLUMNS.filter((c) => columnMatchesSearch(c,objectSearch)).map((c) => (
          <Card key={c.id}><div className="font-semibold">{c.name}</div><p className="text-sm">{c.description}</p></Card>
        ))}
      </div>
    );
  }
  if (screen === "usage") {
    const audit = useEkas.getState().audit;
    return (
      <Card>
        <h1 className="text-2xl font-semibold">Usage</h1>
        <details><summary data-guide-action="usage-inspect">Local audit window and usage limits</summary><p className="text-sm">{audit.length} retained local events, limited to 80. This is not OpenAI token usage, provider requests, charges, an account billing total or a successful-result count.</p></details>
        <ul className="mt-2 text-sm">{audit.slice(0, 12).map((a) => <li key={a.id}>{a.at} — {a.what}</li>)}</ul>
      </Card>
    );
  }
  if (screen === "dbt") {
    return (
      <Card>
        <h1 className="text-2xl font-semibold">Definition sync</h1>
        <p className="text-sm">Last sync: {syncAt} · Applied alias revision {aliasRevision}</p>
        <p>Reconciles current exact column aliases into the local query compiler. Metric formulas/units and production definitions remain immutable.</p>
        <Btn onClick={()=>{try{const before=useEkas.getState().aliasRevision;saveAliases(structuredClone(useEkas.getState().synonyms));if(useEkas.getState().aliasRevision===before+1){const at=new Date().toISOString();if(useEkas.setState({dbtAt:at}))useEkas.getState().log("Local alias sync revision "+(before+1)+" at "+at)}}catch(error){toast(error instanceof Error?error.message:"Definition sync refused")}}}>Record sync</Btn>
      </Card>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Verification</h1>
      {useEkas.getState().boards.map((b) => (
        <Card key={b.id}>
          <div className="font-semibold">{b.name}</div>
          <Btn onClick={async()=>{try{await inspectBoard(b,ctxOf())}catch(error){toast(error instanceof Error?error.message:"Review failed")}}}>Inspect exact board</Btn>
          {reviews.filter(r=>r.boardId===b.id).map(review=><details key={review.id}><summary>Captured {review.capturedAt} · {review.reviewer} · {review.boardSignature===JSON.stringify(b)?"Matching current board":"Historical: board changed"}</summary><p>Not certified. No production approval or intervention.</p>{review.tiles.map(tile=><p key={tile.id}>{tile.id}: {tile.eligibility} · {tile.resultId} · {tile.evidenceIds.length} source anchors · {tile.note}</p>)}</details>)}
          <Btn onClick={() => useEkas.setState((s) => ({ boards: s.boards.map((x) => (x.id === b.id ? { ...x, verified: !x.verified } : x)) }))}>{b.verified ? "Locally reviewed" : "Needs a person"}</Btn>
        </Card>
      ))}
    </div>
  );
}

function Studio() {
  const sql = useEkas((s) => s.studioSql);
  const current={rls:useEkas(s=>s.rls),site:useEkas(s=>s.siteScope),maskDowntime:useEkas(s=>s.maskDowntime)};
  const [msg,setMsg]=useState("Run the bounded governed SELECT against the supplied synthetic model.");
  const [capture,setCapture]=useState<Capture|null>(null);
  const visible=capture?eligibleCapture(capture,current):null;
  return <div className="flex flex-col gap-3"><h1 className="text-2xl font-semibold">Studio</h1>
    <label>Governed SQL draft<textarea aria-label="Governed SQL draft" value={sql} onChange={e=>useEkas.setState({studioSql:e.target.value})} className="min-h-32 w-full rounded-lg border border-line bg-surface p-3 font-mono text-sm"/></label>
    <p>SQL draft persists locally. Results are an execution snapshot for this visit; reload requires Run governed.</p>
    <Btn data-guide-action="studio-run" tone="solid" onClick={()=>{try{const governed=compileStudio(sql),context=structuredClone(current),rows=runQuery(governed,context);setCapture({query:structuredClone(governed),context,rows:structuredClone(rows),capturedAt:new Date().toISOString(),resultId:resultIdentity.get(rows)||null,metadata:resultMeta.get(rows)});useEkas.getState().setQuery(governed);setMsg("Executed the supported governed SELECT against local source rows.");useEkas.getState().log("Studio run")}catch(error){setCapture(null);setMsg(error instanceof Error?error.message:"Refused query; no state changed.")}}}>Run governed</Btn>
    <p role="status">{msg}</p>
    <details><summary>Supported query grammar</summary><p>Exact dimensions, SUM(good_units/downtime_min/labor_hours), METRIC(oee/scrap_rate/first_pass_yield/schedule_attainment/energy_intensity), exact WHERE equality joined by AND, and matching GROUP BY. No unrestricted SQL or external execution.</p></details>
    {capture&&visible&&<><p>Captured {capture.capturedAt} · cutoff {capture.query.asOf} · synthetic · {visible.reason}</p>{!visible.allowed?<p role="status">Captured result and source proof withheld under current local controls. Run governed explicitly for a new permitted result.</p>:<>
      {capture.metadata?.truncated&&<p role="status">Returned {capture.metadata.returned} of {capture.metadata.total} groups. Source proof covers returned groups only.</p>}
      {visible.rows.length===0&&<p role="status">No observations match this exact cohort. Values remain unavailable; an empty result is not zero production.</p>}
      <div style={{maxWidth:'100%',overflowX:'auto'}}><table aria-label="Governed Studio result"><thead><tr><th>Exact group</th>{activeMeasures(capture.query).map(m=><th key={m}>{columnById(m)?.name} ({columnById(m)?.unit})</th>)}</tr></thead><tbody>{visible.rows.map(row=><tr key={row.key}><td>{row.key}</td>{activeMeasures(capture.query).map(m=><td key={m}>{formatValue(m,row.values[m],capture.query.decimals,visible.maskDowntime)}</td>)}</tr>)}</tbody></table></div>
      <ResultEvidence label="Governed result evidence" query={capture.query} context={capture.context} rows={visible.rows}/>
    </>}</>}
  </div>;
}

function Develop() {
  const screen = useEkas((s) => s.screen);
  const query = useEkas((s) => s.query);
  const rows = useRows(query);
  const name = useEkas((s) => s.displayName);
  const compact = useEkas((s) => s.compact);
  const links = useEkas((s) => s.links);
  const webhooks = useEkas((s) => s.webhooks);
  const webhookEvents=useEkas(s=>s.webhookEvents);
  const actions = useEkas((s) => s.actions);
  const actionRequests=useEkas(s=>s.actionRequests);
  const rls = useEkas((s) => s.rls);
  const maskDowntime = useEkas((s) => s.maskDowntime);
  const [copyStatus,setCopyStatus]=useState("");
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState("");
  const payload = {
    sql: sqlOf(query, ctxOf()),
    resultId:resultIdentity.get(rows),total:rows.length,returned:rows.length,truncated:false,rows: rows.map((r) => ({ key: r.key, values: Object.fromEntries(Object.entries(r.values).map(([k,v])=>[k,Number.isFinite(v)?v:null])),eligibility:r.eligibility,evidence:r.evidence })),
    definition: "definition1 · synthetic",
    uncertainty: "Demonstrated sample. Cause is not established.",
  };
  const embedPayload={schemaVersion:'ekas-local-embed-snapshot@1.0.0',model:'manufacturing_shift_model',fixture:providerFixture(query.provider),definition:1,presentationOnly:true,query:structuredClone(query),context:ctxOf(),enforcedSite:rls?useEkas.getState().siteScope:null,metrics:activeMeasures(query).map(id=>({id,name:columnById(id)?.name??id,unit:columnById(id)?.unit??'Unavailable',valueRepresentation:columnById(id)?.unit==='%'?'fraction; display multiplied by100':'raw declared unit'})),result:payload};
  const embedText=JSON.stringify(embedPayload,null,2);
  const currentEmbedText=useRef(embedText);currentEmbedText.current=embedText;
  if (screen === "devhome") return <DeveloperHome/>;
  if (screen === "playground") return <EmbedPlayground/>;
  if (screen === "embed") {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Embed</h1>
        <p>Exact local query snapshot · cutoff {query.asOf??'not captured'} · {activeMeasures(query).map(id=>columnById(id)?.name??id).join(', ')||'No selected metrics'}. Proposed local embed format; no production access grant.</p>
        <pre aria-label="Exact embed payload" className="overflow-x-auto rounded-lg bg-surface p-3 font-mono text-sm">{embedText}</pre>
        <Btn onClick={async()=>{setCopyStatus('');const capturedText=embedText;try{const current=await copyGuidePayload('embed-copied',capturedText,()=>currentEmbedText.current===capturedText);if(!current){setCopyStatus('Copied the earlier payload; current context changed. No current Guide observation recorded.');return}setCopyStatus('Copied exact embed payload containing '+activeMeasures(query).map(id=>columnById(id)?.name??id).join(', ')+' for cutoff '+(query.asOf??'not captured'));}catch{setCopyStatus('Copy failed. Select the exact payload above and copy it manually.');}}}>Copy exact embed payload</Btn>{copyStatus&&<p role="status">{copyStatus}</p>}
        {activeMeasures(query).map(metric=><Card key={metric}><h2>{columnById(metric)?.name??metric} ({columnById(metric)?.unit??'Unavailable'})</h2><Viz rows={rows} query={{ ...query,columns:[...activeGroup(query),metric],chart:"headline" }} maskDowntime={maskDowntime} onPoint={()=>{}}/></Card>)}
        <div className="flex gap-2">
          <Btn onClick={() => useEkas.getState().go("apiguide")}>API guide</Btn>
          <Btn onClick={() => useEkas.getState().go("apiplay")}>API playground</Btn>
        </div>
      </div>
    );
  }
  if(screen==="apiplay")return <ApiPlayground/>;
  if (screen === "apiguide") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Query contract</h1>
        <p className="text-sm">Proposed local query extension; current versioned query, rows, definition and uncertainty are retained. No external HTTP request or verified authentication.</p>
        <pre className="overflow-x-auto rounded-lg bg-surface p-3 font-mono text-sm">{JSON.stringify(payload, null, 2)}</pre>
      </div>
    );
  }
  if (screen === "theme" || screen === "styles") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Theme</h1>
        <label className="text-sm">Display name
          <input value={name} onChange={(e) => saveLocalPreference("displayName",e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3" />
        </label>
        <Btn data-guide-action="theme-density" onClick={() => saveLocalPreference("compact",!compact)}>Density {compact ? "compact" : "comfortable"}</Btn>
        <p className="text-sm text-muted">Dark theme only. Theme edits the display name and compact density. The palette does not change.</p>
      </div>
    );
  }
  if (screen === "actions") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Actions</h1>
        {actions.map((a) => (
          <Card key={a.id}>
            <div className="font-semibold">{a.name}</div>
            <p className="text-sm">Requires a person. Nothing is sent to the line.</p>
            <Btn tone="solid" onClick={()=>{try{requestLocalAction(a)}catch(error){toast(error instanceof Error?error.message:"Request failed")}}}>Request authorization</Btn>
            {actionRequests.filter(r=>r.actionId===a.id).map(r=><Card key={r.id}><p>{r.name} · Owner: {r.owner} · {r.stage} · Requested {r.requestedAt} · Captured {r.resultId}</p><p>{JSON.stringify(r.query.filters)} · Cutoff {r.query.asOf}</p>{r.stage==="authorized"&&<Btn onClick={()=>{try{performLocalAction(r.id)}catch(error){toast(error instanceof Error?error.message:"Simulation refused")}}}>Perform local simulation</Btn>}{r.artifact&&<p>{r.artifact.createdAt} · {r.artifact.statement}</p>}</Card>)}
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">{screen === "links" ? "Links" : screen === "webhooks" ? "Webhooks" : "Security"}</h1>
      <Card>
        <div className="font-semibold">Row rule</div>
        <Btn onClick={() => useEkas.setState((s) => ({ rls: !s.rls }))}>Enforcement {rls ? "on" : "off"}</Btn>
        <div className="mt-2 font-semibold">Mask Downtime for viewers</div>
        <Btn onClick={() => useEkas.setState((s) => ({ maskDowntime: !s.maskDowntime }))}>{maskDowntime ? "Masked" : "Visible"}</Btn>
      </Card>
      <Card>
        <div className="font-semibold">Allowed domains</div>
        <ul className="text-sm">{links.map((l) => <li key={l}>{l}</li>)}</ul>
        <div className="mt-2 flex gap-2">
          <input value={domain} onChange={(e) => setDomain(e.target.value)} className="min-h-11 flex-1 rounded-lg border border-line bg-bg px-3" />
          <Btn onClick={()=>{try{addAllowedDomain(domain);setDomain("")}catch(error){toast(error instanceof Error?error.message:"Domain refused")}}}>Add</Btn>
        </div>
      </Card>
      <Card>
        <div className="font-semibold">Webhooks</div>
        <p className="text-sm text-muted">Logged locally. This shell does not call the URL.</p>
        {webhooks.map((w) => <div key={w.id} className="text-sm">{w.url}</div>)}
        {webhookEvents.map(event=><details key={event.id}><summary>{event.capturedAt} · {event.status} · {event.target}</summary><pre>{JSON.stringify(event.payload,null,2)}</pre></details>)}
        <div className="mt-2 flex gap-2">
          <input aria-label="Webhook URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/hook" className="min-h-11 flex-1 rounded-lg border border-line bg-bg px-3" />
          <Btn onClick={()=>{try{const event=testLocalWebhook(url);useEkas.getState().log("Simulated webhook event "+event.id);setUrl("")}catch(error){toast(error instanceof Error?error.message:"Test refused")}}}>Test log</Btn>
        </div>
      </Card>
    </div>
  );
}

function Admin() {
  const screen = useEkas((s) => s.screen);
  const users = useEkas((s) => s.users);
  const userSearch = useEkas((s) => s.userSearch);
  const sortUsers = useEkas((s) => s.sortUsers);
  const groups = useEkas((s) => s.groups);
  const welcome = useEkas((s) => s.welcome);
  const onboarding = useEkas((s) => s.onboarding);
  const maintenance = useEkas((s) => s.maintenance);
  const audit = useEkas((s) => s.audit);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userError,setUserError]=useState("");
  const [groupFilter, setGroupFilter] = useState("All");
  const [selectedUsers,setSelectedUsers]=useState<string[]>([]);
  const shown = users
    .filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    .filter((u) => groupFilter === "All" || u.groups.includes(groupFilter))
    .sort((a, b) => (sortUsers === "name" ? a.name.localeCompare(b.name) : (a.createdAt||"2026-07-01").localeCompare(b.createdAt||"2026-07-01")));
  if (screen === "users") {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Users</h1><p role="status">{selectedUsers.length} simulated users selected. No real account grant or invitation.</p><Btn onClick={()=>download("selected-simulated-users.json",JSON.stringify(users.filter(u=>selectedUsers.includes(u.id)),null,2),"application/json")}>Export selected simulated users</Btn>
        <div className="flex flex-wrap gap-2">
          <input value={userSearch} onChange={(e) => useEkas.setState({ userSearch: e.target.value })} placeholder="Search" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
          <Btn onClick={() => setGroupFilter(groupFilter === "All" ? "Leadership" : "All")}>Filter {groupFilter}</Btn>
          <Btn onClick={() => useEkas.setState({ sortUsers: sortUsers === "name" ? "created" : "name" })}>Sort {sortUsers}</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted"><th></th><th>Name</th><th>Groups</th><th>Status</th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td><input className="retained-touch-checkbox" type="checkbox" aria-label={u.name} checked={selectedUsers.includes(u.id)} onChange={()=>setSelectedUsers(v=>v.includes(u.id)?v.filter(id=>id!==u.id):[...v,u.id])} /></td>
                  <td>{u.name}<div className="text-muted">{u.email}</div></td>
                  <td>{u.groups.join(", ")}</td>
                  <td>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="min-h-11 rounded-lg border border-line bg-surface px-3" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Simulated user email" className="min-h-11 rounded-lg border border-line bg-surface px-3" />{userError&&<p role="alert">{userError}</p>}
          <Btn
            tone="solid"
            onClick={async() => {
              if(!name.trim()){setUserError("Enter a user name and a valid email.");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setUserError("Enter a valid email address.");return}if(useEkas.getState().users.some(u=>u.email.trim().toLowerCase()===email.trim().toLowerCase())){setUserError("A simulated user with this email already exists.");return}setUserError("");
              const id=crypto.randomUUID();if(!useEkas.setState((s) => ({ users: [...s.users, { id, name: name.trim(), email: email.trim(), createdAt:new Date().toISOString(),groups: ["Viewers"], status: "Invited" }],groups:s.groups.map(g=>g.name==="Viewers"?{...g,members:g.members+1}:g) })))return;useEkas.getState().log("Recorded local user "+id);
              try{await useEkas.persist.flush();setName("");setEmail("");toast("Simulated invitation recorded; no email sent")}catch(error){setUserError(error instanceof Error?error.message:"Local user save failed; draft retained.")}
            }}
          >
            Add user
          </Btn>
        </div>
      </div>
    );
  }
  if (screen === "groups") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Groups</h1><details><summary data-guide-action="groups-inspect">Local group membership scope</summary><p>Administrator, Leadership and Viewers are local presentation groups. Counts are not authenticated production grants. Use the separate Users invite controls to record a synthetic membership; this panel cannot grant backend access.</p></details>
        {groups.map((g) => <Card key={g.name}><div className="font-semibold">{g.name}</div><div className="text-sm text-muted">{g.members} members</div></Card>)}
        <section data-fixture-id={emptyGroupFixture.id} className="rounded-xl border border-line p-4"><h2 className="font-semibold">{emptyGroupFixture.name}</h2><p>Synthetic zero-member group fixture · version {emptyGroupFixture.version}</p><p>{emptyGroupFixture.members} members</p><p role="status">No members in this training example. Existing group counts above come from the simulated workspace; no membership action is available here.</p><p className="text-sm text-muted">{emptyGroupFixture.authority}</p></section>
      </div>
    );
  }
  if (screen === "customization" || screen === "onboarding") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <textarea aria-label="Welcome message" data-guide-action="onboarding-welcome" value={welcome} onChange={(e) => saveLocalPreference("welcome",e.target.value)} className="min-h-20 rounded-lg border border-line bg-surface p-3" />
        {Object.entries(onboarding).map(([k, v]) => (
          <label key={k} className="retained-touch-label flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={() => saveLocalPreference("onboarding",{...onboarding,[k]:!v})} />{k}</label>
        ))}
      </div>
    );
  }
  if (screen === "pricing" || screen === "datausage") {
    const windowBounds=retainedAuditWindow(audit);
    const queries = audit.filter(a => a.what === "Search go" || a.what === "Studio run");
    return <Card>
      <h1 className="text-2xl font-semibold">{screen === "pricing" ? "Plan" : "Data usage"}</h1>
      <p>Trial shell. Seats in this demo: {users.length}. Queries logged: {queries.length}.</p>
      <p>Counts cover the retained local audit window, up to 80 events, across reloads. Search submissions and successful governed Studio runs count as queries; other events do not. These are submission counts, not provider requests or successful result counts.</p>
      {screen === "pricing" ? <Btn data-guide-action="trial-usage" onClick={()=>withGuideInspection("usage-inspected",()=>{const s=useEkas.getState(),queries=s.audit.filter(a=>a.what==="Search go"||a.what==="Studio run");return {seats:s.users.length,querySubmissions:queries.length,otherEvents:s.audit.length-queries.length,totalEvents:s.audit.length,window:s.audit.map(a=>a.at),limits:"Retained80 synthetic events; no tokens/bytes/charges or lifetime metering."}},()=>useEkas.getState().go("datausage"))}>View data usage</Btn> : <>
        <p>Query submissions: {queries.length}. Other audit events: {audit.length-queries.length}. Total retained events: {audit.length}.</p>
        <p>Bytes, tokens, provider charges and lifetime usage are not measured by this synthetic shell.</p>
        <p>Window: {windowBounds.start ? windowBounds.start+" to "+windowBounds.end : audit.length?"Retained event timestamps unavailable":"No retained events"}. UTC unless an explicit offset is shown; recorded precision retained.{windowBounds.unavailable>0&&<> {windowBounds.unavailable} retained event timestamp(s) unavailable; range covers timestamped events only.</>}</p>
        <div style={{overflowX:"auto"}}><table><thead><tr><th>Time</th><th>Classification</th><th>Activity</th></tr></thead><tbody>{audit.map(a=><tr key={a.id}><td>{a.at}</td><td>{a.what === "Search go" || a.what === "Studio run" ? "Query submission" : "Other audit event"}</td><td>{a.what}</td></tr>)}</tbody></table></div>
      </>}
    </Card>;
  }
  if(screen === "contact")return <ExpertNote/>;
  if (screen === "getstarted") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Get started</h1>
        <Btn onClick={() => useEkas.getState().go("search")}>Make an answer</Btn>
        <Btn onClick={() => useEkas.getState().go("boards")}>Open a board</Btn>
        <Btn onClick={() => useEkas.getState().go("monitors")}>Check monitors</Btn>
      </div>
    );
  }
  if (screen === "terms") return <Card><h1 className="text-2xl font-semibold">Terms</h1><p>Supplied demo operating conditions</p><ul><li>Sample figures are demonstrated.</li><li>A gap is not a cause.</li><li>A person authorizes any line action.</li><li>This shell does not dispatch one.</li></ul></Card>;
  return <MaintenanceNote key={screen} saved={maintenance}/>;
}

function MaintenanceNote({saved}:{saved:string}) {
  const [draft,setDraft]=useState(saved);
  const [status,setStatus]=useState("");
  return <Card><h1 className="text-2xl font-semibold">Maintenance</h1><p>Optional local simulation freeze-window note. Saving an empty or blank note clears this local note. Nothing is actually frozen.</p>
    <label>Freeze-window sentence<textarea aria-label="Freeze-window sentence" value={draft} onChange={e=>{setDraft(e.target.value);setStatus("")}} className="min-h-20 w-full rounded-lg border border-line bg-surface p-3"/></label>
    <Btn data-guide-action="maintenance-save" onClick={async()=>{setStatus("Saving local note…");try{const value=draft.trim()?draft:"";if(!useEkas.setState({maintenance:value}))throw new Error("Local note save refused.");await useEkas.persist.flush();useEkas.getState().log("Saved local maintenance note");setDraft(value);setStatus(value?"Saved locally; available after reload. No operational freeze.":"Cleared local note; available after reload. No operational freeze.")}catch(error){setStatus(error instanceof Error?error.message:"Local save failed; draft retained.")}}}>Save note</Btn>
    <Btn onClick={()=>{setDraft(saved);setStatus("Draft cancelled; saved note unchanged.")}}>Cancel</Btn>
    {status&&<p role="status">{status}</p>}
  </Card>;
}

export function Overlays({guidePage,guideNavigate,onWorkspaceNavigate}:{guidePage?:import('./store').Screen;guideNavigate?:(page:import('./store').Screen)=>void;onWorkspaceNavigate?:(page:import('./store').Screen)=>void}={}) {
  const shareOpen = useEkas((s) => s.shareOpen);
  const formulaOpen = useEkas((s) => s.formulaOpen);
  const setOpen = useEkas((s) => s.setOpen);
  const paramOpen = useEkas((s) => s.paramOpen);
  const pending = useEkas((s) => s.pendingAuth);
  const help = useEkas((s) => s.help);
  const profile = useEkas((s) => s.profile);
  const palette = useEkas((s) => s.palette);
  const createOpen = useEkas((s) => s.createOpen);
  const notifOpen = useEkas((s) => s.notifOpen);
  const monitors = useEkas((s) => s.monitors);
  const [fxName,setFxName]=useState("Good units ratio");const [fxLeft,setFxLeft]=useState("goodUnits"),[fxRight,setFxRight]=useState("goodUnits"),[fxOp,setFxOp]=useState<"-"|"/">("/"),[fxError,setFxError]=useState("");
  const [setName, setSetName] = useState("Focus sites");const [setCol,setSetCol]=useState("site"),[setValues,setSetValues]=useState<string[]>(["TP-S1","TP-S2"]);
  const [paramName, setParamName] = useState("Site scope");const [paramError,setParamError]=useState("");
  const [paletteQ, setPaletteQ] = useState("");
  const shares=useEkas(s=>s.sharedViews);
  const currentCaptureContext={rls:useEkas(s=>s.rls),site:useEkas(s=>s.siteScope),maskDowntime:useEkas(s=>s.maskDowntime)};
  const [openedCapture,setOpenedCapture]=useState<string|null>(null);
  const captureShare=(permission:"view"|"edit")=>{const state=useEkas.getState(),query=structuredClone(state.query),context=ctxOf(),rows=runQuery(query,context,state.formulas.find(f=>f.id===query.formulaId)),id=crypto.randomUUID();useEkas.setState({sharedViews:[...state.sharedViews,{id,permission,query,context,capturedAt:new Date().toISOString(),resultId:resultIdentity.get(rows)||null,rows:structuredClone(rows),synthetic:true,notGranted:true}]});if(useEkas.getState().sharedViews.some(s=>s.id===id))state.log("Captured local "+permission+" share "+id)};
  return (
    <>
      {shareOpen && (
        <Dialog title="Share" onClose={() => useEkas.setState({ shareOpen: false })}>
          <p>Local captured views. No external account access is granted. View preserves its capture; Edit opens a local working copy.</p>
          <Btn onClick={()=>captureShare("view")}>View</Btn><Btn onClick={()=>captureShare("edit")}>Edit</Btn>
          {shares.map(share=>{const permitted=eligibleCapture(share,currentCaptureContext);return <Card key={share.id}><p>{share.query.title} · {share.permission} · Captured {share.capturedAt} · Cutoff {share.query.asOf} · {share.resultId} · Captured site {share.context.site} · Scope {share.context.rls?"site restricted":"all permitted demo sites"}</p><p role="status">{permitted.reason}</p>{permitted.allowed&&<Viz rows={permitted.rows} query={share.query} maskDowntime={permitted.maskDowntime} readOnly={share.permission==="view"} onPoint={()=>{}}/>}<Btn onClick={()=>{if(share.permission==="view"){setOpenedCapture(share.id)}else{useEkas.getState().startNewAnswer(share.query);useEkas.getState().go("search")}}}>{share.permission==="view"?"Open captured view":"Edit local copy with current controls"}</Btn>{openedCapture===share.id&&<section aria-label="Read-only captured result"><h3>Read-only captured result</h3><p>{permitted.reason} Captured query, site, result identity and timestamp remain unchanged.</p>{permitted.allowed&&<Viz rows={permitted.rows} query={share.query} maskDowntime={permitted.maskDowntime} readOnly={share.permission==="view"} onPoint={()=>{}}/>}</section>}<button disabled={!permitted.allowed} onClick={()=>{if(!eligibleCapture(share,ctxOf()).allowed)return;download("captured-view-"+share.id+".json",JSON.stringify(share,null,2),"application/json")}}>Export captured view</button></Card>})}
        </Dialog>
      )}
      {formulaOpen && (
        <Dialog title="Formula" onClose={() => useEkas.setState({ formulaOpen: false })}>
          <p>One custom formula per query. Saving replaces the previous custom formula; built-in measures and grouping stay selected.</p>
          <input value={fxName} onChange={(e) => setFxName(e.target.value)} className="min-h-11 w-full rounded-lg border border-line bg-bg px-3" />
          <label>Left measure<select value={fxLeft} onChange={e=>setFxLeft(e.target.value)}>{COLUMNS.filter(c=>c.kind==='measure').map(c=><option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}</select></label><label>Operator<select value={fxOp} onChange={e=>setFxOp(e.target.value as '-'|'/')}><option value="/">Divide</option><option value="-">Subtract</option></select></label><label>Right measure<select value={fxRight} onChange={e=>setFxRight(e.target.value)}>{COLUMNS.filter(c=>c.kind==='measure').map(c=><option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}</select></label><p role="status">{fxError}</p>
          <Btn tone="solid" onClick={() => {
            if(!fxName.trim()){setFxError('A formula name is required.');return}if(fxOp==='-'&&columnById(fxLeft)?.unit!==columnById(fxRight)?.unit){setFxError('Subtraction requires the same units. Choose compatible measures.');return}
            const id = `fx:${crypto.randomUUID()}`;
            withQueryGuideAction('formula-saved',()=>{if(!useEkas.setState((s) => ({ formulas: [...s.formulas, { id, name: fxName, left: fxLeft as any, op: fxOp, right: fxRight as any }], formulaOpen: false })))return;const saved=useEkas.getState().formulas.find(f=>f.id===id);if(saved)useEkas.getState().setQuery(selectFormulaQuery(useEkas.getState().query,saved));});
            useEkas.getState().log("Created local formula");
          }}>Save formula</Btn>
        </Dialog>
      )}
      {setOpen && (
        <Dialog title="Set" onClose={() => useEkas.setState({ setOpen: false })}>
          <input value={setName} onChange={(e) => setSetName(e.target.value)} className="min-h-11 w-full rounded-lg border border-line bg-bg px-3" />
          <label>Set dimension<select aria-label="Set dimension" value={setCol} onChange={e=>{setSetCol(e.target.value);setSetValues([])}}>{COLUMNS.filter(c=>c.kind!=="measure").map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><fieldset><legend>Set values</legend>{valuesFor(setCol).map(v=><label className="retained-touch-label" key={v}><input type="checkbox" checked={setValues.includes(v)} onChange={()=>setSetValues(xs=>xs.includes(v)?xs.filter(x=>x!==v):[...xs,v])}/>{v}</label>)}</fieldset><Btn tone="solid" onClick={()=>{if(!setName.trim()||!setValues.length||setValues.some(v=>!valuesFor(setCol).includes(v))){toast("Choose a name and valid exact source values.");return}useEkas.setState(s=>({sets:[...s.sets,{id:crypto.randomUUID(),name:setName.trim(),col:setCol,values:[...setValues],yours:true}],setOpen:false}));useEkas.getState().log("Created local value set")}}>Save value set</Btn>
        </Dialog>
      )}
      {paramOpen && (
        <Dialog title="Parameter" onClose={() => useEkas.setState({ paramOpen: false })}>
          <label>Parameter name<input aria-label="Parameter name" aria-invalid={!!paramError} aria-describedby={paramError?"parameter-name-error":undefined} value={paramName} onChange={(e) => {setParamName(e.target.value);setParamError("")}} className="min-h-11 w-full rounded-lg border border-line bg-bg px-3" /></label>
          {paramError&&<p id="parameter-name-error" role="alert">{paramError}</p>}
          <Btn tone="solid" onClick={() => {
            const name=paramName.trim();if(!name){setParamError("Parameter name is required.");return}
            useEkas.setState(s=>{const query={...s.query,filters:[...s.query.filters.filter(f=>!(f.col==="site"&&f.op==="in")),{col:"site",op:"in" as const,values:["TP-S1"]}]},receipt=createQueryGuideAction("parameter-applied",s,{...s,query});return {queryGuideActions:[...(s.queryGuideActions||[]),receipt].slice(-40),params:[...s.params,{id:crypto.randomUUID(),name,col:"site",value:"TP-S1",applied:true,previousFilters:structuredClone(s.query.filters.filter(f=>f.col==="site"))}],paramOpen:false,query,past:[...s.past,{query:s.query,selectedPoint:s.selectedPoint?structuredClone(s.selectedPoint):undefined,underlying:s.underlying}].slice(-30),future:[],selectedPoint:undefined,underlying:false,audit:[{id:crypto.randomUUID(),at:new Date().toISOString(),what:"Filter in site"},...s.audit].slice(0,80)}});
            useEkas.getState().log("Applied local parameter");
          }}>Apply TP-S1</Btn>
        </Dialog>
      )}
      {pending && (
        <Dialog title="Authorization" onClose={() => useEkas.setState({ pendingAuth: undefined })}>
          <p className="text-sm">{pending} would leave this shell. Confirming records a person. No machine action is sent.</p>
          <Btn tone="solid" onClick={()=>{try{authorizeLocalAction();toast("Local authorization saved; no intervention performed.")}catch(error){toast(error instanceof Error?error.message:"Authorization refused")}}}>Authorize</Btn>
        </Dialog>
      )}
      {help && <ContextualGuide currentPage={guidePage} onNavigate={guideNavigate}/>}
      {profile && (
        <Dialog title="Profile" onClose={() => useEkas.setState({ profile: false })}>
          <p className="text-sm">Plant lead · site scope {useEkas.getState().siteScope}</p>
          <Btn onClick={() => { useEkas.getState().go("users"); useEkas.setState({ profile: false }); }}>Invite teammate</Btn>
          <Btn onClick={()=>{useEkas.setState({profile:false,conversationId:undefined,askText:"",screen:"home"});useEkas.getState().log("Ended local presentation conversation; no account authentication exists");toast("Local conversation ended. Saved evidence remains available.")}}>End local session</Btn>
        </Dialog>
      )}
      {createOpen && (
        <Dialog title="Create" onClose={() => useEkas.setState({ createOpen: false })}>
          <Btn onClick={() => { useEkas.getState().startNewAnswer(); useEkas.getState().go("search"); }}>Answer</Btn>
          <Btn onClick={() => useEkas.getState().go("boards")}>Board</Btn>
          <Btn onClick={() => useEkas.getState().go("collections")}>Collection</Btn>
          <Btn onClick={() => useEkas.getState().go("monitors")}>Monitor</Btn>
        </Dialog>
      )}
      {notifOpen && (
        <Dialog title="Notifications" onClose={() => useEkas.setState({ notifOpen: false })}>
          {monitors.filter((m) => !m.muted&&evaluatedMonitor(m,ctxOf()).status==='Open').map((m) => <p key={m.id} className="text-sm">{m.name} · {m.channel}</p>)}
          <Btn onClick={() => {useEkas.setState({notifOpen:false});if(onWorkspaceNavigate)onWorkspaceNavigate("monitors");else useEkas.getState().go("monitors")}}>Open monitors</Btn>
        </Dialog>
      )}
      {palette && (
        <Dialog title="Jump" onClose={() => useEkas.setState({ palette: false })}>
          <input value={paletteQ} onChange={(e) => setPaletteQ(e.target.value)} placeholder="Workflow or screen" className="min-h-11 w-full rounded-lg border border-line bg-bg px-3" />
          <div className="mt-2 max-h-64 overflow-auto">
            {WORKFLOWS.filter((w) => (w.name+" "+w.screen+" "+w.area).toLowerCase().includes(paletteQ.toLowerCase())).slice(0, 8).map((w) => (
              <button key={w.name} className="block w-full py-2 text-left text-sm" onClick={() => {if(w.area==="Global"&&w.name==="Profile"){flushSync(()=>useEkas.setState({palette:false}));useEkas.setState({profile:true});emitGuideUiObservation('ui-profile-opened');}else useEkas.getState().go(w.screen)}}>{w.area} · {w.name}</button>
            ))}
          </div>
        </Dialog>
      )}
    </>
  );
}

