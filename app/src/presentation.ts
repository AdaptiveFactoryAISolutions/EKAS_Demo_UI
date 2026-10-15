import type {GuideState} from './guideModel';
export const introductionVisible=(state:GuideState,open:boolean)=>state.status==='unseen'||open;
export const dismissIntroduction=(state:GuideState):GuideState=>({...state,status:state.status==='unseen'?'skipped':state.status==='active'?'paused':state.status});
export const humanTime=(value:string)=>{const d=new Date(value);return Number.isNaN(d.getTime())?'Time not captured':new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'UTC'}).format(d)+' UTC'};
// Native Dashboards GUI rows, not a CSS shrink of the chart canvases.
export function fitBoardRows(options:any,compact:boolean){if(!compact)return options;return {...options,gui:{...options.gui,layouts:options.gui.layouts.map((layout:any)=>({...layout,rows:layout.rows.flatMap((row:any)=>row.cells?.length>1?row.cells.map((cell:any,i:number)=>({...row,id:row.id?row.id+'-mobile-'+i:undefined,cells:[{...cell,width:undefined}]})):[{...row,cells:row.cells?.map((cell:any)=>({...cell,width:undefined}))}])}))}}}
