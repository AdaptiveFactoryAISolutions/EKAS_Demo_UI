from pathlib import Path
import json,time,subprocess,datetime
r=Path(__file__).resolve().parent;e=r/'evidence';completion=e/'FINAL-PIPELINE-COMPLETION.json'
try:
 while not completion.exists():
  failed=e/'final-source/SUPERVISOR-COMPLETION.json'
  if failed.exists()and json.loads(failed.read_text())['exitCode']!=0:raise RuntimeError('Source verification failed; no later preparation.')
  time.sleep(5)
 assert json.loads(completion.read_text())['exitCode']==0
 for name in ['run-final-operator-proof.py','reconcile-final-scope.py','prepare-release-tree.py']:
  with(e/'post-owner-preparation.log').open('a')as log:p=subprocess.run(['python3',str(r/name)],cwd=r,stdout=log,stderr=subprocess.STDOUT)
  if p.returncode:raise RuntimeError(name+' failed')
 (e/'POST-OWNER-PREPARATION-COMPLETION.json').write_text(json.dumps({'exitCode':0,'freezeAttempted':False,'zipCreated':False,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'qualification':'Prepared tree only; existing parent freeze hold honored.'}))
except BaseException as error:
 (e/'POST-OWNER-PREPARATION-COMPLETION.json').write_text(json.dumps({'exitCode':1,'reason':str(error),'freezeAttempted':False}));raise
