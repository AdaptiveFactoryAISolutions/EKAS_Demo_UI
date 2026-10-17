# End-user guide — EKAS DEMO RC1

This guide matches the chat-first plant shell in RC1 (`63ccec742c73b824c7c99c5ee1ba0a3e689801b6`). The figures are synthetic. They are not plant actuals.

## Start in Chat

Open the app. The first screen is **Chat**. The context bar names the plant, shift, and whether the data is synthetic. Ask a question in **Ask EKAS**.

Enter sends the question. Shift+Enter stays in the composer. Send stays disabled until the question has text. **New conversation** starts a blank thread and keeps the previous one.

Saved threads are under **Details**, then **Saved conversation history**. Open one to continue its investigation. Reload keeps the current thread.

## Supporting views

The same conversation and case are available from the sidebar:

- **Dashboards** — Plant operations, and Production and OEE. A selection updates the shared context. **Why?** returns to Chat on that context. **Investigate** opens that case.
- **Investigations** — the current case and the next recorded step.
- **Improvements** — the current shared case, when one is open.
- **Knowledge** — controlled sources for the selected case.
- **Evidence and investigation** on a reply opens the captured evidence. Escape closes it.

On a phone, **Menu** opens the sidebar. Escape closes it.

## A case

The operational journeys start from ordinary questions, including “We missed our production goal.”, “Investigate speed.”, and “Investigate quality.” The investigation shows the next step in plain language: hypothesis, owner, authorization, performed work, safety, verification, sustainment, and reopen. Each step is a separate record. Approval is not performed work. Acceptance is not assumed.

## Copy and export

A plant reply offers **Copy answer** and **Export captured evidence**. The export is a JSON capture of that reply and is labeled synthetic. Plant Chat does not offer print. If the clipboard is blocked, the reply says to select and copy the text.

## Appearance

Light is the default once the shell is showing. **More**, then **Use dark appearance**, switches the presentation. **Use light appearance** switches back. The theme does not change the manufacturing record.

## What this demo will not do

It will not invent a cause, an approval, performed work, or a verified saving. A Plant Review discovery that lacks those records says so. A connected backend is not part of this local demo; see the backend gap handoff.
