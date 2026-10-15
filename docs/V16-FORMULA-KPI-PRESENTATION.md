# V16 formula KPI metadata correction

Home KPI previously persisted only the query and its generated title, so a custom formula could render its raw fx identifier and a unitless number. New watch entries capture a cloned formula definition and user formula name. Home evaluates that saved definition and displays canonical derived units, preserving name, units and arithmetic after reload or later formula edits. Older entries use an available matching formula; missing metadata renders Custom formula / Formula metadata unavailable and suppresses numeric results. Built-in formatting, grouped OEE and controlled manufacturing gates remain unchanged.

Two regression tests failed before correction and pass afterward. They cover JSON persistence round trip plus later global formula edits, and a legacy missing-metadata KPI. This candidate is isolated: V15 remains deployed and no browser or storage actions were taken. Independent visible acceptance remains pending.
