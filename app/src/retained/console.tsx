import {noticesInspectionPayload} from './workflowRuntime';
import {withGuideInspection,libraryInspectionPayload} from './guideInspection';
import {emitGuideUiObservation} from '../guideUiObservation';
import {fixtureSelectionIssue} from '../platform/fixtureSelection';
import {FixtureSelector} from './FixtureSelector';
import {PersistenceStatus} from './PersistenceStatus';
import {registerWorkspaceShortcut} from '../workspaceShortcut';
import {RecoveryTools} from './recovery';
import {synchronizeAliases} from './synonyms';
import { useEffect, useLayoutEffect,useRef,useState, type CSSProperties,type ReactNode } from "react";
import { Toaster } from "./notices";
import { Overlays, ScreenBody } from "./screens";
import {beginNewConversation} from '../investigation/unified';
import { areaOf, useEkas, type Screen } from "./store";

export const INSIGHTS: { id: Screen; label: string; group?: string }[] = [
  { id: "home", label: "Home" },
  { id:"metriclab",label:"Metric workbench" },
  { id:"canonicalmetrics",label:"Canonical contracts" },
  { id: "ask", label: "Ask" },
  { id: "search", label: "Search" },
  { id: "boards", label: "Boards", group: "Library" },
  { id: "answers", label: "Answers", group: "Library" },
  { id: "collections", label: "Collections", group: "Library" },
  { id: "schedules", label: "Schedules", group: "Watch" },
  { id: "monitors", label: "Monitors", group: "Watch" },
  { id: "patterns", label: "Pattern scans", group: "Watch" },
  { id: "inspection", label: "Inspection" },
];

export const DATA: { id: Screen; label: string; group?: string }[] = [
  { id: "objects", label: "Data objects" },
  { id: "connections", label: "Connections" },
  { id: "studio", label: "Studio" },
  { id: "utilities", label: "Utilities" },
  { id: "sync", label: "Sync" },
  { id: "memory", label: "Memory sources", group: "Memory" },
  { id: "catalog", label: "Catalog", group: "Governance" },
  { id: "usage", label: "Usage", group: "Governance" },
  { id: "dbt", label: "Definition sync", group: "Governance" },
  { id: "verify", label: "Verification", group: "Governance" },
];

export const DEVELOP: { id: Screen; label: string; group?: string }[] = [
  { id: "devhome", label: "Home" },
  { id: "playground", label: "Embed playground", group: "Embed" },
  { id: "apiplay", label: "API playground", group: "API" },
  { id: "theme", label: "Theme", group: "Customize" },
  { id: "actions", label: "Actions", group: "Customize" },
  { id: "styles", label: "Styles", group: "Customize" },
  { id: "links", label: "Links", group: "Customize" },
  { id: "security", label: "Security", group: "Customize" },
  { id: "webhooks", label: "Webhooks", group: "Customize" },
];

export const ADMIN: { id: Screen; label: string; group?: string }[] = [
  { id: "users", label: "Users" },
  { id: "groups", label: "Groups" },
  { id: "customization", label: "Customization", group: "Configuration" },
  { id: "onboarding", label: "Onboarding", group: "Configuration" },
  { id: "pricing", label: "Plan", group: "Account" },
  { id: "datausage", label: "Data usage", group: "Account" },
  { id: "contact", label: "Contact", group: "Account" },
  { id: "getstarted", label: "Get started", group: "Account" },
  { id: "maintenance", label: "Maintenance", group: "Monitor" },
  { id: "terms", label: "Terms", group: "Monitor" },
];

