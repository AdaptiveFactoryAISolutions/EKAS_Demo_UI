# Phase 9 — senior engineering review packet

Status: **NOT RUN**. A senior frontend and software engineer reviews the exact RC3 frontend. This packet lists the questions. It does not answer them with a verdict, and it does not change features during the review.

Source: `45568c575a00a8810b661929624995ec24e6de1e`. Wiki page 19 states how the UI was built and which risks are already known.

## Review the implementation

- Component architecture
- Separation of concerns
- State ownership
- Domain versus presentation
- Adapter separation from the plant UI
- Duplicated logic
- Oversized modules
- Dependencies
- Dead code
- Performance
- Browser and storage assumptions
- Security boundaries
- Test quality, including tests that only repeat the implementation
- Accessibility
- Maintainability
- Abstraction that hides a rule instead of naming it
- Complexity that came from AI-assisted generation
- Naming
- Documentation against the running UI
- Build and package contents

## What a recommended refactor must preserve

Chat-first behavior, calculations, the 150 and 138 figures, the context contract, evidence and provenance, case lifecycle, authorization, performed work, verification, sustain, dashboards, mobile layout, accessibility, security boundaries, history, and backend fail-closed behavior.

Protected sentences:

"Improve the implementation without losing the product."

"Refactoring is allowed; feature or governance regression is not."

## Verdict, left blank

The reviewer writes one of:

- APPROVE
- APPROVE WITH REQUIRED REFACTORING
- REJECT FOR PRODUCTION

No feature change is made as part of filling this packet. This repository does not select a verdict for the reviewer.
