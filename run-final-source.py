from pathlib import Path
import subprocess,json,hashlib,sys,datetime
r=Path(__file__).resolve().parent;out=r/'evidence/final-source';nodeOnly=sys.argv[1:]==['--node-only']
def identity():return {str(f.relative_to(r/'app')):hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted((r/'app').rglob('*')) if f.is_file() and not any(n in f.relative_to(r/'app').parts for n in ['node_modules','dist','.cache'])}
before=identity();groups=['node'] if nodeOnly else [g for g in json.loads((out/'GROUPS.json').read_text())['groups'] if g!='node']
if not nodeOnly:
 prior=json.loads((out/'TYPECHECK.json').read_text())if(out/'TYPECHECK.json').exists()else None
 if prior and prior.get('exitCode')==0 and prior.get('sourceFiles')==before:
  print(json.dumps({'typecheckExitCode':0,'reusedExactSourceProof':True,'freshProcessClaimed':False}),flush=True)
 else:
  with(out/'typecheck.txt').open('w')as log:result=subprocess.run([str(r/'app/node_modules/.bin/tsc'),'--noEmit'],cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
  (out/'TYPECHECK.json').write_text(json.dumps({'exitCode':result.returncode,'sourceFiles':before,'explicitProcessExitObserved':True}))
  print(json.dumps({'typecheckExitCode':result.returncode}),flush=True)
  if result.returncode:raise SystemExit(result.returncode)
(out/('NODE-BEFORE.json'if nodeOnly else'SOURCE-BEFORE.json')).write_text(json.dumps(before));summary=[]
for group in groups:
 report=out/('shard-'+group+'-results.json')
 if report.exists():
  provenance=json.loads((out/'RESUME-REPORT-SOURCES.json').read_text());assert provenance['sourceFiles']==before;assert provenance['reports'][group]['sha256']==hashlib.sha256(report.read_bytes()).hexdigest();saved=json.loads(report.read_text());assert saved['success']and saved['numFailedTests']==0 and (saved['numPassedTests']==len(json.loads((out/'GROUPS.json').read_text()).get('perCaseSelections',{}).get(group,[])) if group in json.loads((out/'GROUPS.json').read_text()).get('perCaseSelections',{}) else saved['success']and saved['numFailedTests']==0 and saved['numPassedTests']==saved['numTotalTests']);result=subprocess.CompletedProcess([],0)
 else:
  with(out/('shard-'+group+'.txt')).open('w')as log:result=subprocess.run([str(r/'app/node_modules/.bin/vitest'),'run','--config',str(out/('shard-'+group+'.mjs')),'--reporter=json','--outputFile',str(report)],cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
 data=json.loads(report.read_text())if report.exists()else{}
 selected=json.loads((out/'GROUPS.json').read_text()).get('perCaseSelections',{}).get(group)
 if selected and data:
  assertions=[a for t in data['testResults'] for a in t['assertionResults']];chosen=[a for a in assertions if a['fullName'] in selected]
  assert sorted(a['fullName'] for a in chosen)==sorted(selected)
  assert all(a['status']=='skipped' for a in assertions if a['fullName'] not in selected),'Unexpected unselected execution'
  assert data['numPassedTests']==sum(a['status']=='passed' for a in chosen)
  assert data['numTotalTests']==len(assertions)
  data={**data,'numTotalTests':len(chosen)}
 row={'group':group,'exitCode':result.returncode,'passed':data.get('numPassedTests'),'failed':data.get('numFailedTests'),'total':data.get('numTotalTests')};summary.append(row);print(json.dumps(row),flush=True);(out/('NODE-SUMMARY.json'if nodeOnly else'RUN-SUMMARY.json')).write_text(json.dumps(summary));assert before==identity(),'App source changed during serial verification'
 if result.returncode:raise SystemExit(result.returncode)
(out/('NODE-AFTER.json'if nodeOnly else'SOURCE-AFTER.json')).write_text(json.dumps(identity()))
