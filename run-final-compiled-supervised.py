from pathlib import Path
import subprocess,json,datetime
r=Path(__file__).resolve().parent
with(r/'evidence/final-compiled-supervisor.log').open('w')as log:p=subprocess.run(['python3',str(r/'run-final-build-compiled.py')],cwd=r,stdout=log,stderr=subprocess.STDOUT)
(r/'evidence/FINAL-COMPILED-SUPERVISOR-COMPLETION.json').write_text(json.dumps({'exitCode':p.returncode,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'terminalProcessObserved':True}))
raise SystemExit(p.returncode)
