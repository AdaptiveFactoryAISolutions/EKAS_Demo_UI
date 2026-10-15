**The UI can become a usable, complete demo while retaining a clean connection to your EKAS backend. My recommendation is to stabilize one chat-first application, preserve the working manufacturing workflows, and place demo data and the live backend behind the same integration boundary.**

The acceptance report shows that another visual redesign alone will not solve this. The biggest problems are incorrect routing, inconsistent context, competing interfaces, and browser performance. Those must be corrected first.

This assessment is based on the attached package. Its testing was incomplete and covered the correction preview at **port 18352**, not the live-AI candidate at **18329**. It does not establish the current condition of your backend.

### 1. Establish one clear EKAS experience

Keep **Chat Home as the front door**. A user should be able to begin with:

> “Why did we miss production yesterday, which jobs caused the loss, and what should we do next?”

EKAS should answer in plain language, quantify the loss where supported, show relevant evidence, and offer a useful next action. Charts and tables should support the answer when needed.

Use this navigation:

| Area               | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| **Chat**           | Ask questions, investigate results, and continue conversations   |
| **Dashboards**     | Monitor performance through governed charts and filters          |
| **Investigations** | Review problems, evidence, hypotheses, and diagnostic tests      |
| **Improvements**   | Assign, authorize, execute, verify, and sustain actions          |
| **Knowledge**      | Find applicable documents, technician notes, and lessons learned |
| **Administration** | Configure connections, users, permissions, and AI providers      |

The current **Advanced tools** workspace should be integrated into these destinations. Preserve its capabilities, but remove the competing header, navigation, and independent question box.

**“Original training” should become a clearly named sample dataset in the data selector.** It should not look like another application or a training module.

Users must also be able to ask ordinary analytical questions without first creating an investigation or improvement case.

### 2. Fix correctness before adding features

These are release blockers:

| Problem demonstrated in the report                   | Required correction                                                | Acceptance evidence                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Natural production question returns only total units | Interpret the goal, requested explanation, and next action         | Multiple independently written questions return relevant, scoped answers |
| March 2025 silently becomes March 2026               | Preserve requested dates; disclose unavailable data                | No substituted dates, assets, metrics, or datasets                       |
| Invalid TP-S1 question poisons later turns           | Reject or clarify that request without corrupting accepted context | Next valid question succeeds immediately                                 |
| “Worst first” returns the previous order             | Apply follow-up instructions to the prior result                   | Displayed order matches the requested direction                          |
| Dataset strip contradicts the answer                 | Use one shared context across every surface                        | Chat, dashboards, evidence, history, and case views agree                |
| Typing while waiting merges commands                 | Isolate submitted messages from the next draft                     | One submission creates one request; actions never concatenate            |

**Enabling an LLM alone will not resolve these defects.** Interpretation can use AI, but accepted scope, data access, calculations, and action permissions must remain governed by EKAS.

### 3. Create one trustworthy context header

Show a compact, persistent header containing the applicable:

**Data source · Plant · Line · Machine · Job/part · Time period**

When an investigation is active, add its case and lifecycle status.

Requirements:

- All pages read the same accepted context.
- An explicit user request can change scope; EKAS acknowledges the change.
- Ambiguous changes trigger a short clarification.
- Failed requests leave the previous valid context intact.
- Existing answers retain their original scope and evidence snapshot.
- Changing datasets starts a clearly identified context rather than blending records.

This is especially important for manufacturing: a correct OEE number from the wrong shift, part revision, or plant is still an incorrect answer.

### 4. Preserve backend connectivity through a defined adapter

Use **one UI with interchangeable data providers**, rather than building a demo application that later requires conversion.

| Layer                       | Responsibility                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **EKAS UI**                 | Conversation, charts, navigation, evidence, and workflow controls                  |
| **API integration adapter** | Translate UI requests and backend responses using agreed contracts                 |
| **Demo provider**           | Serve consistent synthetic datasets and simulated workflow events                  |
| **EKAS backend provider**   | Connect to EKAS authentication, governed queries, evidence, and authorized actions |

Both providers should satisfy the same contract. The demo provider must not bypass workflow rules or embed special answers inside page components.

Before implementation, inspect the actual backend API and document these mappings:

| Contract area            | Required agreement                                                            |
| ------------------------ | ----------------------------------------------------------------------------- |
| Identity and permissions | Authenticated user, tenant, roles, permitted operations                       |
| Manufacturing scope      | Stable plant/equipment/job IDs, hierarchy, timestamps, timezone               |
| Conversation             | Conversation ID, accepted context, clarification, cancellation                |
| Analytics                | Metric definition, units, denominator, filters, freshness, incomplete results |
| Evidence                 | Source IDs, document revision, applicability, captured snapshot               |
| Workflow                 | Allowed transitions, actor authorization, version checks, audit trail         |
| Failures                 | Distinguish unavailable data, ambiguity, denied access, and service failure   |

