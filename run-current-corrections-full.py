from pathlib import Path
import subprocess,json,hashlib,datetime,collections
r=Path(__file__).resolve().parent;e=r/'evidence';out=e/'current-corrections-full-source';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node'
def clock():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def source():return{str(p.relative_to(r/'app')):hashlib.sha256(p.read_bytes()).hexdigest()for p in sorted((r/'app').rglob('*'))if p.is_file()and not any(n in p.relative_to(r/'app').parts for n in ['node_modules','dist','.cache'])}
before=source();identity=hashlib.sha256(''.join('app/'+n+'\0'+h+'\n'for n,h in before.items()).encode()).hexdigest();assert identity=='711b7027e59fb128f57df535dfbc9ac23053167a6276da4a870d88d8899d805d';resume=json.loads((out/'RESUME-PROVENANCE.json').read_text());assert resume['sourceFiles']==before
(out/'SOURCE-BEFORE.json').write_text(json.dumps(before));groups=json.loads((out/'GROUPS.json').read_text());summary=[];assertions=[];errors=[]
def state(stage):
 (e/'CURRENT-CORRECTIONS-FULL-STATE.json').write_text(json.dumps({'stage':stage,'at':clock(),'sourceSha256':identity,'releaseReady':False,'freezeHold':True},indent=2))
try:
 for group in groups['groups']:
  state('source:'+group);report=out/('shard-'+group+'-results.json')
  reused=group in resume['reuse']
  if reused:
   prior=resume['reuse'][group];assert prior['observedExitCode']==0 and prior['reportSha256']==hashlib.sha256(report.read_bytes()).hexdigest();p=subprocess.CompletedProcess([],0)
  else:
   with(out/('shard-'+group+'.txt')).open('w')as log:p=subprocess.run([node,str(r/'app/node_modules/vitest/vitest.mjs'),'run','--config',str(out/('shard-'+group+'.mjs')),'--reporter=json','--outputFile',str(report)],cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
  (out/('shard-'+group+'-PROCESS.json')).write_text(json.dumps({'exitCode':p.returncode,'reusedExactPriorProcessReport':reused,'at':clock()}))
  d=json.loads(report.read_text())if report.exists()else{};selected=groups.get('perCaseSelections',{}).get(group);chosen=[]
  for f in d.get('testResults',[]):
   for a in f['assertionResults']:
    if selected and a['fullName'] not in selected:
     assert a['status']=='skipped';continue
    file=str(Path(f['name']).relative_to(r/'app'));assertions.append({'file':file,'fullName':a['fullName'],'status':a['status'],'group':group});chosen.append(a)
  if selected:assert collections.Counter(a['fullName']for a in chosen)==collections.Counter(selected)
  row={'group':group,'exitCode':p.returncode,'passed':sum(a['status']=='passed'for a in chosen),'failed':sum(a['status']=='failed'for a in chosen),'total':len(chosen)};summary.append(row);(out/'RUN-SUMMARY.json').write_text(json.dumps(summary,indent=2));assert source()==before,'Source changed during verification';print(json.dumps(row),flush=True)
 sourceReport={'sourceSha256':identity,'sourceStable':True,'assertions':assertions,'passed':sum(a['status']=='passed'for a in assertions),'failed':sum(a['status']=='failed'for a in assertions),'testFiles':len(set(a['file']for a in assertions)),'groups':summary,'allProcessesExitZero':all(x['exitCode']==0 for x in summary),'nativeAcceptance':False};prior=json.loads((e/'PROFILE-NOTES-FULL-SOURCE-COVERAGE.json').read_text());priorKeys=collections.Counter((a['file'],a['fullName'])for a in prior['assertions']);currentKeys=collections.Counter((a['file'],a['fullName'])for a in assertions);sourceReport['prior4b63CriteriaMissing']=[list(x)+[n]for x,n in sorted((priorKeys-currentKeys).items())];assert all(currentKeys[k]==n for k,n in priorKeys.items()),'Prior repeated reporter-name multiplicity changed';assert not sourceReport['prior4b63CriteriaMissing'];assert sourceReport['testFiles']==groups['testFiles'];(e/'CURRENT-CORRECTIONS-FULL-SOURCE-COVERAGE.json').write_text(json.dumps(sourceReport,indent=2));(out/'SOURCE-AFTER.json').write_text(json.dumps(source()))
 state('compiled');
 with(e/'current-corrections-full-compiled-supervisor.txt').open('w')as log:compiled=subprocess.run(['python3',str(r/'run-current-corrections-full-build-compiled.py')],cwd=r,stdout=log,stderr=subprocess.STDOUT)
 (e/'CURRENT-CORRECTIONS-FULL-COMPILED-SUPERVISOR.json').write_text(json.dumps({'exitCode':compiled.returncode,'terminalProcessObserved':True,'at':clock()}));assert source()==before
 terminal={'sourceSha256':identity,'sourcePassed':sourceReport['passed'],'sourceFailed':sourceReport['failed'],'sourceTestFiles':sourceReport['testFiles'],'sourceAllProcessesExitZero':sourceReport['allProcessesExitZero'],'prior4b63CriteriaMissing':[],'compiledExitCode':compiled.returncode,'exitCode':int(not sourceReport['allProcessesExitZero']or compiled.returncode!=0),'terminalProcessObserved':True,'at':clock(),'nativeAcceptance':False,'releaseReady':False,'freezeHold':True,'finalZip':False,'externalOrPaidCalls':0,'qualification':'Fresh serial complete source groups resumed after owner duplicate-name reconciliation error with exact-byte prior report provenance; all compiled groups; prior failed runs retained; no timeouts/assertions changed. Hosted/master/operator proofs remain independently tracked.'}
except BaseException as error:
 terminal={'sourceSha256':identity,'exitCode':1,'terminalProcessObserved':True,'error':str(error),'at':clock(),'nativeAcceptance':False,'releaseReady':False,'freezeHold':True,'finalZip':False}
(e/'CURRENT-CORRECTIONS-FULL-COMPLETION.json').write_text(json.dumps(terminal,indent=2));print(json.dumps(terminal),flush=True);raise SystemExit(terminal['exitCode'])
