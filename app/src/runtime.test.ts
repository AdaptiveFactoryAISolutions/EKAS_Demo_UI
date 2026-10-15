import {describe,it,expect} from 'vitest';
import {restoreBoard,savedBoardOptions,resultEligibility,historyMatches} from './runtime';
describe('runtime review regressions',()=>{
 it('round trips native layout while retaining semantic axes, sources and executable callbacks',()=>{
  const click=()=>{};
  const base:any={gui:{layouts:[]},dataPool:{connectors:[{id:'shift'}]},components:[{type:'Highcharts',renderTo:'new',connector:{id:'shift',columnAssignment:[{seriesId:'measure'}]},chartOptions:{title:{text:'OEE'},yAxis:{title:{text:'OEE %'},min:0,max:100},series:[{id:'measure',name:'OEE'}],plotOptions:{series:{point:{events:{click}}}}}}]};
  const saved={snapshotId:'northworks-demo-v1',metric:'oee',selected:'Line 02',tableSorted:true,board:{gui:{layouts:[{id:'changed'}]},components:[{type:'Highcharts',renderTo:'old',chartOptions:{title:{text:'Edited title'},yAxis:{title:{text:'Values'},max:1000},series:[{name:'lost identity'}]}}]}};
  const restored=restoreBoard(base,JSON.parse(JSON.stringify(saved)),'oee');
  expect(restored.components[0].chartOptions.yAxis).toEqual(base.components[0].chartOptions.yAxis);
  expect(restored.components[0].chartOptions.series).toEqual(base.components[0].chartOptions.series);
  expect(restored.components[0].connector).toEqual(base.components[0].connector);
  expect(restored.components[0].chartOptions.plotOptions.series.point.events.click).toBe(click);
  expect(restored.components[0].chartOptions.title.text).toBe('Edited title');
  expect(restored.gui).toEqual(saved.board.gui);expect(restored.components[0].renderTo).toBe('old');
  expect(restoreBoard(base,{...saved,snapshotId:'wrong'},'oee')).toBe(base);
 });
 it('suppresses missing and qualifies stale snapshot truth without permitting decisions',()=>{
  expect(resultEligibility('Missing data','t')).toMatchObject({display:false,decision:false,status:'missing'});
  expect(resultEligibility('Stale','t')).toMatchObject({display:true,decision:false,status:'stale'});
  expect(resultEligibility('Normal','t')).toMatchObject({display:true,decision:true,status:'frozen'});
  expect(resultEligibility('Stale','t').label).toContain('t');
 });
 it('history searches only its own query',()=>{expect(historyMatches({q:'Why feeder jams?',a:'Unconfirmed'},'')).toBe(true);expect(historyMatches({q:'Why feeder jams?',a:'Unconfirmed'},'KPI-001')).toBe(false)});
});
it('restores native Grid sort state without replacing source or cell definitions',()=>{
 const base:any={components:[{type:'Grid',renderTo:'g',connector:{id:'shift'},gridOptions:{columns:[{id:'Value',cells:{format:'{value:.2f}'}}]}}]};
 const saved={snapshotId:'northworks-demo-v1',metric:'oee',board:{gui:{layouts:[]},components:[{type:'Grid',gridOptions:{columns:[{id:'Value',sorting:{order:'asc'},cells:{format:'wrong'}}]}}]}};
 const restored=restoreBoard(base,saved,'oee');expect(restored.components[0].gridOptions.columns[0].sorting.order).toBe('asc');expect(restored.components[0].gridOptions.columns[0].cells.format).toBe('{value:.2f}');
});

it('captures native Grid runtime sort and restores only governed column sorting',()=>{
 const component={
  options:{renderTo:'grid'},
  grid:{getOptions:(userOnly:boolean)=>{
   expect(userOnly).toBe(false);
   return {columns:[{id:'Good units',sorting:{order:'asc',priority:1},cells:{format:'untrusted'}}]};
  }}
 };
 const board={
  getOptions:()=>({gui:{layouts:[]},components:[{type:'Grid',renderTo:'grid',gridOptions:{columns:[{id:'Good units'}]}}]}),
  mountedComponents:[{component}]
 };
 const serialized=savedBoardOptions(board);
 const restored=restoreBoard({components:[{type:'Grid',renderTo:'grid',gridOptions:{columns:[{id:'Good units',cells:{format:'{value}'}}]}}]}, {snapshotId:'northworks-demo-v1',metric:'production',board:serialized},'production');
 expect(restored.components[0].gridOptions.columns[0]).toEqual({id:'Good units',cells:{format:'{value}'},sorting:{order:'asc',priority:1}});
});