These are proposed contract requirements, **not verified existing endpoint specifications**.

Keep provider credentials server-side. Connect live mode through the EKAS API rather than directly from the browser to SQL databases or model providers.

**Never silently fall back from the live backend to sample data.** A connection failure must remain visible.

### 5. Make manufacturing journeys complete without hidden commands

Protect the strongest part of the current build: the improvement lifecycle and its authorization gates.

Replace internal commands and hidden IDs with usable controls:

- “Select completed work order.”
- “Accept assignment.”
- “Review prerequisites.”
- “Record verification.”
- “Review safety.”
- “Accept result.”
- “Review recurrence and reopen.”

Only offer actions appropriate to the user and current state. Explain blocked actions beside the control.

Every primary journey should work from question through outcome:

| Journey                  | Required demonstration                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Production and OEE       | Plan versus actual → loss contributors → affected machines/jobs → next action               |
| Downtime and maintenance | Stop chronology → technician evidence → competing hypotheses → work order → verification    |
| Quality                  | FPY/scrap → affected part/revision/lot → containment → corrective action                    |
| Speed loss               | Comparable runs → supported loss calculation → setup/process evidence → bounded improvement |
| Knowledge                | Relevant PFMEA, standard work, setup sheet, or EC → revision and applicability              |
| Improvement management   | Ownership → authorization → work proof → verification → safety → sustainment → recurrence   |

Where the data cannot support a calculation or conclusion, explain what is missing and the next useful step. Do not repeat a generic production-gap answer.

### 6. Repair usability and session performance

Make these focused corrections:

- Dock the full composer on Chat; provide a compact contextual “Ask EKAS” entry elsewhere.
- Prevent the composer from covering forms, tables, or help.
- Show answers where the question was asked.
- Replace the raw evidence dump with a readable summary, sources, and expandable details.
- Make help page-specific and task-oriented.
- Add conversation naming, search, archive, and restore.
- Support stopping pending responses and editing/rerunning analytical questions; consequential actions require separate handling.
- Format numbers, dates, units, and percentage points consistently.
- Keep workflow panels stable after actions.

Profile the session degradation before assuming its cause. Investigate history rendering, retained state, repeated listeners, evidence payloads, and duplicate requests.

**Proposed acceptance target:** a two-hour session including at least 200 conversational turns, navigation, evidence inspection, and lifecycle actions, with no freeze or progressive slowdown. Measure local/demo response time separately from live model latency.

### 7. Complete the work in a fixed sequence

| Work package                                   | Deliverable                                                                          | Exit condition                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **WP1 — Baseline and feature preservation**    | Identify source revision, running candidate, feature inventory, and backend contract | Every inventoried feature has a destination and acceptance test |
| **WP2 — Correctness and context**              | Repair routing, scope, refusal recovery, ordering, and submission handling           | All reported correctness failures pass regression tests         |
| **WP3 — Unified shell**                        | One navigation system, shared context, integrated specialist tools                   | No competing workspace or dead question box                     |
| **WP4 — Complete journeys**                    | Usable manufacturing workflows and readable evidence                                 | New users complete journeys without hidden IDs or coaching      |
| **WP5 — Backend integration**                  | Demo and EKAS providers under the agreed contracts                                   | Same UI journeys work against available backend capabilities    |
| **WP6 — Stability and independent acceptance** | Performance, accessibility, complete feature testing, board rehearsal                | Evidence supports the release decision                          |

Do not start another broad redesign during this sequence. New scope goes into a backlog unless it closes an agreed acceptance gap.

### 8. Define “finished” so this stops becoming an endless build

The report lists **155 inventory rows: 18 passed, 23 failed, and 114 were not tested**. Some rows overlap; reconcile them into one capability register before using them as a completion percentage.

For every feature, record its location, mode, backend dependency, test, result, and evidence. Moving a feature out of the main navigation must not remove it.

Release only when:

- Every retained demo feature has been exercised, including specialist tools.
- All critical and major failures are resolved.
- Uncoached users complete the manufacturing journeys.
- Context remains consistent across pages and reloads.
- Authorization and evidence protections still pass.
- Demo, simulated, backend-connected, and unavailable capabilities are accurately identified.
- An independent browser review and two-hour board rehearsal pass on the identified release candidate.

**A fully working demo can include clearly disclosed simulations. A backend connection is complete only when the corresponding real integration has been tested.** Both should be tracked separately.

My recommendation is to use this as a **bounded completion program for the existing UI**. Preserve the working governance and manufacturing capabilities, fix correctness first, consolidate the experience, and prove backend compatibility through the same contracts used by the demo.