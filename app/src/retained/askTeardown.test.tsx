// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {it, expect, vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';

async function renderAsk() {
  vi.resetModules();
  vi.stubGlobal('indexedDB', new IDBFactory());
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const unified = await import('../investigation/unified');
  const {useEkas} = await import('./store');
  const {ScreenBody} = await import('./screens');
  await useEkas.persist.rehydrate();
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => {
    useEkas.setState({screen: 'ask', askThread: [], askText: 'We missed our production goal.', manufacturingConversationId: undefined, conversationRoute: undefined, conversationId: undefined});
    root.render(<ScreenBody/>);
  });
  const run = () => [...host.querySelectorAll('button')].find(button => button.textContent === 'Run');
  return {unified, useEkas, host, root, run};
}

it('a mounted Run still saves the reply and clears the busy state', async () => {
  const {unified, host, root, run} = await renderAsk();
  const original = unified.submitUnifiedConversation;
  let release: () => void = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  let finish: () => void = () => {};
  const finished = new Promise<void>(resolve => { finish = resolve; });
  const spy = vi.spyOn(unified, 'submitUnifiedConversation').mockImplementation((async (text: string) => {
    try {
      await gate;
      return await original(text);
    } finally {
      finish();
    }
  }) as typeof original);
  try {
    expect(run()).toBeTruthy();
    await act(async () => { run()!.click(); });
    await act(async () => { await Promise.resolve(); });
    expect(host.textContent).toContain('Preparing reply');
    release();
    await finished;
    await act(async () => { await Promise.resolve(); });
    expect(host.textContent).toContain('150');
    expect(run()!.textContent).toBe('Run');
    expect((run() as HTMLButtonElement).disabled).toBe(false);
  } finally {
    spy.mockRestore();
    await act(async () => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
  }
}, 30000);

it('Run after unmount does not update Ask or throw', async () => {
  const {unified, host, root, run} = await renderAsk();
  const original = unified.submitUnifiedConversation;
  let release: () => void = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  let finish: () => void = () => {};
  const finished = new Promise<void>(resolve => { finish = resolve; });
  const spy = vi.spyOn(unified, 'submitUnifiedConversation').mockImplementation((async (text: string) => {
    try {
      await gate;
      return await original(text);
    } finally {
      finish();
    }
  }) as typeof original);
  const errors: unknown[] = [];
  const onError = (event: Event) => { errors.push(event); };
  window.addEventListener('error', onError);
  try {
    await act(async () => { run()!.click(); });
    await act(async () => { await Promise.resolve(); });
    expect(host.textContent).toContain('Preparing reply');
    await act(async () => root.unmount());
    release();
    await finished;
    await act(async () => { await Promise.resolve(); });
    expect(errors).toEqual([]);
  } finally {
    window.removeEventListener('error', onError);
    spy.mockRestore();
    host.remove();
    vi.unstubAllGlobals();
  }
}, 30000);
