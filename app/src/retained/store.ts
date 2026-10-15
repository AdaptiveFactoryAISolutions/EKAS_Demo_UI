import {localGuideScope,localGuideEntity,localGuideCutoff} from './localGuideContext';
import type {NorthworksGuideProjection} from '../northworksGuide';
import type {QaDefinition} from './qaDefinition';
import type {EmbedPreset} from './embedPreset';
import {selectedProvider,contextEnvelope,acceptanceSets} from '../platform/fixtureSelection';
import type {BoardScheduleTarget,BoardScheduleRun} from './boardSchedule';
import {selectedScopeFilters,selectedDimensions} from './selectedScope';
import { create } from "./stateClient";
import { persist, createJSONStorage } from "./stateClient";
import {
  emptyQuery,
  selectFormulaQuery,
  type ChartKind,
  type Formula,
  type Param,
  type Query,
  type ValueSet,
  type Bucket,
  type Filter,
} from "./model";

export type Screen =
  | "canonicalmetrics"
  | "metriclab"
  | "home"
  | "ask"
  | "search"
  | "boards"
  | "board"
  | "answers"
  | "collections"
  | "schedules"
  | "monitors"
  | "patterns"
  | "objects"
  | "connections"
  | "studio"
  | "utilities"
  | "sync"
  | "memory"
  | "catalog"
  | "usage"
  | "dbt"
  | "verify"
  | "devhome"
  | "embed"
  | "playground"
  | "apiguide"
  | "apiplay"
  | "theme"
  | "actions"
  | "styles"
  | "links"
  | "security"
  | "webhooks"
  | "users"
  | "groups"
  | "customization"
  | "onboarding"
  | "pricing"
  | "datausage"
  | "contact"
  | "getstarted"
  | "maintenance"
  | "terms"
  | "inspection";

export type Area = "insights" | "data" | "develop" | "admin";

export function areaOf(s: Screen): Area {
  if (["objects", "connections", "studio", "utilities", "sync", "memory", "catalog", "usage", "dbt", "verify"].includes(s)) return "data";
  if (["devhome", "embed", "playground", "apiguide", "apiplay", "theme", "actions", "styles", "links", "security", "webhooks"].includes(s)) return "develop";
  if (["users", "groups", "customization", "onboarding", "pricing", "datausage", "contact", "getstarted", "maintenance", "terms"].includes(s)) return "admin";
  return "insights";
}

type PointSelection={col:string;value:string;dimensions?:Record<string,string>};
type QueryViewHistory={query:Query;selectedPoint?:PointSelection;underlying:boolean};
export type Answer = { evidenceCaptureId?:string;canonicalResultId?:string;id: string; query: Query; updated: string };
export type Tile = { evidenceCaptureId?:string;canonicalResultId?:string;id: string; title: string; query: Query; tab: string };
export type Board = {
  owner?:string;
  id: string;
  name: string;
  description: string;
  tabs: string[];
  tiles: Tile[];
  notes: string;
  filters: Filter[];
  personal: Filter[];
  verified: boolean;
  followed: boolean;
  tags: string[];
  updated: string;
};
export type Monitor = {
  targetQuery?:Query;
  id: string;
  name: string;
  measure: string;
  rule: "below" | "above" | "change";
  threshold: number;
  muted: boolean;
  channel: string;
};
export type Schedule = { id: string; name: string; cadence: string; target: string; status: "ok" | "failed"; last: string;targetQuery?:Query;targetBoard?:BoardScheduleTarget;boardRun?:BoardScheduleRun;resultId?:string;statusNote?:string };
export type Comment = { id: string; boardId: string; text: string; mark: "Useful" | "Question" | ""; attribution?:import("./commentAttribution").LocalCommentAttribution };
export type Audit = { id: string; at: string; what: string;transition?:import("../guideModel").GuideReceipt["transition"] };
export type UserRow = { createdAt?:string;id: string; name: string; email: string; groups: string[]; status: "Active" | "Invited" };
export type Webhook = { id: string; url: string; events: string[] };
export type ActionDef = { id: string; name: string; needsAuth: boolean };

