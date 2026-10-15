// @vitest-environment jsdom
import {act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {describe,it,expect} from 'vitest';
import {LineageInspector} from './LineageInspector';
import {prebuiltSnapshots} from './model';
function Harness(){const [continued,setContinued]=useState('');return <><output>Baseline Line 03 / 6 Oct; {continued}</output><LineageInspector input={{scope:'Line 03',asOf:'2026-10-06T14:45:00Z',metric:'oee',view:'Decomposition',turn:{id:'saved-1',q:'Why feeder jams?',a:'Captured response',scope:'Line 03',asOf:'2026-10-06T14:45:00Z'},caseState:prebuiltSnapshots().approved}} onNavigate={()=>{}} onContinue={n=>setContinued(n.id+' / '+n.context.scope+' / '+n.context.asOf)}/></>}
describe('substantive lineage inspector',()=>{
 it('shows typed details and scoped continuation while preserving baseline',()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;const host=document.createElement('div'),root=createRoot(host);act(()=>root.render(<Harness/>));const click=(label:string)=>act(()=>Array.from(host.querySelectorAll('button')).find(b=>b.textContent===label)!.click());click('Sources');expect(host.querySelector('.lineage-details')!.textContent).toContain('PFMEA-030@FIC-C');expect(host.querySelector('.lineage-details')!.textContent).toContain('NOTE-2402');click('Finding');expect(host.querySelector('.lineage-details')!.textContent).toContain('not a proven root cause');expect(host.querySelector('output')!.textContent).toBe('Baseline Line 03 / 6 Oct; ');click('Continue from Finding');expect(host.querySelector('output')!.textContent).toContain('saved-1:finding / Line 03 / 2026-10-06T14:45:00Z');click('Result table');expect(host.querySelector('table')!.textContent).toContain('480');expect(host.querySelector('table')!.textContent).toContain('630');act(()=>root.unmount());});
});
