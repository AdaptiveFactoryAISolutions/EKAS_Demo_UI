# F016 acknowledged feedback history reconciliation

Native evidence: evidence/native-profile-notes-4b63/REPORT.md and inspected existing F016-guide-after-unclear-revalidated.png. Storage works; Guide progress fails after Useful then Unclear.

Source mechanism: committedGuideWorkspaceReceipts projects the feedback semantic alias only when the saved audit text equals JSON.stringify(current feedback). The earlier Useful audit still exists after Unclear, but its semantic alias disappears. reconcileWalkthroughEvidence correctly treats that disappearance as missing evidence and pauses. The general reconciliation guard must remain intact.

After full4b63 validation reaches terminal, copy the prepared F016 regression into app/src, reproduce RED, then implement a narrow historical-feedback alias predicate. Only acknowledged committed audit events count. Historical feedback must contain canonical typed JSON with a valid Useful/Unclear ask value, a legitimate scoped unchanged transition, and an existing valid current preference. Retain the original action ID/transition rather than rewriting it as the current choice. Existing current-value matching and other preferences remain unchanged.

The action instruction permits either choice. Historical action evidence means the person performed a legitimate local preference save; it does not claim that Useful remains current, rate a canonical answer, train a model, or complete business work. Existing Guide baseline excludes actions predating Guide start. Role/scope/cutoff/entity guards continue to apply. If the original audit event is actually removed/trimmed, normal missing-evidence pause remains.

Regression draft: evidence/F016-FEEDBACK-RECEIPT-REGRESSION-DRAFT.tsx. Covers actual normal Guide and Useful→Unclear, committed persistence and reopen/resume, one unchanged original observation, preserved query/route/draft/history, no automatic Show-me credit, actual audit loss negative, malformed/invalid/transitionless history negative, baseline and role/scope negatives.

Do not edit the app or run this regression during the full4b63 run. Preserve all served previews. After RED/GREEN/related tests/typecheck/build, create a separately identified isolated mock for scoped independent native retest. Batch further confirmed findings before another full-suite restart. No paid calls, real keys, live backend or security changes.
