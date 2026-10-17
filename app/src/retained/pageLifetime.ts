import {useEffect, useRef, type MutableRefObject} from 'react';

/** The page or the test DOM environment is gone when this binding is missing or cleared. */
export function domPageOpen(): boolean {
  return typeof window !== 'undefined';
}

/**
 * True until this component's effect cleanup. Starts true so a click in the
 * same turn as the first render can still commit. A closed DOM environment is
 * not live even when React did not run the cleanup.
 */
export function usePageLifetime(): MutableRefObject<boolean> {
  const live = useRef(true);
  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);
  return live;
}

export function pageStillLive(live: {current: boolean}): boolean {
  return live.current && domPageOpen();
}

/**
 * Run a React or DOM commit only while this page is mounted and the DOM
 * environment still exists. A closed page is a no-op. Exceptions from the
 * commit itself still propagate.
 */
export function commitWhilePageLive(live: {current: boolean}, commit: () => void): void {
  if (!pageStillLive(live)) return;
  commit();
}

/**
 * Run a store update that may notify React only while a DOM environment exists.
 * Unmount alone does not block it: retained drafts still clear after the page
 * closes and the DOM is still there. A removed DOM global skips the update
 * because notifying React would read that global.
 */
export function commitWhileDomOpen(commit: () => void): void {
  if (!domPageOpen()) return;
  commit();
}
