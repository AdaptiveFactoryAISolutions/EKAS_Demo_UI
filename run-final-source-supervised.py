from pathlib import Path
import subprocess,json,datetime
r=Path(__file__).resolve().parent
with(r/'evidence/final-source/supervisor.log').open('w')as log:result=subprocess.run(['python3',str(r/'run-final-source.py')],cwd=r,stdout=log,stderr=subprocess.STDOUT)
(r/'evidence/final-source/SUPERVISOR-COMPLETION.json').write_text(json.dumps({'exitCode':result.returncode,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'terminalProcessObserved':True,'nodeGroupSeparatePermissionRequired':True}))
raise SystemExit(result.returncode)
