import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import type { DashboardChart as DashboardChartModel } from './dashboardCatalog';

/** Native Highcharts column chart. Series, labels, and the table are the same governed points. */
export function DashboardChart({ chart }: { chart: DashboardChartModel }) {
  const host = useRef<HTMLDivElement>(null);
  const signature = chart.points.map(item => item.id + ':' + item.numeric + ':' + item.display).join('|');
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const drawn = Highcharts.chart(node, {
      chart: { type: 'column', backgroundColor: '#131d31', height: 176, animation: false, spacing: [4, 6, 2, 6], style: { fontFamily: 'IBM Plex Sans, sans-serif' } },
      title: { text: chart.title, style: { color: '#e7eef8', fontSize: '14px' } },
      credits: { enabled: false },
      legend: { enabled: false },
      accessibility: { enabled: true, description: chart.description },
      xAxis: { type: 'category', lineColor: '#24344f', labels: { style: { color: '#e7eef8', fontSize: '11px' } } },
      yAxis: { title: { text: chart.unit, style: { color: '#b7c8df' } }, gridLineColor: '#24344f', labels: { style: { color: '#b7c8df' } } },
      tooltip: {
        outside: true,
        backgroundColor: '#0b1220',
        borderColor: '#24344f',
        style: { color: '#e7eef8' },
        headerFormat: '',
        pointFormatter() {
          const custom = (this.options as { custom?: { display?: string; scope?: string } }).custom;
          return `<span style="color:#e7eef8">${this.name}: ${custom?.display || this.y}</span><br/><span style="color:#b7c8df">${custom?.scope || chart.scope}</span>`;
        },
        positioner(labelWidth, labelHeight, point) {
          const hostChart = this.chart;
          const anchorX = (point.plotX || 0) + hostChart.plotLeft;
          const anchorY = (point.plotY || 0) + hostChart.plotTop;
          let x = anchorX - labelWidth / 2;
          let y = anchorY + 14;
          const bounds = hostChart.container.getBoundingClientRect();
          const left = Math.max(8 - bounds.left, 4);
          const top = Math.max(8 - bounds.top, 4);
          const right = Math.min(hostChart.chartWidth - labelWidth - 4, window.innerWidth - bounds.left - labelWidth - 8);
          const bottom = Math.min(hostChart.chartHeight - labelHeight - 4, window.innerHeight - bounds.top - labelHeight - 8);
          x = Math.max(left, Math.min(x, Math.max(left, right)));
          y = Math.max(top, Math.min(y, Math.max(top, bottom)));
          return { x, y };
        },
      },
      plotOptions: {
        column: { borderWidth: 0, color: '#2bb6a3' },
        series: {
          animation: false,
          dataLabels: {
            enabled: true,
            crop: true,
            overflow: 'justify',
            formatter() {
              return (this.options as { custom?: { display?: string } }).custom?.display || '';
            },
            style: { color: '#e7eef8', textOutline: 'none', fontSize: '11px', fontWeight: '600' },
          },
        },
      },
      series: [{
        type: 'column',
        name: chart.title,
        data: chart.points.map(item => ({ name: item.label, y: item.numeric, custom: { display: item.display, scope: item.scopeDetail } })),
      }],
    });
    const observer = new ResizeObserver(() => drawn.reflow());
    observer.observe(node);
    return () => {
      observer.disconnect();
      drawn.destroy();
    };
  }, [signature, chart.description, chart.id, chart.scope, chart.title, chart.unit]);
  return <figure className="ekas-dash-figure" data-chart-id={chart.id} data-values={chart.points.map(item => String(item.numeric)).join(',')} aria-label={chart.description}>
    <p className="ekas-dash-scope">{chart.scope}</p>
    <div className="ekas-dash-chart" ref={host} />
    {chart.note ? <figcaption>{chart.note}</figcaption> : null}
    <table className="ekas-dash-table">
      <caption>{chart.title}</caption>
      <thead><tr><th>Measure</th><th>Value</th><th>Scope</th><th>Source</th></tr></thead>
      <tbody>{chart.points.map(item => <tr key={item.id}><th>{item.label}</th><td>{item.display}</td><td>{item.scopeDetail}</td><td>{item.sourceLabel}</td></tr>)}</tbody>
    </table>
    <ul className="ekas-dash-cards">{chart.points.map(item => <li key={item.id}><p>{item.label}</p><p>{item.display}</p><p>{item.scopeDetail}</p><p>{item.sourceLabel}</p></li>)}</ul>
    <details className="ekas-dash-technical"><summary>Technical details</summary><ul>{chart.points.map(item => <li key={item.id}>{item.label}: {item.source}</li>)}</ul></details>
  </figure>;
}
