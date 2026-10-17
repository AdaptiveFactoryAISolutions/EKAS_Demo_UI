// @vitest-environment jsdom
import {it, expect, vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {commitWhileDomOpen, commitWhilePageLive, usePageLifetime} from './pageLifetime';

it('commits while the page is mounted and skips after unmount or a closed DOM', async () => {
  const seen: string[] = [];
  function Probe() {
    const live = usePageLifetime();
    return <button onClick={() => commitWhilePageLive(live, () => seen.push('click'))}>Go</button>;
  }
  const host = document.createElement('div');
  const root = createRoot(host);
  await act(async () => root.render(<Probe/>));
  const live = {current: true};
  commitWhilePageLive(live, () => seen.push('direct'));
  commitWhilePageLive({current: false}, () => seen.push('unmounted'));
  await act(async () => host.querySelector('button')!.click());
  await act(async () => root.unmount());
  vi.stubGlobal('window', undefined);
  commitWhilePageLive(live, () => seen.push('closed'));
  commitWhileDomOpen(() => seen.push('store'));
  vi.unstubAllGlobals();
  expect(seen).toEqual(['direct', 'click']);
});

it('does not swallow an exception from a live commit', () => {
  expect(() => commitWhilePageLive({current: true}, () => { throw new Error('visible'); })).toThrow('visible');
});
