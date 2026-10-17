# Build Method, Engineering Quality, and Known Risks

This page records two things that have to stay together: what EKAS is and why it was built this way, and how an experienced engineering team can improve the internals without changing the product people already accepted.

## What was built, and why

EKAS UI is a chat-first governed manufacturing decision system. A plant leader asks a question, EKAS answers from declared synthetic evidence, and the next question stays on that same case, metric, and cutoff. It is not a generic business-intelligence dashboard. Dashboards, evidence, verification, and sustainment exist to support that conversation. They do not replace it.

The product rules that later refactors have to keep:

- The conversation is the place a decision starts. A chart or scorecard does not silently choose a different case.
- Numbers stay tied to their source, scope, and cutoff. A plant shortfall of 150 good units is not the same fact as Line 03's 138-unit contribution.
- Missing evidence stays missing. EKAS does not fill a gap with a neighboring case, a monthly fixture, or a guessed owner.
- Approval, performed work, verification, and sustainment stay separate steps.
- The connected backend stays fail-closed until that backend actually implements the investigation contract. The demo does not pretend a live plant connection exists.
- Historical replies stay byte-stable. A later policy does not rewrite an earlier saved answer.

## How this UI was built

The EKAS UI was developed through an AI-assisted iterative process using ChatGPT, Cursor, and other coding agents. People set the manufacturing rules, reviewed the answers in a browser, and rejected results that were numerically or conversationally wrong. Agents wrote and revised the implementation under that review.

The build used repeated browser acceptance, trust tests, journey tests, release candidates, independent review, and regression closure. Each release candidate froze a source tree, a build, and a test result. RC1 recorded the product. RC2 corrected test expectations without changing that product. RC3 corrects one conversational defect: the pronoun "it" now follows the focus the previous answer actually recommended. RC2 stays frozen. RC3 is a new freeze.

That method caught real failures. It also has a limit. A test can lock the wrong behavior if the assertion was written to match the code instead of the plant leader's question. RC3 exists because an older journey test treated "Investigate it." as Quality loss after Plant Review had already named the feeder-jam plan miss. The visible recommendation and the router disagreed. The correction uses the existing conversation context. It does not add a feeder-jam special case.

## Known risks of this kind of code

AI-generated code has known historical risks: over-complexity, duplicated logic, incorrect workflows, stale assumptions, overfitting to tests, and weak maintainability.

Those risks are present here and should be read plainly:

- Routing, presentation, and validation are dense. Several policies live in long functions so that an older saved conversation can be replayed exactly. That density is hard to change safely.
- Similar decisions are expressed in more than one place: the scorecard, the stored answer, and the router. RC3's defect was those three drifting apart.
- Some workflows grew by adding another policy version rather than replacing the previous one. That preserves history. It also leaves stale branches in the same file.
- A passing test can overfit a fixture. The Northworks day, the three cases, and the fixed cutoff are synthetic. They prove this demo's rules. They do not prove a new plant's data.
- Passing functional tests does not by itself prove production-quality architecture. A green suite shows that the accepted scenarios still behave. It does not show that the structure is the one a team should keep for the next five years.

## What has to happen before production adoption

Before production adoption, the exact frontend should receive an experienced senior frontend and software-engineering review. That review should start from the frozen RC that independent approval names, not from a later unreleased edit.

The reviewer should be free to recommend restructuring: splitting the router, separating presentation from decision, reducing duplicated policy branches, and making the referent rules easier to see. Any recommended refactoring must preserve all accepted features, workflows, calculations, evidence rules, security boundaries, and user behavior.

Protected engineering principles:

"Improve the implementation without losing the product."

"Refactoring is allowed; feature or governance regression is not."

A safe internal change keeps every accepted answer, number, refusal, and security boundary. It does not "clean up" a refusal into a guess, collapse the 150-unit plant gap into the 138-unit line contribution, or make a pronoun pick whichever case happens to be first. Where a sentence is unclear, the reviewer should add a test that names the plant behavior, then change the implementation until that test and the existing suite both pass.

## Handoff boundary

This page is part of the engineering handoff. It does not mark the demo complete, does not verify the live backend, and does not replace independent approval. Human gates still sit in front of any production claim: a bounded provider test that Patrick runs, an unaided plant-leader rehearsal, the senior engineering review above, and a fresh independent approval of one exact build. The wiki and the handoff lock to that build, not to a moving workspace.
