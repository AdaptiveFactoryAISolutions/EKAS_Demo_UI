from pathlib import Path
import json,subprocess,time,datetime
r=Path(__file__).resolve().parent;e=r/'evidence';completion=e/'FINAL-PIPELINE-COMPLETION.json'
def record(stage,state):
 (e/'FINAL-PACKAGING-STATE.json').write_text(json.dumps({'stage':stage,'state':state,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
def run(stage,command):
 record(stage,'running')
 with(e/'final-packaging-pipeline.log').open('a')as log:p=subprocess.run(command,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 record(stage,'passed'if p.returncode==0 else'failed')
 if p.returncode:raise SystemExit(p.returncode)
try:
 record('await-owner-verification','waiting')
 while not completion.exists():time.sleep(5)
 assert json.loads(completion.read_text())['exitCode']==0
 register=json.loads((r/'docs/FINAL-CLOSURE-REGISTER.json').read_text());assert not any(x['status']=='FIX'for x in register['entries'])
 run('operator-callbacks',['python3',str(r/'run-final-operator-proof.py')])
 run('scope-reconciliation',['python3',str(r/'reconcile-final-scope.py')])
 run('prepare-provisional-tree',['python3',str(r/'prepare-release-tree.py')])
 run('freeze-single-provisional-rc1',['python3',str(r/'freeze-final-rc1.py')])
 run('fresh-extract-source-rebuild',['python3',str(r/'verify-final-portable.py')])
 run('fresh-node-runtime-offline-static',['node',str(r/'verify-final-node-smoke.mjs')])
 run('fresh-actual-cli-offline',['node',str(r/'verify-final-cli.mjs')])
 record('provisional-package-owner-verified','passed')
except BaseException as error:
 (e/'FINAL-PACKAGING-COMPLETION.json').write_text(json.dumps({'exitCode':getattr(error,'code',1),'qualification':'Provisional only. Native/human/provider/independent product acceptance remains outstanding.'}));raise
else:(e/'FINAL-PACKAGING-COMPLETION.json').write_text(json.dumps({'exitCode':0,'qualification':'Provisional package owner checks passed. Native/human/provider/independent product acceptance remains outstanding.'}))
