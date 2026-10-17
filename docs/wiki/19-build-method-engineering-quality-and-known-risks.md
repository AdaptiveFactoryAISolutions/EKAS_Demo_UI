# 19 Build method, engineering quality, and known risks

The EKAS UI was built with an AI-assisted process. ChatGPT, Cursor, Anthropic, and other coding agents wrote and revised implementation. That assistance sped up implementation. It also left the risks below. A passing suite does not erase them.

The product goal was chat-first governed manufacturing decision intelligence, not a generic BI shell.

The build used repeated browser acceptance, trust tests, journey tests, release candidates, independent review, and regression closure. RC3 is source `45568c575a00a8810b661929624995ec24e6de1e`.

## Known risks of the AI-assisted code

- Bloated code
- Duplicated logic
- Incorrect assumptions
- Overfitting to tests
- Excessive abstraction
- Stale architecture
- Inconsistent workflows
- Maintainability problems

Historical versions of the same warning also named incorrect workflows and weak maintainability. Those are the same family of risk.

Passing functional tests does not by itself prove production-quality architecture. Before production adoption, the exact frontend should receive an experienced senior frontend and software-engineering review. The packet for that review is `docs/wp6/PHASE-9-ENGINEERING-REVIEW-PACKET.md`. It has not been filled in.

## Controls already used

- Trust tests
- Browser acceptance
- Frozen shell
- WP4 journeys
- Dashboard acceptance
- Clean extraction
- Exact hashes
- Independent review
- Senior engineering review, which is prepared and not yet returned
- Full regression
- Behavioral invariants, including the 150 and 138 figures, the referent rules, and the live refusals

## Protected principles

"Improve the implementation without losing the product."

"Refactoring is allowed; feature or governance regression is not."

## What refactoring must preserve

- Chat-first behavior
- Calculations
- The 150 and 138 figures
- Context contract
- Evidence and provenance
- Case lifecycle
- Authorization
- Performed work
- Verification
- Sustain
- Dashboards
- Mobile layout
- Accessibility
- Security boundaries
- History behavior
- Backend fail-closed behavior

Any recommended refactoring must preserve the accepted features, workflows, calculations, evidence rules, security boundaries, and user behavior. The Wiki’s job is to hold both what was built and why, and how an experienced team can improve the internals without changing EKAS behavior.
