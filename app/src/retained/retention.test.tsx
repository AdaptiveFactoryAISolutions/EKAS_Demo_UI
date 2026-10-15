// @vitest-environment jsdom
import {describe,it,expect,vi,afterEach} from 'vitest';
import React,{act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
vi.mock('./viz',()=>({Viz:({rows}:any)=><div data-testid="canonical-view">{rows.map((r:any)=>r.key).join(', ')}</div>}));
import inventory from '../../../docs/FEATURE-RETENTION.json';
import {ScreenBody} from './screens';
import {useEkas,type Screen} from './store';
let root:Root|undefined;const host=document.createElement('div');document.body.append(host);(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
afterEach(()=>{act(()=>root?.unmount());root=undefined});
describe('retained template layouts and core manufacturing workflows',()=>{
 it('renders all42 source screen paths with adapted local content',()=>{root=createRoot(host);expect(inventory.screens).toHaveLength(42);for(const screen of inventory.screens){act(()=>{useEkas.setState({screen:screen.id as Screen});root!.render(<ScreenBody/>)});expect(host.textContent?.trim().length,screen.id).toBeGreaterThan(0)}});
 it('saves exact answers, creates boards, pins tiles, and preserves undo/redo query state',()=>{const s=useEkas.getState(),original=s.query;act(()=>s.setQuery({...original,title:'Line review',columns:['oee','line']}));act(()=>useEkas.getState().saveAnswer());const answer=useEkas.getState().answers[0];expect(answer.query.columns).toEqual(['oee','line']);act(()=>useEkas.getState().saveBoard('Test manufacturing board'));const board=useEkas.getState().boards[0];act(()=>useEkas.getState().pinTo(board.id));expect(useEkas.getState().boards[0].tiles[0].query).toEqual(answer.query);act(()=>useEkas.getState().patchQuery({columns:['goodUnits','line']}));act(()=>useEkas.getState().undo());expect(useEkas.getState().query.columns).toEqual(['oee','line']);act(()=>useEkas.getState().redo());expect(useEkas.getState().query.columns).toEqual(['goodUnits','line'])});
 it('does not load a neighboring board when an exact identity is missing',()=>{root=createRoot(host);act(()=>{useEkas.setState({screen:'board',boardId:'missing-board'});root!.render(<ScreenBody/>)});expect(host.textContent).toContain('No neighboring board was loaded')});
 it('binds formerly inert object/user checkboxes to selection and export controls',()=>{root=createRoot(host);for(const screen of ['objects','users'] as const){act(()=>{useEkas.setState({screen});root!.render(<ScreenBody/>)});const box=host.querySelector<HTMLInputElement>('input[type=checkbox]')!;expect(box).toBeTruthy();act(()=>box.click());expect(box.checked).toBe(true);expect(host.textContent).toMatch(/1 (objects|simulated users) selected/);expect([...host.querySelectorAll('button')].some(b=>b.textContent?.startsWith('Export selected'))).toBe(true)}});
});