const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

const seedQuery = (partial: Partial<Query>): Query => ({ ...emptyQuery(), ...partial });

const leadership: Board = {
  id: "board-revision",
  owner: "Plant lead",
  name: "Manufacturing leadership",
  description: "Demonstrated leadership figures. A gap is not a cause.",
  tabs: ["Overview", "Mix", "People"],
  notes: "Week starts Monday UTC. Metric definitions are version1; training-plant-v1 is synthetic.",
  filters: [],
  personal: [],
  verified: true,
  followed: true,
  tags: ["leadership"],
  updated: "2026-07-09 09:10",
  tiles: [
    { id: "t1", tab: "Overview", title: "Good units by site", query: seedQuery({ title: "Good units by site", columns: ["goodUnits", "site"], chart: "column" }) },
    { id: "t2", tab: "Overview", title: "OEE by line", query: seedQuery({ title: "OEE by line", columns: ["oee", "line"], chart: "bar", compare: true }) },
    { id: "t3", tab: "Overview", title: "Good units headline", query: seedQuery({ title: "Good units", columns: ["goodUnits"], chart: "headline", compare: true }) },
    { id: "t4", tab: "Mix", title: "Good units by part", query: seedQuery({ title: "Good units by part", columns: ["goodUnits", "part"], chart: "pie" }) },
    { id: "t5", tab: "People", title: "Paid labor hours by site", query: seedQuery({ title: "Paid labor hours by site", columns: ["laborHours", "site"], chart: "column" }) },
  ],
};

type State = {
  hydrated: boolean;
  screen: Screen;
  navOpen: boolean;
  palette: boolean;
  help: boolean;
  northworksGuide?:NorthworksGuideProjection;
  profile: boolean;
  alertOn: boolean;
  coach: boolean;
  compact: boolean;
  displayName: string;
  welcome: string;
  rls: boolean;
  maskDowntime: boolean;
  siteScope: string;
  query: Query;
  past: QueryViewHistory[];
  future: QueryViewHistory[];
  openedAnswerId?: string;
  selectedPoint?: PointSelection;
  explore: boolean;
  underlying: boolean;
  sqlOpen: boolean;
  shareOpen: boolean;
  boardReviews:import("./boardReview").BoardReview[];
  sharedViews: {id:string;permission:"view"|"edit";query:Query;context:{rls:boolean;site:string;maskDowntime:boolean};capturedAt:string;resultId:string|null;rows:import("./model").Row[];synthetic:true;notGranted:true}[];
  formulaOpen: boolean;
  setOpen: boolean;
  paramOpen: boolean;
  infoCol?: string;
  colQuery: string;
  colTab: "popular" | "all";
  formulas: Formula[];
  sets: ValueSet[];
  params: Param[];
  answers: Answer[];
  boards: Board[];
  boardId: string;
  boardTab: string;
  present: boolean;
  presentIndex: number;
  comments: Comment[];
  collectionRemovals:{id:string;collectionId:string;memberId:string;position:number;removedAt:string}[];
  collections: { id: string; name: string; members: string[] }[];
  monitors: Monitor[];
  schedules: Schedule[];
  memory: string[];
  audit: Audit[];
  users: UserRow[];
  groups: { name: string; members: number }[];
  webhookEvents:import("./localWebhooks").LocalWebhookEvent[];
  webhooks: Webhook[];
  actions: ActionDef[];
  links: string[];
  onboarding: Record<string, boolean>;
  maintenance: string;
  embedPresets?: EmbedPreset[];
  qaDefinition?: QaDefinition;
  synonyms:Record<string,string[]>;aliasRevision:number;favorites:string[];removedLibrary:{id:string;kind:"Board"|"Answer";item:Board|Answer}[];
  attachments:{id:string;name:string;bytes:number;sha256:string;capturedAt:string;status:'unreviewed'}[];
  conversationId?:string;
  manufacturingConversationId?:string;
  manufacturingChatActor?:'manager'|'supervisor'|'maintenance'|'safety'|'viewer';
  manufacturingDrafts?:Record<string,string>;
  manufacturingOperationCursors?:Record<string,import('../server/operationCursor').OperationCursor>;
  conversationRoute?:'training'|'manufacturing';
  expertNote:string;expertNoteSaved:boolean;
  askText: string;
  askThread: { q: string; note: string; resultId?:string;capturedQuery?:Query;capture?:import("./capturedView").Capture;manufacturing?:{conversationId:string;turnId:string} }[];
  feedback: Record<string, string>;
  insightFeedback: Record<string, string>;
  patternPrefs: { dropNulls: boolean; dropZeros: boolean };
  apiGuideRequestSignature:string;
  guideInspections:import("./guideInspection").LocalGuideInspection[];
  queryGuideActions:import("./queryGuideAction").QueryGuideAction[];
  patternRan: boolean;
  patternRuns:import("./patternRun").LocalPatternRun[];
  studioSql: string;
  syncNote: string;
  dbtAt: string;
  objectYours: boolean;
  objectSearch: string;
  librarySearch: string;
  userSearch: string;
  sortUsers: "name" | "created";
  actionRequests:import("./localActions").LocalActionRequest[];
  pendingAuthId?:string;
  pendingAuth?: string;
  notifOpen: boolean;
  createOpen: boolean;
  watch: { id: string; title: string; query: Query; formula?: Formula; compareLabel: string; unavailable?: boolean }[];
  go: (screen: Screen) => void;
  log: (what: string,transition?:import("../guideModel").GuideReceipt["transition"]) => void;
  setQuery: (q: Query, record?: boolean) => void;
  patchQuery: (p: Partial<Query>) => void;
  undo: () => void;
  redo: () => void;
  resetQuery: () => void;
  toggleColumn: (id: string) => void;
  addFilter: (f: Filter) => void;
  drill: (nextCol: string) => void;
  keepOnly: () => void;
  excludePoint: () => void;
  startNewAnswer: (query?: Query) => void;
  saveAnswer: () => void;
  pinTo: (boardId: string, tab?:string) => void;
  addKpi: () => void;
  saveBoard: (name: string) => void;
};

