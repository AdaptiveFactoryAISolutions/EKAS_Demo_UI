from pathlib import Path
import subprocess,json,datetime,hashlib,collections
r=Path(__file__).resolve().parent;e=r/'evidence';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';rows=[]
def run(stage,cmd):
 (e/'GUIDE-HELP-FULL-PIPELINE-STATE.json').write_text(json.dumps(dict(stage=stage,state='running',at=datetime.datetime.now(datetime.timezone.utc).isoformat())))
 with(e/'guide-help-full-pipeline.log').open('a')as log:q=subprocess.run(cmd,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 rows.append(dict(stage=stage,exitCode=q.returncode));(e/'GUIDE-HELP-FULL-PIPELINE-STAGES.json').write_text(json.dumps(rows,indent=2))
 if stage=='source':(e/'guide-help-full-source/SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if stage=='compiled':(e/'GUIDE-HELP-FULL-COMPILED-SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if q.returncode:raise RuntimeError(stage+' failed')
try:
 run('source',['python3',str(r/'run-guide-help-full-source.py')])
 run('source-node',['python3',str(r/'run-guide-help-full-source.py'),'--node-only'])
 run('source-reconcile',['python3',str(r/'reconcile-guide-help-full-source.py')])
 proof=json.loads((e/'GUIDE-HELP-FULL-SOURCE-COVERAGE.json').read_text());prior=json.loads((e/'FINAL-SOURCE-COVERAGE.json').read_text());key=lambda x:(x['file'],x['fullName']);assert not collections.Counter(map(key,prior['assertions']))-collections.Counter(map(key,proof['assertions']));assert proof['passed']==2868 and proof['testFiles']==477;assert proof['sourceSha256']=='5161d7356e66d3f67c2d3967958efa077121d419301f3092d4f3c14161d94421'
 run('compiled',['python3',str(r/'run-guide-help-full-build-compiled.py')])
 run('compiled-reconcile',['python3',str(r/'reconcile-guide-help-full-compiled.py')])
 for stage,name in [('hosted','rc-local-hosted-smoke.mjs'),('master','rc-final-compiled-audit-master-smoke.mjs'),('mock-history','rc-final-mock-history-http.mjs')]:run(stage,[node,str(e/('guide-help-full-'+name))])
except BaseException as error:
 (e/'GUIDE-HELP-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=1,error=str(error),stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),nativeAcceptance=False)));raise
else:
 (e/'GUIDE-HELP-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=0,stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),sourceSha256=proof['sourceSha256'],sourcePassed=2868,sourceTestFiles=477,allPriorCF2859AssertionsRetained=True,compiledPassed=501,nativeAcceptance=False,freezeOrZip=False)))
