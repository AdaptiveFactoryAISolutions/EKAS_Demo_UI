# V106 attention chart numeric binding correction

Independent V105-N01 native evidence remains preserved. In the actual installed Dashboards SDK, all three selected cases reproduced undefined point.y values when a text Group column was assigned as numeric x. Dashboards builds keyed point arrays from this assignment; text x values prevent valid numeric bar data.

The successor binds Group as point.name and Envelopes as point.y. The same groups DataPool connector, Grid, source identities, envelope units, ranges and saved layouts remain in use. Three real SDK regressions now pass exact numeric values and point names, finite positive counts, nonzero bar geometry and saved-layout remount identity. Tests explicitly supply a synthetic viewport and fixed margins because jsdom has no text layout; this is not native browser evidence. Initial red, post-binding jsdom geometry failures, diagnosis and final explicit-layout green are preserved.

Native Chrome retest of the frozen successor remains required. This correction does not establish physical alarm exposure, safety delivery or causal improvement. V105 remains immutable.