const selectedFixture=selectedProvider?contextEnvelope(selectedProvider):null;
const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useEkas = create<State>()(
  persist(
    (set, get) => ({
      synonyms:{},aliasRevision:1,favorites:[],removedLibrary:[],
      attachments:[],
      hydrated: false,
      screen: selectedFixture?"ask":"home",
      navOpen: false,
      palette: false,
      help: false,
      profile: false,
      alertOn: true,
      coach: true,
      compact: false,
      displayName: "EKAS",
      welcome: "Ask a governed question. A change is not a cause.",
      rls: selectedFixture?.runCtx.rls??false,
      maskDowntime: false,
      siteScope: selectedFixture?.runCtx.site??"TP-S1",
      query: selectedFixture?.query??seedQuery({ title: "Good units by site", columns: ["goodUnits", "site"], chart: "column" }),
      past: [],
      future: [],
      explore: false,
      underlying: false,
      sqlOpen: false,
      shareOpen: false,
      sharedViews: [],
      boardReviews: [],
      formulaOpen: false,
      setOpen: false,
      paramOpen: false,
      colQuery: "",
      colTab: "all",
      formulas: [],
      sets: selectedProvider?.contextId==="ownership-all-yours"?structuredClone(acceptanceSets):[],
      params: [],
      answers: selectedFixture?[]:[
        { id: "a1", updated: "2026-07-09 08:40", query: seedQuery({ title: "OEE by line", columns: ["oee", "line"], chart: "bar", compare: true }) },
        { id: "a2", updated: "2026-07-08 16:05", query: seedQuery({ title: "FPY by part", columns: ["fpy", "part"], chart: "column" }) },
      ],
      boards: selectedFixture?[]:[leadership],
      boardId: "board-revision",
      boardTab: "Overview",
      present: false,
      presentIndex: 0,
      comments: selectedFixture?[]:[{ id: "c1", boardId: "board-revision", text: "Feeder-jam evidence identifies a loss; the root cause remains unconfirmed.", mark: "Useful" }],
      collectionRemovals: [],
      collections: selectedFixture?[]:[{ id: "col1", name: "Monday leadership", members: ["board-revision", "a1"] }],
      monitors: selectedFixture?[]:[
        { id: "m1", name: "OEE", measure: "oee", rule: "below", threshold: 0.8, muted: false, channel: "In-app",targetQuery:seedQuery({columns:["oee"],title:"OEE"}) },
        { id: "m2", name: "FPY change", measure: "fpy", rule: "change", threshold: .05, muted: false, channel: "Email",targetQuery:seedQuery({columns:["fpy"],title:"FPY change"}) },
      ],
      schedules: selectedFixture?[]:[
        { id: "s1", name: "Manufacturing leadership", cadence: "Weekdays 06:30", target: "Leadership list", status: "ok", last: "2026-07-09 06:30" },
        { id: "s2", name: "Failed sample", cadence: "Mondays 07:00", target: "Finance list", status: "failed", last: "2026-07-06 07:00" },
      ],
      memory: ["Week starts Monday.", "Do not treat a gap as a cause."],
      audit: [{ id: "au1", at: now(), what: "Opened shell" }],
      users: [
        { id: "u1", name: "Plant lead", email: "lead@plant", groups: ["Administrator", "Leadership"], status: "Active" },
        { id: "u2", name: "Viewer", email: "view@plant", groups: ["Viewers"], status: "Active" },
      ],
      groups: [
        { name: "Administrator", members: 1 },
        { name: "Leadership", members: 1 },
        { name: "Viewers", members: 1 },
      ],
      webhooks: [],
      webhookEvents: [],
      actionRequests: [],
      actions: [{ id: "act1", name: "Open line review", needsAuth: true }],
      links: ["plant.internal"],
      onboarding: { source: true, answer: false, board: false, monitor: false },
      maintenance: "Sunday 03:30–03:45 UTC — definitions freeze, not a data delete.",
      expertNote:"",expertNoteSaved:false,
      askText: "Why did OEE move in TP-S1 manufacturing?",
      askThread: [],
      feedback: {},
      insightFeedback: {},
      patternPrefs: { dropNulls: true, dropZeros: false },
      apiGuideRequestSignature:"",
      guideInspections:[],
      queryGuideActions:[],
      patternRan: false,
      patternRuns:[],
      studioSql: "select site, sum(good_units)\nfrom manufacturing_shift_model\ngroup by site",
      syncNote: "Idle",
      dbtAt: "Not synced",
      objectYours: false,
      objectSearch: "",
      librarySearch: "",
      userSearch: "",
      sortUsers: "name",
      notifOpen: false,
      createOpen: false,
      watch: [
        { id: "w1", title: "Good units", compareLabel: "vs prior month", query: seedQuery({ columns: ["goodUnits"], chart: "headline", compare: true, title: "Good units" }) },
        { id: "w2", title: "OEE", compareLabel: "vs prior month", query: seedQuery({ columns: ["oee"], chart: "headline", compare: true, title: "OEE" }) },
        { id: "w3", title: "Labor hours", compareLabel: "Comparison point unavailable", unavailable: true, query: seedQuery({ columns: ["laborHours"], chart: "headline", title: "Labor hours" }) },
      ],
      go: (screen) => set({ screen, navOpen: false, present: false, createOpen: false, palette: false }),
      log: (what,transition) => set((s) => ({ audit: [{ id: crypto.randomUUID(), at: now(), what,transition:transition||{fromScope:localGuideScope(s),toScope:localGuideScope(s),role:s.manufacturingChatActor||"manager",cutoff:localGuideCutoff(s),entityId:localGuideEntity(s)} }, ...s.audit].slice(0, 80) })),
      setQuery: (q, record = true) =>
        set((s) => ({
          query: q,
          past: record ? [...s.past, {query:s.query,selectedPoint:s.selectedPoint?structuredClone(s.selectedPoint):undefined,underlying:s.underlying}].slice(-30) : s.past,
          future: record ? [] : s.future,
          selectedPoint: undefined,underlying:false,
        })),
      patchQuery: (p) => {
        const s = get();
        get().setQuery({ ...s.query, ...p, ...(p.formulaId!==undefined&&p.formulaId!==s.query.formulaId?{formulaSnapshot:undefined}:{}) });
      },
      undo: () =>
        set((s) => {
          const prev = s.past[s.past.length - 1];
          if (!prev) return s;
          return { selectedPoint:prev.selectedPoint?structuredClone(prev.selectedPoint):undefined,underlying:prev.underlying,query: prev.query, past: s.past.slice(0, -1), future: [{query:s.query,selectedPoint:s.selectedPoint?structuredClone(s.selectedPoint):undefined,underlying:s.underlying}, ...s.future] };
        }),
      redo: () =>
        set((s) => {
          const n = s.future[0];
          if (!n) return s;
          return { selectedPoint:n.selectedPoint?structuredClone(n.selectedPoint):undefined,underlying:n.underlying,query: n.query, future: s.future.slice(1), past: [...s.past, {query:s.query,selectedPoint:s.selectedPoint?structuredClone(s.selectedPoint):undefined,underlying:s.underlying}] };
        }),
      resetQuery: () => {
        const s = get();
        const saved = s.answers.find((a) => a.id === s.openedAnswerId);
        if (!saved) return;
        set({ query: structuredClone(saved.query), past: [], future: [], selectedPoint: undefined });
        get().log("Reset answer to saved");
      },
      toggleColumn: (id) => {
        const s = get();
        const has = s.query.columns.includes(id);
        const columns = has ? s.query.columns.filter((c) => c !== id) : [...s.query.columns, id];
        if(id.startsWith('fx:')&&!has){const formula=s.formulas.find(f=>f.id===id);if(formula){get().setQuery(selectFormulaQuery(s.query,formula));return}}
        get().setQuery({ ...s.query, columns, ...(has&&s.query.formulaId===id?{formulaId:undefined,formulaSnapshot:undefined,title:'Untitled answer'}:{}) });
        get().log(`${has ? "Removed" : "Added"} column ${id}`);
      },
      addFilter: (f) => {
        const s = get();
        const filters = s.query.filters.filter((x) => !(x.col === f.col && x.op === f.op));
        get().setQuery({ ...s.query, filters: [...filters, f] });
        get().log(`Filter ${f.op} ${f.col}`);
      },
      drill: (nextCol) => {
        const s = get();
        const pt = s.selectedPoint;
        if (!pt) return;
        const filters = selectedScopeFilters(s.query.filters,pt);
        const columns = s.query.columns.filter((c) => c !== pt.col);
        if (!columns.includes(nextCol)) columns.push(nextCol);
        get().setQuery({ ...s.query, columns, filters, chart: s.query.chart === "headline" ? "column" : s.query.chart });
        get().log(`Drill ${pt.col}=${pt.value} by ${nextCol}`);
      },
      keepOnly: () => {
        const pt = get().selectedPoint;
        if (!pt) return;
        get().setQuery({...get().query,filters:selectedScopeFilters(get().query.filters,pt)});
      },
      excludePoint: () => {
        const pt = get().selectedPoint;
        if (!pt) return;
        const dimensions=selectedDimensions(pt);if(Object.keys(dimensions).length===1){get().addFilter({ col: pt.col, op: "not", values: [pt.value] });return;}
        const q=get().query,scope={dimensions:structuredClone(dimensions),bucket:q.bucket};get().setQuery({...q,excludedScopes:[...(q.excludedScopes||[]).filter(x=>JSON.stringify(x)!==JSON.stringify(scope)),scope]});
      },
      startNewAnswer: (query = emptyQuery()) => set({ query: structuredClone(query), openedAnswerId: undefined, past: [], future: [], selectedPoint: undefined, underlying: false, explore: false }),
      saveAnswer: () => {
        const s = get();
        const id = s.answers.some(a => a.id === s.openedAnswerId && !a.evidenceCaptureId && !a.canonicalResultId) ? s.openedAnswerId! : crypto.randomUUID();
        const answer: Answer = { id, query: structuredClone(s.query), updated: now() };
        set((st) => ({
          answers: [answer, ...st.answers.filter((a) => a.id !== id)],
          openedAnswerId: id,
        }));
        get().log(`Saved answer ${s.query.title}`,{fromEntityId:localGuideEntity(s),fromCutoff:localGuideCutoff(s),fromScope:localGuideScope(s),toScope:localGuideScope(get()),entityId:localGuideEntity(get()),role:s.manufacturingChatActor||"manager",cutoff:localGuideCutoff(get())});
      },
      pinTo: (boardId,tab) => {
        const s = get();
        set({
          boards: s.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  tiles: [...b.tiles, { id: crypto.randomUUID(), title: s.query.title, query: structuredClone(s.query), tab: tab&&b.tabs.includes(tab)?tab:b.tabs[0] ?? "Overview" }],
                  updated: now(),
                },
          ),
        });
        get().log(`Pinned to ${boardId}`);
      },
      addKpi: () => {
        const s = get();
        set({
          watch: [...s.watch, { id: crypto.randomUUID(), title: (s.query.formulaSnapshot!==undefined?s.query.formulaSnapshot:s.formulas.find(f=>f.id===s.query.formulaId))?.name || s.query.title, formula: structuredClone(s.query.formulaSnapshot!==undefined?s.query.formulaSnapshot||undefined:s.formulas.find(f=>f.id===s.query.formulaId)), compareLabel: "vs prior", query: { ...structuredClone(s.query), chart: "headline" } }],
        });
        get().log("Added watchlist KPI");
      },
      saveBoard: (name) => {
        const before=get();const id = crypto.randomUUID();
        const board: Board = {
          owner:get().displayName,
          id,
          name,
          description: "",
          tabs: ["Overview"],
          tiles: [],
          notes: "",
          filters: [],
          personal: [],
          verified: false,
          followed: false,
          tags: [],
          updated: now(),
        };
        set((s) => ({ boards: [board, ...s.boards], boardId: id, screen: "board", boardTab: "Overview" }));
        get().log(`Created board ${name}`);const after=get(),capturedAt=new Date().toISOString();set({queryGuideActions:[...(after.queryGuideActions||[]),{id:crypto.randomUUID(),kind:'board-created',capturedAt,query:structuredClone(after.query),context:{rls:after.rls,site:after.siteScope,maskDowntime:after.maskDowntime},transition:{fromEntityId:localGuideEntity(before),fromCutoff:localGuideCutoff(before),fromScope:localGuideScope(before),toScope:localGuideScope(after),role:after.manufacturingChatActor||'manager',cutoff:localGuideCutoff(after),entityId:localGuideEntity(after)},inspection:false,synthetic:true,businessCompleted:false} satisfies import('./queryGuideAction').QueryGuideAction].slice(-40)});
      },
    }),
    {
      name: "ekas-answers-v2",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (s) => {
        const { past: _p, future: _f, hydrated: _h, navOpen: _n, palette: _a, help: _hp, northworksGuide: _ng, profile: _pr, ...rest } = s;
        void _ng;
        void _p;
        void _f;
        void _h;
        void _n;
        void _a;
        void _hp;
        void _pr;
        return Object.fromEntries(Object.entries(rest).filter(([key])=>!["shareOpen","formulaOpen","setOpen","paramOpen","infoCol","pendingAuth","createOpen","notifOpen","sqlOpen","explore","underlying","selectedPoint"].includes(key)));
      },
    },
  ),
);

export function chartCycle(c: ChartKind): ChartKind {
  const all: ChartKind[] = ["column", "bar", "line", "area", "pie", "table", "headline", "pivot"];
  return all[(all.indexOf(c) + 1) % all.length];
}

export type { Bucket };
