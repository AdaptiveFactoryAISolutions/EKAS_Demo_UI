# Demo architecture and service boundary — EKAS DEMO RC1

EKAS DEMO RC1 is one chat-first plant shell. Dashboards, Investigations, Evidence, Improvements, and Knowledge are views of the same conversation and case. The shell grid, navigation labels, and chat composer are frozen.

Three runtime states stay separate:

1. **Local synthetic demo.** The browser manufacturing service answers from authored fixtures. This is the demo a plant leader can run without a provider key and without the production backend.
2. **Local admin/provider session.** The demo server holds owner auth, a session credential, settings, and a budget guard. Rehearsal uses a mock provider. A real provider call is a separate, explicit action.
3. **Connected EKAS backend.** Current `EKAS_Platform_v2` main `473bdc0d2458fcffdbe516d220d4f88bcb2f1916` does not implement the investigation, case, and metric contract. The adapter fails closed. This state is a deferred production dependency.

Presentation roles in the demo are not backend principals. Backend presentation labels that were read on current main are operator, supervisor, plant manager, and continuous improvement engineer.

Theme is `document.documentElement.dataset.theme` only. Light is the default. Dark is presentation. Neither theme writes a manufacturing fact.

No new feature, architecture, or scope belongs in this release candidate.
