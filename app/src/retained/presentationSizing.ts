import type {ResponsiveOptions} from 'highcharts';
export function presentationChartRules(axes:number):ResponsiveOptions {
 return {rules:[{condition:{maxWidth:480},chartOptions:{
 chart:{height:320},title:{style:{fontSize:'14px'}},legend:{itemStyle:{fontSize:'12px'}},
 xAxis:{labels:{style:{fontSize:'12px'}}},
 yAxis:Array.from({length:axes},()=>({title:{margin:4,style:{fontSize:'12px'}},labels:{style:{fontSize:'12px'}}})),
 exporting:{buttons:{contextButton:{width:44,height:44}}}
 }}]};
}
