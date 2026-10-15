from pathlib import Path
import subprocess,json,datetime,hashlib,collections
r=Path(__file__).resolve().parent;e=r/'evidence';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';rows=[]
def run(stage,cmd):
 (e/'REVIEW-BATCH-FULL-PIPELINE-STATE.json').write_text(json.dumps(dict(stage=stage,state='running',at=datetime.datetime.now(datetime.timezone.utc).isoformat())))
 with(e/'review-batch-full-pipeline.log').open('a')as log:q=subprocess.run(cmd,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 rows.append(dict(stage=stage,exitCode=q.returncode));(e/'REVIEW-BATCH-FULL-PIPELINE-STAGES.json').write_text(json.dumps(rows,indent=2))
 if stage=='source':(e/'review-batch-full-source/SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if stage=='compiled':(e/'REVIEW-BATCH-FULL-COMPILED-SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if q.returncode:raise RuntimeError(stage+' failed')
try:
 run('source',['python3',str(r/'run-review-batch-full-source.py')])
 run('source-node',['python3',str(r/'run-review-batch-full-source.py'),'--node-only'])
 run('source-reconcile',['python3',str(r/'reconcile-review-batch-full-source.py')])
 proof=json.loads((e/'REVIEW-BATCH-FULL-SOURCE-COVERAGE.json').read_text());prior=json.loads((e/'FINAL-SOURCE-COVERAGE.json').read_text());key=lambda x:(x['file'],x['fullName']);assert not collections.Counter(map(key,prior['assertions']))-collections.Counter(map(key,proof['assertions']));assert proof['passed']==2873 and proof['testFiles']==480;assert proof['sourceSha256']=='7e26e7074e14e739f71079f81a6cb19b8ef5d08cf2df5d4d471c12d976c00ae7'
 run('compiled',['python3',str(r/'run-review-batch-full-build-compiled.py')])
 run('compiled-reconcile',['python3',str(r/'reconcile-review-batch-full-compiled.py')])
 for stage,name in [('hosted','rc-local-hosted-smoke.mjs'),('master','rc-final-compiled-audit-master-smoke.mjs'),('mock-history','rc-final-mock-history-http.mjs')]:run(stage,[node,str(e/('review-batch-full-'+name))])
except BaseException as error:
 (e/'REVIEW-BATCH-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=1,error=str(error),stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),nativeAcceptance=False)));raise
else:
 (e/'REVIEW-BATCH-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=0,stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),sourceSha256=proof['sourceSha256'],sourcePassed=2873,sourceTestFiles=480,allPriorCF2859AssertionsRetained=True,compiledPassed=501,nativeAcceptance=False,freezeOrZip=False,validationForm="resumed same-source successful union; original Guide exit1 despite88assertions passed preserved; unchanged Guide rerun88/process0; historical cause unestablished")))
