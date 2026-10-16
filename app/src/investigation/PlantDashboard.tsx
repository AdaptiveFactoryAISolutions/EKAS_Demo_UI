import { useState } from 'react';
import { dashboardCatalog, type DashboardFamilyId, type DashboardMeasure, type DashboardRank } from './dashboardCatalog';
import { impactLine, journeyAction, presentedStatus } from './plantPresentation';
import type { CaseId } from './cases';

type Metric = { value?: number | boolean | null; unit?: string };
type View = { title?: string; caseId?: string; cycle?: number; context?: { plant?: string; line?: string; asset?: string; job?: string; part?: string; revision?: string }; goal?: { actual?: number | null; target?: number | null; gap?: number | null; unit?: string | null } | null; metrics?: { good?: number; down?: number; oee?: Metric; qualityLoss?: Metric; speedLoss?: Metric }; bridge?: (number | null)[] | null; contributors?: { line?: string; asset?: string; job?: string; gap?: number | null }[] | null; verification?: { status?: string } | null; owner?: { accepted?: string | null; requested?: string | null } | null; action?: { status?: string } | null; sustain?: { status?: string } | null; hypotheses?: unknown[] | null } | null | undefined;

function amount(value: number | boolean | null | undefined, digits = 1) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Unavailable';
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : digits });
}

function MeasureCards({ rows }: { rows: DashboardMeasure[] }) {
  return <ul className="ekas-dash-kpis">{rows.map(row => <li key={row.id}><p>{row.label}</p><p>{row.display}</p><p>Target: {row.target}</p></li>)}</ul>;
}

function MeasureTable({ rows, caption }: { rows: DashboardMeasure[]; caption: string }) {
  return <>
    <table className="ekas-dash-table"><caption>{caption}</caption><thead><tr><th>Measure</th><th>Value</th><th>Target</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><th>{row.label}</th><td>{row.display}</td><td>{row.target}</td></tr>)}</tbody></table>
    <ul className="ekas-dash-cards">{rows.map(row => <li key={row.id}><p>{row.label}</p><p>{row.display}</p><p>Target: {row.target}</p></li>)}</ul>
  </>;
}

function DecisionBars({ rows }: { rows: { id: string; label: string; display: string; share: number }[] }) {
  if (!rows.length) return <p>Unavailable. No governed series is supplied for this chart.</p>;
  return <ul className="ekas-dash-bars">{rows.map(row => <li key={row.id}><span>{row.label}</span><span className="ekas-dash-track" aria-hidden="true"><span style={{ width: `${row.share}%` }} /></span><span>{row.display}</span></li>)}</ul>;
}

function rankName(rank: DashboardRank) {
  return `${rank.line}, ${rank.gap.toLocaleString('en-US')} ${rank.unit} below the approved plan`;
}

