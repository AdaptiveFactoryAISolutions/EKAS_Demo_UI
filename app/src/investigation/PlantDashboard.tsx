import { useMemo, useState, type KeyboardEvent } from 'react';
import { DashboardChart } from './DashboardChart';
import { dashboardCatalog, type DashboardChart as DashboardChartModel, type DashboardFamily, type DashboardFamilyId, type DashboardMeasure, type DashboardRank } from './dashboardCatalog';
import { impactLine, journeyAction, presentedStatus } from './plantPresentation';
import type { CaseId } from './cases';

type Metric = { value?: number | boolean | null; unit?: string };
type View = { title?: string; caseId?: string; cycle?: number; context?: { plant?: string; line?: string; asset?: string; job?: string; part?: string; revision?: string }; goal?: { actual?: number | null; target?: number | null; gap?: number | null; unit?: string | null } | null; metrics?: { good?: number; down?: number; oee?: Metric; qualityLoss?: Metric; speedLoss?: Metric }; bridge?: (number | null)[] | null; contributors?: { line?: string; asset?: string; job?: string; gap?: number | null }[] | null; verification?: { status?: string } | null; owner?: { accepted?: string | null; requested?: string | null } | null; action?: { status?: string } | null; sustain?: { status?: string } | null; hypotheses?: unknown[] | null } | null | undefined;

function targetLine(row: DashboardMeasure) {
  if (row.display === 'Unavailable' || row.target === 'No governed target') return row.target;
  return `Target ${row.target}`;
}

function MeasureCards({ rows, showScope }: { rows: DashboardMeasure[]; showScope: boolean }) {
  return <ul className="ekas-dash-kpis">{rows.map(row => <li key={row.id}><p>{row.label}</p><p>{row.display}</p><p>{targetLine(row)}</p><p>{row.status}</p>{showScope && <p>{row.scope}</p>}</li>)}</ul>;
}

function rankName(rank: DashboardRank) {
  const amount = `${rank.gap.toLocaleString('en-US')} ${rank.unit} below plan`;
  if (rank.caseId === 'downtime') return `Northworks plant plan miss, ${amount}`;
  return `${rank.line}, ${rank.gap.toLocaleString('en-US')} ${rank.unit} below the approved plan`;
}

function FamilySelector({ families, familyId, onSelect }: { families: DashboardFamily[]; familyId: DashboardFamilyId; onSelect: (id: DashboardFamilyId) => void }) {
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % families.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + families.length) % families.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = families.length - 1;
    else return;
    event.preventDefault();
    const id = families[next].id;
    onSelect(id);
    requestAnimationFrame(() => document.getElementById('dash-tab-' + id)?.focus());
  }
  return <>
    <label className="ekas-dash-family-select">Dashboard family
      <select value={familyId} onChange={event => onSelect(event.target.value as DashboardFamilyId)}>{families.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
    </label>
    <div className="ekas-dash-tabs" role="tablist" aria-label="Dashboard families">{families.map((item, index) => {
      const active = item.id === familyId;
      return <button key={item.id} id={'dash-tab-' + item.id} type="button" role="tab" className={active ? 'ekas-dash-family ekas-dash-family-active' : 'ekas-dash-family'} aria-selected={active} aria-controls={'dash-panel-' + item.id} tabIndex={active ? 0 : -1} onClick={() => onSelect(item.id)} onKeyDown={event => onKey(event, index)}>{item.title}</button>;
    })}</div>
  </>;
}

function ChartGroup({ charts }: { charts: DashboardChartModel[] }) {
  if (!charts.length) return null;
  return <>{charts.map(item => <DashboardChart key={item.id} chart={item} />)}</>;
}

