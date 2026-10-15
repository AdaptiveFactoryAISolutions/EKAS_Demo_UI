// @vitest-environment jsdom
import {afterEach,beforeEach,describe,it,expect} from 'vitest';
import {act,useState} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {Refinement} from './Refinement';
import {namespaceKey} from './experience';
import type {MetricKey} from './model';
let root:Root,container:HTMLDivElement;
function Harness(){const [current,setCurrent]=useState<{metric:MetricKey,view:string}>(()=>JSON.parse(localStorage.getItem('test.applied')||'{"metric":"oee","view":"Decomposition"}'));return <><output data-chart="current">{current.metric} / {current.view}</output><Refinement scope="Plant" metric={current.metric} view={current.view} onApply={(metric,view)=>{setCurrent({metric,view});localStorage.setItem('test.applied',JSON.stringify({metric,view}))}} onScope={()=>{}} turns={[]} onContinue={()=>{}} onRefresh={()=>{}}/></>}
function click(label:string){const button=Array.from(container.querySelectorAll('button')).find(b=>b.textContent===label);expect(button,'missing '+label).toBeTruthy();act(()=>button!.click())}
function changeChart(value:string){const select=Array.from(container.querySelectorAll('label')).find(l=>l.textContent?.startsWith('Chart '))!.querySelector('select')!;act(()=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}))})}
function chartSelector(){return Array.from(container.querySelectorAll('label')).find(l=>l.textContent?.startsWith('Chart '))!.querySelector('select')!.value}
function mount(){act(()=>root.render(<Harness/>))}
function open(){click(container.textContent?.includes('Open studio')?'Open studio':'Adjust chart')}
function applyCompare(){open();changeChart('Compare');click('Apply new view version')}
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;localStorage.clear();container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);mount()});
afterEach(()=>{act(()=>root.unmount());container.remove();localStorage.clear()});
describe('chart adjustment synchronization',()=>{
 it('Undo synchronizes the still-open selector with the restored chart',()=>{applyCompare();open();expect(chartSelector()).toBe('Compare');click('Undo view');expect(container.querySelector('output')!.textContent).toBe('oee / Decomposition');expect(chartSelector()).toBe('Decomposition');});
 it('Cancel discards a draft and reopening shows the applied chart',()=>{open();changeChart('Compare');click('Cancel');expect(container.querySelector('output')!.textContent).toBe('oee / Decomposition');open();expect(chartSelector()).toBe('Decomposition');});
 it('reopening follows the most recently applied chart',()=>{applyCompare();open();expect(chartSelector()).toBe('Compare');expect(container.querySelector('output')!.textContent).toBe('oee / Compare');});
 it('reload after Undo retains the restored chart and undo stack',()=>{applyCompare();open();click('Undo view');act(()=>root.unmount());root=createRoot(container);mount();open();expect(chartSelector()).toBe('Decomposition');expect(container.querySelector('output')!.textContent).toBe('oee / Decomposition');expect(JSON.parse(localStorage.getItem(namespaceKey('presentation.versions'))!)).toEqual([]);});
});
it('Apply records an inspectable presentation version and Cancel records none',()=>{applyCompare();const summary=Array.from(container.querySelectorAll('summary')).find(s=>s.textContent?.startsWith('Presentation versions'));expect(summary).toBeTruthy();expect(summary!.parentElement!.textContent).toContain('Apply · oee / Compare');open();changeChart('Table');click('Cancel');expect(JSON.parse(localStorage.getItem(namespaceKey('presentation.log'))!)).toHaveLength(1);});
