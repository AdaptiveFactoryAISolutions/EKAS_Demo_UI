# V54 saved-answer identity correction — provisional

Independent V53 P1: Create → Answer cleared query tokens while preserving openedAnswerId; Save silently replaced the original OEE answer UUID. Source: /home/pat/Documents/Codex/2026-10-11/task/FINAL-ORDINARY-UI-REVIEW.md, FINAL-V53-CREATE-ANSWER-OVERWRITES-SAVED. Reviewer restored baseline and legacy entries exactly at05:23:29.002Z; all157incoming recovery archives retained (161final). Owned-tab close was denied; no retry or workaround.

V54 introduces one explicit new-answer transition: detached saved identity, cloned query and cleared query undo/redo/selection state. Create uses it. Board tile Open and edit-shared-local-copy also detach unrelated identities. Saved-answer opens and Reset clone stored query definitions. Save updates an identity only if an existing noncanonical answer owns it; otherwise it creates a new UUID. Repeated Save updates the newly created record. Explicit editing of an opened saved answer remains deliberate replacement of that exact record. No Save As control exists.

Tests reproduce Create after both viewing and uncommitted editing, then check independent UUIDs, unchanged saved original, route transitions, chart/filter state, repeated Save, persistence reload and three records. They also verify explicit edit retains exact saved identity and preserves the other records. Both tests failed against V53 on the stale original UUID before the source correction.

V54 is frozen for independent review only; no deployment or native acceptance is implied. No browser actions, credentials, provider calls, spending or security policy changes were performed. The separately merged Dot candidate must receive the same fix after validation while preserving its existing held gates.