/** Supporting view of the operating review and the open investigation. It does not keep a separate case status. */
export function PlantDashboard({ view, verificationRecorded, focus, onSelect, onAsk, onInvestigate, onEvidence }: { view: View; verificationRecorded?: boolean; focus?: { plant?: string | null; line?: string | null; caseId?: CaseId | null } | null; showSources?: boolean; onSelect?: (caseId: CaseId) => void; onAsk?: () => void; onInvestigate?: () => void; onEvidence?: () => void }) {
  const catalog = useMemo(() => dashboardCatalog(), []);
  const [familyId, setFamily] = useState<DashboardFamilyId>('operations');
  const family = catalog.families.find(item => item.id === familyId) || catalog.families[0];
  const selected = !!focus?.caseId && focus.line;
  const contextLine = selected ? `${focus?.plant || 'Northworks'} › ${focus?.line} · Oct 6 · Day Shift · Synthetic` : family.context;
  const status = view?.title ? presentedStatus(view, { verificationRecorded }) : '';
  const step = view?.title ? journeyAction(view, 'manager', { verificationRecorded }) : null;
  const line03 = catalog.families.find(item => item.id === 'operations')?.charts.find(item => item.id === 'line-contribution')?.points.find(item => item.label === 'Line 03');
  const plantRank = catalog.ranks.find(item => item.caseId === 'downtime');
  const plantStory = plantRank && line03
    ? `Plant shortfall: ${plantRank.gap.toLocaleString('en-US')} ${plantRank.unit} below plan. Largest contributor: Line 03 contributed ${Math.abs(line03.numeric).toLocaleString('en-US')} units of the plant's ${plantRank.gap.toLocaleString('en-US')}-unit shortfall.`
    : family.context;
  const happening = view?.caseId === 'downtime' && plantRank && line03
    ? `Northworks plant plan miss. ${plantRank.gap.toLocaleString('en-US')} ${plantRank.unit} below plan. Line 03 contributed ${Math.abs(line03.numeric).toLocaleString('en-US')} units of that plant shortfall.`
    : view?.title
      ? `${[view.context?.plant, view.context?.line, view.context?.asset, view.context?.job].filter(Boolean).join(' · ')}. ${view.title}. ${impactLine(view)}.`
      : family.id === 'operations'
        ? plantStory
        : family.charts.length
          ? `${family.title} uses the same shared context. The chart and its table use one governed result.`
          : family.context;
  const investigate = view?.title
    ? `${view.title}. Status: ${status}. Next: ${step?.next || step?.label}. This is the investigation status.`
    : 'No investigation is open. Choose a line, then ask why or investigate that case.';
  const primary = family.charts.filter(item => item.place === 'primary');
  const loss = family.charts.filter(item => item.place === 'loss');
  const kpiScopes = new Set(family.kpis.map(row => row.scope));
  const sharedKpiScope = kpiScopes.size === 1 ? family.kpis[0]?.scope || '' : '';
  return <section aria-label="Plant dashboard" className="ekas-dash">
    <FamilySelector families={catalog.families} familyId={family.id} onSelect={setFamily} />
    <p className="ekas-dash-context">{contextLine}</p>
    <div role="tabpanel" id={'dash-panel-' + family.id} aria-labelledby={'dash-tab-' + family.id}>
      <h2>What is happening</h2>
      <p>{happening}</p>
      <h2>KPI status</h2>
      {sharedKpiScope && !contextLine.startsWith(sharedKpiScope) && <p className="ekas-dash-scope">{sharedKpiScope}</p>}
      <MeasureCards rows={family.kpis} showScope={!sharedKpiScope} />
      <ChartGroup charts={primary} />
      {loss.length > 0 && <>
        <h2>Where is the loss</h2>
        <ChartGroup charts={loss} />
        {family.id === 'operations' && <ul className="ekas-dash-ranks">{catalog.ranks.map(rank => <li key={rank.caseId}><button type="button" aria-pressed={focus?.caseId === rank.caseId} onClick={() => onSelect?.(rank.caseId)}>{rankName(rank)}</button><p>{rank.caseId === 'downtime' ? `Plant scope. ${rank.actual.toLocaleString('en-US')} against ${rank.target.toLocaleString('en-US')} ${rank.unit}. Line 03 contribution: ${line03?.display}.` : `${rank.plant} · ${rank.title}. ${rank.actual.toLocaleString('en-US')} against ${rank.target.toLocaleString('en-US')} ${rank.unit}.`}</p></li>)}</ul>}
      </>}
      <p>{family.interpretation}</p>
      <details className="ekas-dash-technical"><summary>Technical details</summary><ul>{family.kpis.map(row => <li key={row.id}>{row.label}: {row.source}</li>)}</ul></details>
      <h2>What to investigate</h2>
      <p>{investigate}</p>
    </div>
    <div className="ekas-answer-actions">{onAsk && <button type="button" onClick={onAsk}>Ask about this</button>}{onInvestigate && <button type="button" onClick={onInvestigate}>Investigate</button>}{onEvidence && <button type="button" onClick={onEvidence}>Show evidence</button>}</div>
  </section>;
}
