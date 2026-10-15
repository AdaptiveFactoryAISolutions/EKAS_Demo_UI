from pathlib import Path
import subprocess,json,hashlib,datetime,collections,time,os
r=Path(__file__).resolve().parent;e=r/'evidence';out=e/'f2b-full-source';app=e/'recurrence-ownership-candidate/app';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';manifest=json.loads((e/'recurrence-ownership-full-compiled/PINNED-MANIFEST.json').read_text());groups=json.loads((out/'GROUPS.json').read_text())
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
clock=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
def source(base):return{str(f.relative_to(base)):sha(f)for f in sorted(base.rglob('*'))if f.is_file()and not any(n in f.relative_to(base).parts for n in ['node_modules','dist','.cache'])}
before=source(app);original=json.loads((e/'current-corrections-full-source/SOURCE-AFTER.json').read_text());assert before==manifest['source']and source(r/'app')==original
identity=manifest['identities']['source'];assert identity=='f2b1292c975203593e64b9320d86edaba566710b739da45059b1f7a556b91978';assert not(out/'SOURCE-COMPLETION.json').exists()
configs={g:sha(out/('shard-'+g+'.mjs'))for g in groups['groups']};runner=sha(Path(__file__));(out/'SOURCE-BEFORE.json').write_text(json.dumps(before));(out/'RUN-PROVENANCE.json').write_text(json.dumps({'startedAt':clock(),'pid':os.getpid(),'sourceSha256':identity,'configs':configs,'runnerSha256':runner,'allGroupsFresh':True,'priorReportsReused':False,'typecheck':'Prior candidate typecheck process0 on exact source; not rerun'},indent=2));summary=[];assertions=[]
try:
 for group in groups['groups']:
  report=out/('shard-'+group+'-results.json');assert not report.exists();start=time.monotonic()
  state={'stage':'source:'+group,'at':clock(),'sourceSha256':identity,'completedGroups':len(summary),'passed':sum(x['passed']for x in summary),'failed':sum(x['failed']for x in summary),'releaseReady':False,'sourceFullStatus':'RUNNING','browserAcceptance':'PENDING','compiled501CleanPass':True};(out/'SOURCE-STATE.json').write_text(json.dumps(state));(r/'CURRENT-F2B-VALIDATION-STATE.json').write_text(json.dumps(state))
  with(out/('shard-'+group+'.txt')).open('w')as log:child=subprocess.run([node,str(r/'app/node_modules/vitest/vitest.mjs'),'run','--config',str(out/('shard-'+group+'.mjs')),'--reporter=json','--outputFile',str(report)],cwd=app,stdout=log,stderr=subprocess.STDOUT)
  (out/('shard-'+group+'-PROCESS.json')).write_text(json.dumps({'exitCode':child.returncode,'explicitProcessExitObserved':True,'at':clock(),'fresh':True}))
  d=json.loads(report.read_text())if report.exists()else{};selected=groups.get('perCaseSelections',{}).get(group);chosen=[]
  for file in d.get('testResults',[]):
   for a in file['assertionResults']:
    if selected and a['fullName']not in selected:assert a['status']=='skipped';continue
    item={'file':str(Path(file['name']).relative_to(app)),'fullName':a['fullName'],'status':a['status'],'group':group};assertions.append(item);chosen.append(item)
  if selected:assert collections.Counter(x['fullName']for x in chosen)==collections.Counter(selected)
  row={'group':group,'exitCode':child.returncode,'passed':sum(x['status']=='passed'for x in chosen),'failed':sum(x['status']=='failed'for x in chosen),'total':len(chosen),'wallSeconds':time.monotonic()-start,'reportSha256':sha(report)if report.exists()else None};summary.append(row);(out/'RUN-SUMMARY.json').write_text(json.dumps(summary,indent=2));print(json.dumps(row),flush=True)
  assert source(app)==before and source(r/'app')==original,'Source changed during serial verification';assert all(sha(out/('shard-'+g+'.mjs'))==h for g,h in configs.items())and sha(Path(__file__))==runner
 prior=json.loads((e/'CURRENT-CORRECTIONS-FULL-SOURCE-COVERAGE.json').read_text());key=lambda x:(x['file'],x['fullName']);previous=collections.Counter(map(key,prior['assertions']));current=collections.Counter(map(key,assertions));missing=previous-current;extra=current-previous;testfiles={str(f.relative_to(app))for f in(app/'src').rglob('*')if f.is_file()and'.test.ts'in f.name};seen={x['file']for x in assertions};preserved=all(current[k]==n for k,n in previous.items());clean=all(x['exitCode']==0 for x in summary)and all(x['status']=='passed'for x in assertions)and not missing and preserved and seen==testfiles and len(seen)==492 and len(assertions)==2910 and sum(extra.values())==1
 result={'sourceSha256':identity,'exitCode':0 if clean else 1,'terminalProcessObserved':True,'at':clock(),'passed':sum(x['status']=='passed'for x in assertions),'failed':sum(x['status']=='failed'for x in assertions),'testFiles':len(seen),'allGroupsFresh':True,'groups':summary,'allProcessesExitZero':all(x['exitCode']==0 for x in summary),'prior2910Qualification':'2909prior assertions plus1new ownership test','priorAssertionsPreserved':preserved,'priorCriteriaMissing':[list(k)+[n]for k,n in missing.items()],'newAssertions':sum(extra.values()),'sourceFilesUnchanged':True,'sourceStableAcrossVerification':True,'original711bUnchanged':True,'allTestFilesCovered':seen==testfiles,'assertions':assertions,'nativeAcceptance':False,'browserAcceptance':'PENDING','releaseReady':False,'finalZip':False,'compiled501CleanPass':True,'isolatedRetryUnion':False}
 (out/'SOURCE-AFTER.json').write_text(json.dumps(source(app)))
except BaseException as error:
 result={'sourceSha256':identity,'exitCode':1,'terminalProcessObserved':True,'at':clock(),'error':str(error),'completedGroups':len(summary),'groups':summary,'nativeAcceptance':False,'releaseReady':False}
(out/'SOURCE-COMPLETION.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items()if k not in ['assertions','groups']}),flush=True);raise SystemExit(result['exitCode'])
