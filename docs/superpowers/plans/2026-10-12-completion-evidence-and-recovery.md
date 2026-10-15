# Completion evidence and recovery implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. No subagent delegation is requested.

**Goal:** Make remaining completion obligations visible and deliver durable, source-safe normal-path recovery and journey evidence without equating a scripted provider with unrestricted conversation.

**Architecture:** Keep canonical conversation/investigation state on the server. Browser recovery persists only operation identities and unsent drafts, then reads the canonical operation/result. Completion registers preserve exact requirements and separate implementation, owner checks, independent checks and whole-obligation acceptance.

**Tech Stack:** React19.2.7, TypeScript6.0.3, Vite8.2.1, Highcharts12.6.0, Dashboards4.2.0, GridLite3.2.0, existing synthetic canonical API and injected OpenAI provider boundary.

**Spec:** docs/COMPLETION-MASTER-20261011.txt; docs/UX-MASTER-36.txt; parent UX-NO-LOSS-CROSSWALK; V77 independent/native reports when supplied.

## Global constraints

- Preserve V77 immutable bytes and18224/session50461; all earlier artifacts, legacy repositories and paused original backend.
- Work only in isolated V78/task4. No live credential reads/activation/spend, actual backend/CMMS/document changes, hosting/pushes or denied-review reroutes.
- Preserve all46+36 obligations and55services/35TrueNorth/351original items plus metric/source inventory; overlap is not additive acceptance.
- Historical answers retain original timestamp/status/source versions. Approval, work, verification, causality and financial proof remain distinct.
- Scripted provider tests establish only bounded transport/workflow behavior. Mandatory unrestricted conversation remains open until independently demonstrated with authorized model access.

## Review focus

- Stop followed by reload: recover the same operation identity, not a new provider request.
- Commit succeeded but response/local indexing failed: retrieve the original result without duplicating actions or changing snapshots.
- Role/scope changes during recovery: refuse or revalidate; never auto-switch to a more privileged role.
- Missing/stale/mismatched source or unsupported scope: retain drafts and safe history; no numerical substitution.
- All-page Guide and original capabilities: role disclosure/deep links/targets must be reachable without deleting capability or claiming navigation as completed workflow.

### Task1 — completion register

- [ ] Preserve exact source texts and hashes; extract46master and36UX rows.
- [ ] Attach scoped evidence and explicit next closure procedure to every row.
- [ ] Add capability/Guide/journey/invariant/provider/docs/notices registers and known external holds.
- [ ] Validate all source counts and no dropped/duplicated requirements; save Markdown/JSON/CSV.

### Task2 — durable operation recovery

- [ ] Write failing normal HTTP UI tests for Stop/reload, delayed commit/reload, failed local indexing and role change.
- [ ] Persist operation cursor metadata only through the existing validated browser store; never store case truth or credentials there.
- [ ] Reconcile via the canonical server; preserve operation ID, original captures and draft.
- [ ] Test corrupt metadata, unavailable storage and unknown commit without automatic generation/refund/reset.

### Task3 — complete journeys and Guide

- [ ] Reconcile existing action/verification/sustain tests against all three normal/adverse journeys.
- [ ] Exercise missing normal entry counterparts via HTTP UI and role/proof gates; fix discovered defects first.
- [ ] Audit every declared page's purpose/input/recovery/actual target and all meaningful case states.
- [ ] Preserve analyst/developer capabilities and exact deep links; update procedure evidence without inventing acceptance.

### Task4 — review milestone

- [ ] Run appropriate scoped regressions, then full suite/build and compiled HTTP checks.
- [ ] Update completion register with actual results and remaining blockers, including unrestricted conversation.
- [ ] Reconcile documentation/notices and portable offline/static/editable-source/server package.
- [ ] Freeze exact identity, save provisional artifacts through Library and request independent/native review.
