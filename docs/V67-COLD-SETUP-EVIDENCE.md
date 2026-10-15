# Bounded cold source setup allowance

The failed cumulative run had1282passed/20failed/223files. All20 failures were ComparisonFlow. Its first beforeEach was interrupted at the10000ms hook deadline; first recorded assertion duration10019.933894ms, suite17760.966797ms. Reporter explicitly says Hook timed out in10000ms, followed by overlapping act/init warnings and subsequent incorrect UI-state assertions.

That hook imports the entire cold source app plus hydration within awaited React act. Its setup allowance is now30000ms, scoped to this beforeEach. All20 original assertion bodies and names are unchanged; application requests, runtime behavior, test-body limits and performance acceptance are unchanged. Isolated20/20retest passes in13.19s overall,12.321s tests. Final full cumulative validation is required and recorded separately.

This explains the measured source-test setup failure. It is not a browser runtime performance verdict, an API latency promise, or closure of native first-Run behavior. Failure and focused retest logs are preserved in evidence.

Final cumulative1302/223PASS. Comparison first case duration2070.051278ms in that run; all20 assertions pass. Cold import/hydration subphase was not separately profiled, so deeper timing cause is unproven. The measured failed hook deadline and bounded setup change are the evidence, not browser performance acceptance.
