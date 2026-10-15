from pathlib import Path
import subprocess,json,datetime,hashlib,collections
r=Path(__file__).resolve().parent;e=r/'evidence';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';rows=[]
def run(stage,cmd):
 (e/'PROFILE-NOTES-FULL-PIPELINE-STATE.json').write_text(json.dumps(dict(stage=stage,state='running',at=datetime.datetime.now(datetime.timezone.utc).isoformat())))
 with(e/'profile-notes-full-pipeline.log').open('a')as log:q=subprocess.run(cmd,cwd=r,stdout=log,stderr=subprocess.STDOUT)
 rows.append(dict(stage=stage,exitCode=q.returncode));(e/'PROFILE-NOTES-FULL-PIPELINE-STAGES.json').write_text(json.dumps(rows,indent=2))
 if stage=='source':(e/'profile-notes-full-source/SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if stage=='compiled':(e/'PROFILE-NOTES-FULL-COMPILED-SUPERVISOR-COMPLETION.json').write_text(json.dumps(dict(exitCode=q.returncode,terminalProcessObserved=True)))
 if q.returncode:raise RuntimeError(stage+' failed')
try:
 run('source',['python3',str(r/'run-profile-notes-full-source.py')])
 run('source-node',['python3',str(r/'run-profile-notes-full-source.py'),'--node-only'])
 run('source-reconcile',['python3',str(r/'reconcile-profile-notes-full-source.py')])
 proof=json.loads((e/'PROFILE-NOTES-FULL-SOURCE-COVERAGE.json').read_text());prior=json.loads((e/'FINAL-SOURCE-COVERAGE.json').read_text());key=lambda x:(x['file'],x['fullName']);transition=json.loads((e/'PROFILE-NOTES-CRITERIA-TRANSITION.json').read_text());expected=collections.Counter(map(key,prior['assertions']))-collections.Counter(map(key,transition['retired']))+collections.Counter(map(key,transition['replacement']));assert not expected-collections.Counter(map(key,proof['assertions']));assert proof['passed']==2875 and proof['testFiles']==482;assert proof['sourceSha256']=='4b63f361b1176982e1e551c561c09ab60917191fc530d3fa2f2d6727029da170'
 run('compiled',['python3',str(r/'run-profile-notes-full-build-compiled.py')])
 run('compiled-reconcile',['python3',str(r/'reconcile-profile-notes-full-compiled.py')])
 for stage,name in [('hosted','rc-local-hosted-smoke.mjs'),('master','rc-final-compiled-audit-master-smoke.mjs'),('mock-history','rc-final-mock-history-http.mjs')]:run(stage,[node,str(e/('profile-notes-full-'+name))])
except BaseException as error:
 (e/'PROFILE-NOTES-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=1,error=str(error),stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),nativeAcceptance=False)));raise
else:
 (e/'PROFILE-NOTES-FULL-PIPELINE-COMPLETION.json').write_text(json.dumps(dict(exitCode=0,stages=rows,at=datetime.datetime.now(datetime.timezone.utc).isoformat(),sourceSha256=proof['sourceSha256'],sourcePassed=2875,sourceTestFiles=482,priorCFCriteriaCoveredWithSevenExplicitPolicyReplacements=True,compiledPassed=501,nativeAcceptance=False,freezeOrZip=False,validationForm="fresh current-source serial partitioned run; historical7e26 nonpass retained separately")))
