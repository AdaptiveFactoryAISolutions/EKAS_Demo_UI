from pathlib import Path
import subprocess,json,time,datetime,sys
r=Path(__file__).resolve().parent; evidence=r/'evidence'; logpath=evidence/'final-serial-pipeline.log'
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def record(stage,state):
 (evidence/'FINAL-PIPELINE-STATE.json').write_text(json.dumps({'stage':stage,'state':state,'at':now()}))
def run(stage,command):
 record(stage,'running')
 with logpath.open('a') as log:p=subprocess.run(command,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 record(stage,'passed'if p.returncode==0 else'failed')
 if p.returncode:raise SystemExit(p.returncode)
try:
 record('await-source','waiting')
 completion=evidence/'final-source/SUPERVISOR-COMPLETION.json'
 while not completion.exists():time.sleep(5)
 assert json.loads(completion.read_text())['exitCode']==0,'Source suite failed; no later stages run'
 run('source-node',['python3',str(r/'run-final-source.py'),'--node-only'])
 run('source-reconcile',['python3',str(r/'reconcile-final-source.py')])
 run('build-compiled',['python3',str(r/'run-final-compiled-supervised.py')])
 run('compiled-reconcile',['python3',str(r/'reconcile-final-compiled.py')])
 run('local-hosted-smoke',['node',str(evidence/'rc-local-hosted-smoke.mjs')])
 run('audit-master-smoke',['node',str(evidence/'rc-final-compiled-audit-master-smoke.mjs')])
 run('mock-history-master-smoke',['node',str(evidence/'rc-final-mock-history-http.mjs')])
 record('verified-owner-pipeline','passed')
except BaseException as error:
 (evidence/'FINAL-PIPELINE-COMPLETION.json').write_text(json.dumps({'exitCode':getattr(error,'code',1),'at':now(),'scope':'Owner source/compiled/local-loopback only; native and user acceptance separate.'}))
 raise
else:
 (evidence/'FINAL-PIPELINE-COMPLETION.json').write_text(json.dumps({'exitCode':0,'at':now(),'scope':'Owner source/compiled/local-loopback only; native and user acceptance separate.'}))
