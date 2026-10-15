import {ScreenBody} from './screens';
import {ADMIN, DATA, DEVELOP, INSIGHTS} from './console';
import {useEkas, type Screen} from './store';

const groups:{label:string;screen:Screen;items:{id:Screen;label:string}[]}[]=[
 {label:'Insights',screen:'home',items:INSIGHTS},
 {label:'Data',screen:'objects',items:DATA},
 {label:'Develop',screen:'devhome',items:DEVELOP},
 {label:'Admin',screen:'users',items:ADMIN},
];

/** Engineering capabilities inside Administration. No second header, sidebar, or library question box. */
export function EngineeringDesk(){
 const screen=useEkas(s=>s.screen);
 return <section aria-label="Engineering tools">
  <h1>Administration</h1>
  <p>Engineering tools for this session. They read the same accepted conversation and do not open a second application.</p>
  <nav aria-label="Engineering destinations">{groups.map(group=><button key={group.label} aria-current={screen===group.screen?'page':undefined} onClick={()=>useEkas.getState().go(group.screen)}>{group.label}</button>)}</nav>
  {groups.map(group=><details key={group.label}><summary>{group.label} screens</summary>{group.items.map(item=><button key={item.id} aria-current={screen===item.id?'page':undefined} onClick={()=>useEkas.getState().go(item.id)}>{item.label}</button>)}</details>)}
  <ScreenBody/>
 </section>;
}
