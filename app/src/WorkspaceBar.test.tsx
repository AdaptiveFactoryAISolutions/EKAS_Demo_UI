// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {describe,it,expect,vi} from 'vitest';
import {WorkspaceBar} from './WorkspaceBar';
import {workspaceMatches} from './workspaceSearch';
import {reviewStoragePrefix} from './experience';
import type {ConversationBook} from './conversationBook';
const book:ConversationBook={activeId:'old',records:[{id:'old',name:'Captured feeder investigation',named:true,archived:false,snapshot:{turns:[{q:'Why jam?',a:'Guide wear remains uncertain',asOf:'2026-10-06T14:45:00Z',scope:'Line 03'}]}},{id:'archived',name:'Archived feeder investigation',named:true,archived:true,snapshot:{turns:[]}}]};
describe('template workspace navigation',()=>{
 it('finds captured answer text without resurrecting archived records or changing snapshots',()=>{const before=JSON.stringify(book);expect(workspaceMatches(book,'uncertain').filter(x=>x.kind==='conversation').map(x=>x.id)).toEqual(['old']);expect(workspaceMatches(book,'feeder').some(x=>x.id==='archived')).toBe(false);expect(JSON.stringify(book)).toBe(before)});
 it('opens by keyboard and routes the exact captured conversation, with independent search state',()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;const host=document.createElement('div');document.body.append(host);const root=createRoot(host),onConversation=vi.fn();act(()=>root.render(<WorkspaceBar page="Home" book={book} onArea={()=>{}} onConversation={onConversation} onJourney={()=>{}}/>));expect(host.querySelector('[aria-current=page]')?.textContent).toBe('Brief');act(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true})));expect(host.querySelector('dialog')?.hasAttribute('open')).toBe(true);expect(document.activeElement).toBe(host.querySelector('input'));act(()=>Array.from(host.querySelectorAll('.workspace-search-results button')).find(b=>b.textContent?.includes('Captured feeder investigation'))!.dispatchEvent(new MouseEvent('click',{bubbles:true})));expect(onConversation).toHaveBeenCalledWith('old');expect(host.querySelector('dialog')?.hasAttribute('open')).toBe(false);act(()=>root.unmount());host.remove()});
});

it('isolates staged review storage and keeps the accepted Main namespace on cutover',()=>{expect(reviewStoragePrefix('/ekas-review/')).toBe('template-review.');expect(reviewStoragePrefix('/ekas/')).toBe('');});
