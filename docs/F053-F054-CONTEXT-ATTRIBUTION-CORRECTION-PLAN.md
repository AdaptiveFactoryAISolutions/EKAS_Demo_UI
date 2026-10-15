# F053/F054 confirmed context and attribution gaps

Native report: RC-4B63F361-F051-ONWARD-CHECKPOINT.md. Current source remains immutable while full4b63 validation runs. Batch these actual gaps with F016 only after terminal.

F053 root mechanism: Viz headline/no-group path returns before its normal Result qualification block. A presentation Dialog containing this result therefore omits actual query fixture and cutoff, even though chart slides show their qualification. Factor the existing qualification into a shared rendered value, preserving its normal units/scope/filter wording and adding the actual fixture/context version. Include it in headline and empty as well as chart paths. Regression must inspect the actual Dialog subtree, not dimmed underlying content, preserve numeric values/denominators and check unavailable remains unavailable.

F054 root mechanism: Comment currently stores only id,boardId,text,mark; neither actor nor time exists to display. Add optional versioned local attribution to new normal comments: exact current local display name, selected fictional actor role, local ISO creation time, synthetic=true/authenticated=false. This records a local simulated author, not an authenticated human/backend grant. Render actual comment ID and board ID; do not invent a thread identifier. Empty text still creates nothing.

Existing comments, including bundled seeds and earlier user-created records, retain original bytes. If attribution is absent, show Actor not recorded / Time not recorded. Do not backfill from board owner/current profile or infer timestamps. Capture new attribution atomically with new comment; later profile/role changes do not rewrite it. Validate optional new metadata shape on persistence restore; old rows remain compatible.

Regressions: normal Question and Useful creates distinct IDs with actual creation-time local attribution; empty guard; exact board association; acknowledged persistence and reload; changed current profile/role leaves original attribution intact; legacy unknown remains unknown. F053 real headline inside actual presentation Dialog shows fixture/cutoff/units and preserves data; empty/missing values remain qualified.

After RED/GREEN run related Guide/Board/presentation/persistence tests, typecheck and builds serially. Prepare a new isolated candidate for independent F016/F053/F054 retest, preserving mock18344/18346 and all live/old snapshots. No paid call or actual backend/security change. Batch further actual findings before another full-suite restart.
