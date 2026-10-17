# 05 Frontend architecture

The plant UI is a React application in `app/src`. Chat, dashboards, investigations, evidence, and admin are one shell. The manufacturing service in the browser is the demo authority. A server transport is optional and, in live mode, fail-closed.

```mermaid
flowchart TB
  subgraph shell [Shell]
    nav[Navigation and theme]
    context[Context bar]
    composer[Composer]
  end
  chat[Chat replies]
  dash[Dashboards]
  inv[Investigation summary]
  ev[Evidence dialog]
  admin[Admin AI]
  router[conversation.ts router]
  service[Manufacturing service]
  store[IndexedDB and local preferences]
  shell --> chat
  shell --> dash
  shell --> inv
  composer --> router
  router --> service
  service --> chat
  service --> store
  chat --> ev
  dash --> context
  inv --> context
  admin --> service
```

## Shell

`CanonicalWorkspace` is the plant shell. Areas are Chat, Dashboards, Investigations, Improvements, and Knowledge. The header carries Notices, Help, Profile, and More. More holds the appearance control. New conversation starts a thread and clears the current referent.

## Chat

A turn is a question plus a saved answer. The reply component renders the plant text, the scorecard when the intent is an audit review, and the evidence control. Presentation formatting of timestamps happens at render. The stored instant does not change.

## Context contract

The context bar shows plant, line, machine, job, period, and case. Those fields come from the conversation context the router wrote. Dashboard selection writes the same context. Chat and Investigation read it back. The contract is one object, not a copy on each screen.

```mermaid
flowchart LR
  utterance[Utterance] --> router[Router]
  router --> ctx[Conversation context]
  ctx --> bar[Context bar]
  ctx --> reply[Reply]
  ctx --> dash[Dashboard selection]
  dash --> ctx
  reply --> next[Next pronoun]
  next --> router
```

## Conversation state

Each conversation has an id, a version, turns, and the current context. Policy version 8 is stamped on new turns. Older saved turns keep their policy and replay the behavior they were saved with. Policy 7 still clarifies a bare pronoun after Plant Review. `validConversation` stays fail-closed for history that does not match the rules.

## Investigation state

An open case has a stage and a next action. Owner, hypothesis, recommendation, authorization, performed work, verification, sustain, and reopen are stages. The summary region exposes the next control. Cycle 2 after reopen does not inherit cycle 1 proof.

```mermaid
stateDiagram-v2
  [*] --> Open
  Open --> Owned
  Owned --> Hypothesis
  Hypothesis --> Recommended
  Recommended --> Authorized
  Authorized --> Performed
  Performed --> Verified
  Verified --> Sustained
  Sustained --> Reopened
  Reopened --> Hypothesis
```

## Evidence model

A reply stores the answer, the as-of instant, the source ids, and the qualification. Evidence and investigation shows the plain lead, the case state, the next action, the scope, and technical details. Technical details include the raw UTC instant. The normal paragraph shows the readable time.

```mermaid
flowchart LR
  turn[Saved turn] --> lead[Plain-language lead]
  turn --> tech[Technical details]
  tech --> iso[Exact UTC instant]
  lead --> human[Readable plant time]
  turn --> sources[Source ids]
```

## Dashboards

Plant Operations and Production & OEE use Highcharts. They read the governed gaps. They do not create a second set of totals. Selecting the plant plan miss or a line updates the shared context.

## Metric registry

Metrics have a definition, a unit, a target, and a scope. OEE, availability, performance, quality, FPY, and downtime are not interchangeable. A question that names one does not silently return another. Gaps without an approved target are not ranked as actionable.

## Persistence

Demo conversations persist in IndexedDB. Appearance persists as a local preference. A reload restores the conversation and its referent. A new conversation does not carry the previous referent. The provider key, when one exists, is server-session memory only. It is not in IndexedDB.

## Theme

Light is the default on a fresh profile. Dark is an explicit choice. Both use the same content.

## Role and navigation

The fictional chat role is manager, supervisor, maintenance, safety, or viewer. That role does not grant Admin. Admin requires the local owner session. Navigation does not hide a failed live capability behind an empty chart. The refusal is a sentence.

## End-to-end governed request flow

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

The sections above describe the running demo shell. This sequence is the governed request flow the architecture requires when a question depends on source systems. `Governor` and `ContextContract` are names in the product goal. This UI does not import either type. Local command guards are the demo stand-in, as recorded in `docs/integration/BACKEND-CONTRACT.md`. Orchestration across MES, ERP, CMMS, QMS, SCADA, and PLM is not a running capability.

AI does not own manufacturing truth. The model may interpret and explain. Governed context, evidence, source records, authorization, case state and verification remain authoritative.

```mermaid
sequenceDiagram
  participant Leader as Plant Leader
  participant UI as EKAS Chat UI
  participant Gov as Governor / ContextContract
  participant Orch as Orchestration / Reasoning
  participant Adapter as Backend Adapter
  participant Sources as Source Systems
  participant Evidence as Evidence / Case State
  participant Answer as Answer / Action / Verification
  Leader->>UI: Ask
  UI->>Gov: Bind governed context
  Gov->>Orch: Context the governor allows
  Orch->>Adapter: Request for normalized EKAS records
  Adapter->>Sources: Read the system of record
  Sources-->>Adapter: Source records
  Adapter-->>Evidence: Normalized evidence and case state
  Evidence-->>Answer: Authoritative result
  Answer-->>UI: Answer, action, or verification
  UI-->>Leader: What the governed record supports
```

A model sentence stays inside Orchestration / Reasoning. It does not become a source record, an authorization, a case-state change, or a verification. Those remain on Evidence / Case State and on Answer / Action / Verification.