export function Console({content,onNavigate,workspaceTools,plantMode}:{content?:ReactNode;onNavigate?:()=>void;workspaceTools?:ReactNode;plantMode?:{area:string;onArea:(area:string)=>void;onAdvanced:()=>void;engineering?:boolean}}={}) {
  const openObserved=(field:'palette'|'profile'|'help',kind:'ui-palette-opened'|'ui-profile-opened'|'ui-help-opened')=>{const before=useEkas.getState()[field];if((field==='help'||field==='profile')&&moreMenu.current?.open){const inside=moreMenu.current.contains(document.activeElement);moreMenu.current.open=false;if(inside)moreSummary.current?.focus();}if(field==='help'&&!before){withGuideInspection('help-opened',()=>useEkas.getState().help?{opened:true,synthetic:true,businessCompleted:false,qualification:'Normal Help opening in the exact local scope; no training or workflow completion.'}:null,()=>useEkas.setState({help:true}));}else useEkas.setState({[field]:true});if(!before&&useEkas.getState()[field])emitGuideUiObservation(kind);};
  const dismissObserved=()=>{const before=useEkas.getState().alertOn;useEkas.setState({alertOn:false});if(before&&!useEkas.getState().alertOn)emitGuideUiObservation('ui-status-dismissed');};
  const moreMenu=useRef<HTMLDetailsElement>(null),moreSummary=useRef<HTMLElement>(null);const mainContent=useRef<HTMLElement>(null),menuButton=useRef<HTMLButtonElement>(null),brandButton=useRef<HTMLButtonElement>(null),focusAfterNavigation=useRef(false);const navigate=(screen:Screen)=>{if(moreMenu.current)moreMenu.current.open=false;focusAfterNavigation.current=true;useEkas.getState().go(screen);onNavigate?.()};
  const aliases=useEkas(s=>s.synonyms);
  useEffect(()=>synchronizeAliases(aliases),[aliases]);
  const screen = useEkas((s) => s.screen);
  const navOpen = useEkas((s) => s.navOpen);
  useEffect(()=>{const closeNavigation=(event:KeyboardEvent)=>{if(event.key!=='Escape'||event.defaultPrevented||!navOpen||document.querySelector('[role="dialog"],.highcharts-dashboards-edit-sidebar-show,.highcharts-dashboards-edit-sidebar-right-show'))return;useEkas.setState({navOpen:false});menuButton.current?.focus()};window.addEventListener('keydown',closeNavigation);return()=>window.removeEventListener('keydown',closeNavigation)},[navOpen]);
  const alertOn = useEkas((s) => s.alertOn);
  const displayName = useEkas((s) => s.displayName);
  const compact = useEkas((s) => s.compact);
  const librarySearch = useEkas((s) => s.librarySearch);
  useLayoutEffect(()=>{if(focusAfterNavigation.current&&mainContent.current){mainContent.current.focus();focusAfterNavigation.current=false}},[screen,navOpen]);
  const headerRef=useRef<HTMLElement>(null);const [menuTop,setMenuTop]=useState(0);
  useLayoutEffect(()=>{if(!navOpen)return;const position=()=>{const bottom=headerRef.current?.getBoundingClientRect().bottom??0;setMenuTop(window.innerWidth<768?Math.max(0,Math.min(bottom,window.innerHeight)):0)};position();window.addEventListener('scroll',position,true);window.addEventListener('resize',position);const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(position);if(headerRef.current)observer?.observe(headerRef.current);return()=>{window.removeEventListener('scroll',position,true);window.removeEventListener('resize',position);observer?.disconnect()}},[navOpen,screen,alertOn,compact]);
  const area = areaOf(screen);
  const nav = area === "data" ? DATA : area === "develop" ? DEVELOP : area === "admin" ? ADMIN : INSIGHTS;

  useEffect(() => {
    void useEkas.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("compact", compact);
  }, [compact]);

  useEffect(()=>registerWorkspaceShortcut(10,()=>{const before=useEkas.getState().palette;useEkas.setState({palette:!before});if(!before&&useEkas.getState().palette)emitGuideUiObservation('ui-palette-opened')}),[]);

  const selectionIssue=fixtureSelectionIssue(window.location.search);if(selectionIssue)return <main><h1>Synthetic context unavailable</h1><p role="alert">{selectionIssue}</p><FixtureSelector/></main>;
  const recoveryIssue=useEkas.persist.getRecoveryIssue();
  if(recoveryIssue)return <main aria-label="Workspace recovery required"><h1>Workspace recovery required</h1><p role="alert">{recoveryIssue}</p><RecoveryTools expanded/></main>;
  if(useEkas.persist.getStatus()==="loading")return <main aria-label="Loading saved workspace"><p>Loading and validating saved local data…</p></main>;
  let lastGroup = "";
  return (
    <div className={"min-h-screen bg-bg text-fg"+(plantMode?" retained-plant-shell":"")}>
      <Toaster theme="dark" /><PersistenceStatus quiet={!!plantMode}/>{!plantMode&&<FixtureSelector/>}
      <header ref={headerRef} className="retained-header sticky top-0 z-30 border-b border-line bg-bg">
        {alertOn && !plantMode && (
          <div className="retained-alert-strip flex items-center justify-between gap-3 bg-surface px-4 py-2 text-sm">
            <span>Sample figures are demonstrated, not plant actuals. A change is not a cause.</span>
            <button className="min-h-11 px-2" data-guide-action="status-dismiss" onClick={() => {dismissObserved();(window.innerWidth<768?menuButton:brandButton).current?.focus()}}>Close</button>
          </div>
        )}
        <div className="retained-primary-header flex flex-wrap items-center gap-2 px-3 py-2">
          <button ref={menuButton} aria-expanded={navOpen} className="min-h-11 px-2 font-semibold md:hidden" onClick={() => useEkas.setState({ navOpen: !navOpen })}>Menu</button>
          <button ref={brandButton} className="min-h-11 px-2 text-lg font-semibold" onClick={() => plantMode?plantMode.onArea("Brief"):navigate("home")}>{displayName}</button>
          <nav aria-label="Template header navigation" className="flex gap-1 overflow-x-auto">
            {plantMode?null:(["insights", "data", "develop", "admin"] as const).map((a) => (
              <button
                key={a}
                className={area === a ? "min-h-11 rounded-lg bg-surface px-3 text-sm" : "min-h-11 px-3 text-sm text-muted"}
                onClick={() => navigate(a === "insights" ? "home" : a === "data" ? "objects" : a === "develop" ? "devhome" : "users")}
              >
                {a === "insights" ? "Insights" : a === "data" ? "Data" : a === "develop" ? "Develop" : "Admin"}
              </button>
            ))}
          </nav>
          {!plantMode&&<input
            data-guide-action="palette-open" aria-label="Search the library" value={librarySearch}
            onChange={(e) => withGuideInspection('library-searched',libraryInspectionPayload,()=>useEkas.setState({librarySearch:e.target.value}))}
            onClick={() => openObserved('palette','ui-palette-opened')}
            onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();openObserved('palette','ui-palette-opened')}}}
            placeholder="Search the library"
            className="retained-library-search min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm"
          />}
          <button className="retained-desktop-extra min-h-11 px-2 text-sm" onClick={() => withGuideInspection('notices-inspected',noticesInspectionPayload,()=>useEkas.setState({notifOpen:true}))}>Notices</button>
          <button className="retained-desktop-extra min-h-11 px-2 text-sm" data-guide-action="help-open" onClick={() => openObserved('help','ui-help-opened')}>Help</button>
          <button className="retained-desktop-extra min-h-11 px-2 text-sm" data-guide-action="profile-open" onClick={() => openObserved('profile','ui-profile-opened')}>Profile</button>
          <details ref={moreMenu} className="retained-mobile-more" aria-label="Workspace utilities" onKeyDown={event=>{if(event.key==='Escape'&&moreMenu.current?.open){event.preventDefault();event.stopPropagation();moreMenu.current.open=false;moreSummary.current?.focus()}}}>
            <summary ref={moreSummary} aria-label="More workspace utilities">More</summary>
            <div className="retained-more-panel">
              <div className="retained-more-mobile">{plantMode?null:<nav aria-label="Mobile workspace navigation">{(["Insights","Data","Develop","Admin"] as const).map(a=><button key={a} onClick={()=>navigate(a==="Insights"?"home":a==="Data"?"objects":a==="Develop"?"devhome":"users")}>{a}</button>)}</nav>}<button onClick={()=>withGuideInspection('notices-inspected',noticesInspectionPayload,()=>useEkas.setState({notifOpen:true}))}>Notices</button><button data-guide-action="help-open" onClick={()=>openObserved('help','ui-help-opened')}>Help</button><button data-guide-action="profile-open" onClick={()=>openObserved('profile','ui-profile-opened')}>Profile</button></div>
              {!(plantMode&&!plantMode.engineering)&&<nav aria-label="Secondary workspace utilities" className="retained-more-utilities"><button onClick={()=>navigate("pricing")}>Plan</button><button onClick={()=>navigate("contact")}>Expert note</button><button onClick={()=>navigate("getstarted")}>Features</button><span className="text-sm text-muted">Ctrl+K · Search the library</span></nav>}
            </div>
          </details>
        </div>
      </header>
      <div className="retained-shell-body md:grid md:grid-cols-[220px_1fr]">
        <aside style={{'--retained-menu-top':menuTop+'px'} as CSSProperties} aria-label="Template sidebar navigation" className={navOpen ? "border-line bg-surface p-3 md:block md:border-r" : "hidden border-line bg-surface p-3 md:block md:border-r"}>
          {plantMode?<button className="mb-2 min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-fg" onClick={()=>{void beginNewConversation();plantMode.onArea('Brief');useEkas.setState({navOpen:false})}}>New conversation</button>:<button className="mb-2 min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-fg" onClick={() => useEkas.setState({ createOpen: true })}>Create</button>}
          {plantMode?[{id:"Brief",label:"Chat"},{id:"Dashboards",label:"Dashboards"},{id:"Explore",label:"Investigations"},{id:"Improvements",label:"Improvements"},{id:"Knowledge",label:"Knowledge"},...(plantMode.engineering?[{id:"Administration",label:"Administration"}]:[])].map(item=><div key={item.id}><button className={plantMode.area===item.id||(item.id==="Dashboards"&&plantMode.area==="Metrics")?"min-h-11 w-full rounded-lg bg-surface-2 px-2 text-left text-sm":"min-h-11 w-full rounded-lg px-2 text-left text-sm text-muted"} aria-current={plantMode.area===item.id?"page":undefined} onClick={()=>{plantMode.onArea(item.id);useEkas.setState({navOpen:false})}}>{item.label}</button></div>):nav.map((item) => {
            const header = item.group && item.group !== lastGroup ? item.group : "";
            if (item.group) lastGroup = item.group;
            return (
              <div key={item.id}>
                {header && <div className="mt-3 px-2 text-xs uppercase text-muted">{header}</div>}
                <button
                  className={screen === item.id ? "min-h-11 w-full rounded-lg bg-surface-2 px-2 text-left text-sm" : "min-h-11 w-full rounded-lg px-2 text-left text-sm text-muted"}
                  onClick={() => navigate(item.id)}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
          {workspaceTools&&<details className="mt-3"><summary>Workspace tools</summary>{workspaceTools}</details>}
        </aside>
        <main ref={mainContent} tabIndex={-1} aria-label="Workspace content" className="overflow-x-hidden p-4 md:p-6">
          {content ?? <ScreenBody />}
        </main>
      </div>
      <Overlays onWorkspaceNavigate={navigate} guidePage={plantMode?"ask":undefined} guideNavigate={plantMode?page=>{if(!plantMode.engineering)return;useEkas.getState().go(page);plantMode.onAdvanced()}:undefined}/>
    </div>
  );
}
