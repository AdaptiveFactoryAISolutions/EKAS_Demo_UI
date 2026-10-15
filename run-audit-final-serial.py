from pathlib import Path
import subprocess,json,datetime
r=Path(__file__).resolve().parent;e=r/'evidence'
def run(name,kind='python3'):
 p=subprocess.run([kind,str(r/name)],cwd=r)
 if p.returncode:raise SystemExit(p.returncode)
assert json.loads((e/'RC-AUDIT-JOURNEY-WORKING-COMPLETION.json').read_text())['exitCode']==0
assert json.loads((e/'RC-COMPILED-AUDIT-MASTER-PROOF.json').read_text())['passed']
run('prepare-audit-journey-review-preview.py')
d=e/'current-working-preview-audit-journey'
with(d/'server.log').open('ab')as log:p=subprocess.Popen(['node',str(d/'launch.mjs')],cwd=d,stdin=subprocess.DEVNULL,stdout=log,stderr=log,start_new_session=True)
(d/'PROCESS-LAUNCHED.json').write_text(json.dumps({'pid':p.pid,'profile':'complete-audit-journey-mock'}))
identity=json.loads((d/'IDENTITY.json').read_text());ready={**identity,'url':'http://127.0.0.1:18338/?demonstration=ekas-audit-journey-preview-20261015','pid':p.pid,'rehearsalOnly':True,'paidCalls':0,'readiness':'Mock process launched; public HTTP readiness remains to verify.','liveProfile18329Unchanged':True,'completeCompiledMaster34Passed':True}
(r.parent/'CURRENT-PREVIEW-READY.json').write_text(json.dumps(ready,indent=2)+'\n')
checkpoint=r.parent/'CURRENT-PARENT-CHECKPOINT.md';checkpoint.write_text('## '+datetime.datetime.now(datetime.timezone.utc).isoformat()+' — complete adjacent master working snapshot launched\n\nMock18338 identity in CURRENT-PREVIEW-READY.json. Type/87targeted/browser+serverworkingbuilds passed; compiled34requestHTTP/replay proof passed. Need publicHTTP readiness and independent native retest; use fresh New conversation, preserve earliercapturedfailures. Genuine18329/source4520d319 unchanged while privateentrypending. Fullnewsourceverification followsserially; no final acceptance.\n\n'+checkpoint.read_text())
run('run-final-source-supervised.py')
run('run-final-serial-pipeline.py')
