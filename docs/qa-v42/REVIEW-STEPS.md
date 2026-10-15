# Owned QA equivalent review steps

Open the exact new bare root `/ekas-qa-v42/` only after parent-authorized deployment, or use the portable `serve.py` package. No default, original, paused or Dot state is copied. No browser reset or key setup is needed.

1. Confirm the existing training shell and labeled QA-RATE panel appear. Wait for committed local durability.
2. Refresh and capture v1:600 units/hour, run minutes denominator60. Record timestamp/source IDs.
3. Stage v2. Confirm no current capture and explicit refresh required. The historical v1 capture remains unchanged.
4. Refresh and capture v2:400 units/hour, planned minutes denominator90. Both historical rows remain.
5. Mark the selected denominator missing, then refresh. Capture must be Unavailable/missing_input; old600/400 remain historical.
6. Export the ordinary training backup, preserve its downloaded bytes, reload and compare captures. Save a harmless working draft, then restore the exported own-QA backup through the ordinary recovery UI. It reloads explicitly; timestamps/values/versions must match the export.
7. Import OWNED-QA-INVALID-BACKUP.json and OWNED-QA-FOREIGN-BACKUP.json from this folder. Both must refuse without reload, reset, mutation or loss. Export afterward and compare committed entries with the pre-attempt export. These files are deliberately invalid synthetic refusal fixtures; do not upload them to any other workspace.

The fixture captures and retained training state share this owned namespace and dedicated database. Main/review/default ownership excludes QA keys. Native file download/import, keyboard,320/390pixel layout and original-route acceptance require their own permitted review; unit/DOM checks are equivalent engineering evidence. Later Northworks simulation recovery is not exercised by this bounded training-backup fixture. Genuine security review and human print remain separate gates.
