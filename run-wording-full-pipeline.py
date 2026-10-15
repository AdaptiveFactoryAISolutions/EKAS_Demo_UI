from pathlib import Path
import subprocess,json,datetime,hashlib,collections
r=Path(__file__).resolve().parent;e=r/'evidence';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';rows=[]
def run(stage,cmd):
 (e/'WORDING-FULL-PIPELINE-STATE.json').write_text(json.dumps(dict(stage=stage,state='running',at=datetime.datetime.now(datetime.timezone.utc).isoformat())))
 with(e/'wording-full-pipeline.log').open('a')as log:q=subprocess.run(cmd,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 rows.append(dict(stage=stage,exitCode=q.returncode));(e/'WORDING-FULL-PIPELINE-STAGES.json').write_text(json.dumps(rows,indent=2))
 if stage=='source':(e/'wording-full-source/SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if stage=='compiled':(e/'WORDING-FULL-COMPILED-SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if q.returncode:raise RuntimeError(stage+' failed')
try:
 run('source',['python3',str(r/'run-wording-full-source.py')])
 run('source-node',['python3',str(r/'run-wording-full-source.py'),'--node-only'])
 run('source-reconcile',['python3',str(r/'reconcile-wording-full-source.py')])
 proof=json.loads((e/'WORDING-FULL-SOURCE-COVERAGE.json').read_text());prior=json.loads((e/'FINAL-SOURCE-COVERAGE.json').read_text());key=lambda x:(x['file'],x['fullName']);assert not collections.Counter(map(key,prior['assertions']))-collections.Counter(map(key,proof['assertions']));assert proof['passed']==2867 and proof['testFiles']==476;assert proof['sourceSha256']=='33d8666840fbbe351084d18f9d724bf3b924aad2732b3f9fadc4ef58acc70068'
 run('compiled',['python3',str(r/'run-wording-full-build-compiled.py')])
 run('compiled-reconcile',['python3',str(r/'reconcile-wording-full-compiled.py')])
 for stage,name in [('hosted','rc-local-hosted-smoke.mjs'),('master','rc-final-compiled-audit-master-smoke.mjs'),('mock-history','rc-final-mock-history-http.mjs')]:run(stage,[node,str(e/('wording-full-'+name))])
except BaseException as error:
 (e/'WORDING-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=1,error=str(error),stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),nativeAcceptance=False)));raise
else:
 (e/'WORDING-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=0,stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),sourceSha256=proof['sourceSha256'],sourcePassed=2867,sourceTestFiles=476,allPriorCF2859AssertionsRetained=True,compiledPassed=501,nativeAcceptance=False,freezeOrZip=False)))
