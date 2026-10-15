from pathlib import Path
import subprocess,json,datetime
r=Path(__file__).resolve().parent;e=r/'evidence'
def run(name):
 p=subprocess.run(['python3',str(r/name)],cwd=r)
 if p.returncode:raise SystemExit(p.returncode)
run('run-priority-label-working.py')
run('prepare-priority-label-review-preview.py')
d=e/'current-working-preview-priority-label'
with(d/'server.log').open('ab')as log:p=subprocess.Popen(['node',str(d/'launch.mjs')],cwd=d,stdin=subprocess.DEVNULL,stdout=log,stderr=log,start_new_session=True)
(d/'PROCESS-LAUNCHED.json').write_text(json.dumps({'pid':p.pid,'profile':'mock-priority-label-review'}))
identity=json.loads((d/'IDENTITY.json').read_text());ready={**identity,'url':'http://127.0.0.1:18335/?demonstration=ekas-priority-label-preview-20261015','pid':p.pid,'rehearsalOnly':True,'paidCalls':0,'readiness':'Process launched; verify public HTTP readiness before native retest.','normalPrivateKeyEntryPortUnchanged':18329}
(r.parent/'CURRENT-PREVIEW-READY.json').write_text(json.dumps(ready,indent=2)+'\n')
checkpoint=r.parent/'CURRENT-PARENT-CHECKPOINT.md';checkpoint.write_text('## '+datetime.datetime.now(datetime.timezone.utc).isoformat()+' — label correction working build complete\n\nNew immutable mock preview18335 launched, exact identity in CURRENT-PREVIEW-READY.json. Type/64targeted/browser+localserver working build passed. Public HTTP readiness and native retest remain separate. Private18329 untouched; no credential access/provider call/browser. Full source then compiled pipeline follows serially.\n\n'+checkpoint.read_text())
run('run-final-source-supervised.py')
run('run-final-serial-pipeline.py')