/** Supporting view of the operating review and the open investigation. It does not keep a separate case status. */
export function PlantDashboard({ view, verificationRecorded, focus, showSources, onSelect, onAsk, onInvestigate, onEvidence }: { view: View; verificationRecorded?: boolean; focus?: { plant?: string | null; line?: string | null; caseId?: CaseId | null } | null; showSources?: boolean; onSelect?: (caseId: CaseId) => void; onAsk?: () => void; onInvestigate?: () => void; onEvidence?: () => void }) {
  const catalog = dashboardCatalog();
  const [familyId, setFamily] = useState<DashboardFamilyId>('operations');
  const family = catalog.families.find(item => item.id === familyId) || catalog.families[0];
  const selected = !!focus?.caseId && focus.line;
  const contextLine = selected ? `${focus?.plant || 'Northworks'} › ${focus?.line} · Oct 6 · Day Shift · Synthetic` : family.context;
  const status = view?.title ? presentedStatus(view, { verificationRecorded }) : '';
  const step = view?.title ? journeyAction(view, 'manager', { verificationRecorded }) : null;
  const goal = view?.goal;
  const metrics = view?.metrics;
  const bridge = view?.bridge || [];
  const names = ['Theoretical capacity', 'Downtime', 'Speed residual', 'Final non-good', 'Good output'];
  const contributors = (view?.contributors || []).filter(item => item.gap != null).slice(0, 4);
  return <section aria-label="Plant dashboard" className="ekas-dash">
    <nav aria-label="Dashboard families">{catalog.families.map(item => <button key={item.id} type="button" aria-pressed={item.id === family.id} onClick={() => setFamily(item.id)}>{item.title}</button>)}</nav>
    <p className="ekas-dash-context">{contextLine}</p>
    {view?.title && view.context && <>
      <p>{[view.context.plant, view.context.line, view.context.asset, view.context.job].filter(Boolean).join(' · ')}{view.context.part ? ` · ${view.context.part} ${view.context.revision || ''}` : ''}</p>
      <h2>What is happening</h2>
      <p>{view.title}. {impactLine(view)}.</p>
      <h2>Where is the loss</h2>
      <ul className="ekas-scorecard-cards">
        <li><p>Production versus plan</p><p>{goal?.actual == null ? 'Unavailable' : `${amount(goal.actual, 0)} against ${amount(goal.target, 0)} ${goal.unit || 'units'}`}</p></li>
        <li><p>OEE</p><p>{metrics?.oee?.value == null ? 'Unavailable' : `${amount(metrics.oee.value)}%`}</p></li>
        <li><p>Downtime</p><p>{metrics?.down == null ? 'Unavailable' : `${amount(metrics.down, 0)} minutes`}</p></li>
        <li><p>Quality loss</p><p>{metrics?.qualityLoss?.value == null ? 'Unavailable' : `${amount(metrics.qualityLoss.value)}%`}</p></li>
      </ul>
      {bridge.some(value => value != null) && <table className="ekas-scorecard-table"><caption>Plan, actual, and loss bridge</caption><thead><tr><th>Bridge</th><th>Good-equivalent units</th></tr></thead><tbody>{names.map((name, index) => <tr key={name}><th>{name}</th><td>{amount(bridge[index], 0)}</td></tr>)}</tbody></table>}
      {contributors.length > 0 && <><h2>Loss contributors</h2><ul>{contributors.map(item => <li key={(item.asset || '') + (item.job || '') + (item.line || '')}>{[item.line, item.asset, item.job].filter(Boolean).join(' · ')} · {amount(item.gap, 0)} units</li>)}</ul></>}
      <h2>What to investigate</h2>
      <p>{view.title}. Status: {status}. Next: {step?.next || step?.label}.</p>
    </>}
    {!view?.title && family.id === 'operations' && <>
      <h2>What is happening</h2>
      <p>Northworks is on the selected synthetic shift. The largest approved-plan shortfall is the first case below.</p>
      <h2>Where is the loss</h2>
    </>}
    <h2>{view?.title ? family.title : family.id === 'operations' ? 'Operating measures' : family.title}</h2>
    <MeasureCards rows={family.kpis} />
    {showSources && <ul className="ekas-dash-source">{family.kpis.map(row => <li key={row.id}>{row.label}: {row.source}</li>)}</ul>}
    <h2>{family.decisionTitle}</h2>
    {family.id === 'operations' ? <ul className="ekas-dash-ranks">{catalog.ranks.map(rank => <li key={rank.caseId}><button type="button" aria-pressed={focus?.caseId === rank.caseId} onClick={() => onSelect?.(rank.caseId)}>{rankName(rank)}</button><p>{rank.plant} · {rank.title}. {rank.actual.toLocaleString('en-US')} against {rank.target.toLocaleString('en-US')} {rank.unit}.</p></li>)}</ul> : <DecisionBars rows={family.bars} />}
    <h2>{family.breakdownTitle}</h2>
    <MeasureTable rows={family.rows} caption={family.breakdownTitle} />
    {!view?.title && family.id === 'operations' && <h2>What to investigate</h2>}
    <p>{family.interpretation}</p>
    <p>{view?.title ? `Open investigation: ${view.title}. Status: ${status}. Next: ${step?.next || step?.label}. This is the investigation status.` : 'No investigation is open. Choose a line, then ask why or investigate that case.'}</p>
    <div className="ekas-answer-actions">{onAsk && <button type="button" onClick={onAsk}>Ask about this</button>}{onInvestigate && <button type="button" onClick={onInvestigate}>Investigate</button>}{onEvidence && <button type="button" onClick={onEvidence}>Show evidence</button>}</div>
  </section>;
}
