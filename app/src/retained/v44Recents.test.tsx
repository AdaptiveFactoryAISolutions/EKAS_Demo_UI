// @vitest-environment jsdom
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
vi.mock('./viz',()=>({Viz:()=>null}));
import {ScreenBody} from './screens';
import {useEkas} from './store';

it('keeps recent titles separate from readable wrapping actions at narrow widths',async()=>{
 await useEkas.persist.rehydrate();(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 const before=useEkas.getState(),host=document.createElement('div'),root=createRoot(host);
 try{
  await act(async()=>{useEkas.setState({screen:'home'});root.render(<ScreenBody/>)});
  const rows=[...host.querySelectorAll('.retained-recent-row')];expect(rows.length).toBeGreaterThan(0);
  for(const row of rows){
   expect(row.querySelector(':scope > .retained-recent-title')).not.toBeNull();
   const actions=row.querySelector(':scope > .retained-recent-actions')!;
   expect([...actions.querySelectorAll('button')].map(b=>b.textContent)).toEqual([expect.stringMatching(/^Share /),expect.stringMatching(/^(Unfavorite|Favorite)$/),'Remove from library','Schedule']);
  }
  const row=rows[0],favorite=[...row.querySelectorAll<HTMLButtonElement>('button')].find(b=>/^(Unfavorite|Favorite)$/.test(b.textContent||''))!;
  const oldLabel=favorite.textContent;await act(async()=>favorite.click());expect(favorite.textContent).not.toBe(oldLabel);
  await act(async()=>favorite.click());expect(favorite.textContent).toBe(oldLabel);
 }finally{await act(async()=>root.unmount());useEkas.setState(before)}
 const css=readFileSync('src/retained/retained.css','utf8');
 expect(css).toMatch(/\.retained-recent-actions\s*\{[^}]*flex-wrap:wrap/);
 expect(css).toMatch(/\.retained-recent-actions>button\s*\{[^}]*flex:none[^}]*white-space:nowrap[^}]*overflow-wrap:normal/);
});
