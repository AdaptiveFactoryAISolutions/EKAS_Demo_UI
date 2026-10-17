# RC6 superseded

RC6 is not frozen. Its ZIP, source commit, and evidence commit stay byte-unchanged.

RC6 source `17b19f555ad446d9f34e89289ef761c29d7aacf9` fixed the clean-extract launcher. That packaging remains. RC6 must not freeze because one full suite exited 1 after every assertion passed: unhandled `ReferenceError: window is not defined` at `app/src/retained/screens.tsx:291` during `conversationalCollectorsUi.test.tsx`.

RC7 keeps the RC6 launcher, `packaged/` server, and documented command, and closes that teardown race at the shared page lifetime.

| Item | Value |
| --- | --- |
| RC6 ZIP | `docs/wp6/EKAS-DEMO-RC6.zip` |
| RC6 ZIP size | 40,834,640 bytes |
| RC6 ZIP SHA256 | `74c0f5d721d36378888380aa1928e1377ab9a9f55bcc220437cbb37e35dd2976` |
| RC6 evidence | `837c971f29c19883ab1a57ea244f10c66fe4b962` |
