# V17 sidebar readability correction

The supplied screenshot was materialized from Library libfile_f346d7b13bd8819196a97f26c83a44fe and actually viewed. It shows the Workspace tools description squeezed into a narrow vertical strip next to Training workspace. Existing wrapping flex layout plus a flex:1 description allowed its width to collapse within the 220px sidebar; the text was not hidden by a modal or an overlay. No contrast/font-color change was needed to correct this observed width defect.

Only sidebar-contained retained-boundary rules change: one full-width grid column, independent rows, left-aligned full-width buttons, readable 1.5 line-height, normal word breaking with emergency wrap for long identifiers and 13px metadata in both densities. The parent sidebar width, header, nav ordering/controls and all callbacks remain unchanged. Expanded training/Northworks metadata and controls use the same rules; collapsed details does not expose these rows. Backup/recovery controls remain separate and unchanged.

The tests load actual CSS into jsdom and check its computed independent-row layout in normal and compact density, plus WCAG relative-luminance contrast. The two row tests fail against V16 and pass with the correction; contrast already passed V16. This validates CSS application, not actual browser geometry or screenshots.

Contrast ratios (small-text AA threshold4.5):
{
  "fg on surface": 14.41,
  "muted on surface": 6.65,
  "fg on surface-2": 12.77,
  "primary-fg on primary": 6.64,
  "muted on surface-2": 5.89
}

Viewport/state audit: selectors apply identically at desktop220px rail, tablet rail and expanded mobile navigation; no responsive override changes the fixed grid rows. Active/inactive nav, normal/compact density, training/Northworks suite and collapsed/expanded details retain existing foreground/background pairs. Mobile nav hidden/shown and keyboard focus controls are not changed. Visual geometry and content visibility at320,390,768,1854 widths, both densities, both suites, expanded/collapsed tools and keyboard focus MUST be checked independently after a coordinated deployment. No Chrome or served candidate actions were performed while E2E runs.

Screenshot remains local outside the portable package to avoid including unrelated browser tabs/account UI in the user deliverable. Reference image: ../ekas-v17-screenshot/sidebar-report.png.

Validation: production build PASS; full354 tests/81 files PASS with maxWorkers=2. Earlier unrestricted run failed in ComparisonFlow and negativeUi; that failed-run log is retained, and no source change was made before the bounded rerun.
