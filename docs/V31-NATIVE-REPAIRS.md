# V31 native KPI settings repair

Provisional candidate; independent Chrome acceptance pending. V30 remains deployed until coordinated safe boundary.

Installed Dashboards4.2 native input fields update on change. The input path exercised by review did not commit Title/Value, and Confirm only explicitly reapplies HTML/Highcharts. The local adapter now records allowlisted KPI plain text on input and samples those fields on Confirm, preserving native changedOptions/discard handling. Finite numeric values become numbers. No arbitrary option paths or external resources are imported.

A real installed Board regression configures the native settings controls, presses native Confirm, verifies title and 16 visibly render, saves native options and restores a fresh Board with the same rendered title/value. V30 governed-column KPI round-trip, HTML confirm/discard and portal regressions continue passing. Routes, data fixtures and Dot are unchanged.
