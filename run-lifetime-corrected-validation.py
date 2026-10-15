from pathlib import Path
import subprocess,json,hashlib,datetime,time,collections,ast,resource
r=Path(__file__).resolve().parent;e=r/'evidence';owner=e/'lifetime-corrected-711b';template=e/'compiled-harness-template';node='/home/pat/.nvm/versions/node/v20.20.2/bin/node';vitest=r/'app/node_modules/vitest/vitest.mjs'
clock=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
expected=json.loads((e/'current-corrections-full-source/SOURCE-AFTER.json').read_text())
def appbytes(base):return{str(p.relative_to(base)):sha(p)for p in sorted(base.rglob('*'))if p.is_file()and not any(x in p.relative_to(base).parts for x in ['node_modules','dist','.cache'])}
assert appbytes(r/'app')==expected==appbytes(owner/'app')
changed=[p.name for p in template.iterdir()if p.read_bytes()!=(owner/p.name).read_bytes()];assert changed==['direct-helper.ts']
source={p.name:sha(owner/p.name)for p in template.iterdir()};source.update({n:sha(owner/n)for n in ['owned-timeout-lifecycle.test.ts','lifetime-regression.config.mts']});source['runner/'+Path(__file__).name]=sha(Path(__file__))
identity=hashlib.sha256(''.join(n+'\0'+h+'\n'for n,h in sorted(source.items())).encode()).hexdigest();(owner/'FINAL-HARNESS-MANIFEST.json').write_text(json.dumps(source,indent=2))
tree=ast.parse((r/'run-current-corrections-full-build-compiled.py').read_text());groups=next(ast.literal_eval(n.iter)for n in ast.walk(tree)if isinstance(n,ast.For)and isinstance(n.target,ast.Tuple)and [x.id for x in n.target.elts]==['tag','config']);assert len(groups)==20
stages=[];full=[]
def run(stage,config):
 report=owner/(stage+'-results.json');assert not report.exists();start=time.monotonic();before=resource.getrusage(resource.RUSAGE_CHILDREN)
 (owner/'VALIDATION-STATE.json').write_text(json.dumps({'stage':stage,'harnessSha256':identity,'applicationSourceSha256':'711b7027e59fb128f57df535dfbc9ac23053167a6276da4a870d88d8899d805d','at':clock(),'releaseReady':False}))
 with(owner/(stage+'.txt')).open('w')as log:p=subprocess.run([node,str(vitest),'run','--config',config,'--reporter=default','--reporter=json','--outputFile',str(report)],cwd=owner,stdout=log,stderr=subprocess.STDOUT)
 after=resource.getrusage(resource.RUSAGE_CHILDREN);d=json.loads(report.read_text())if report.exists()else{};row={'stage':stage,'exitCode':p.returncode,'passed':d.get('numPassedTests'),'failed':d.get('numFailedTests'),'total':d.get('numTotalTests'),'wallSeconds':time.monotonic()-start,'childCpuSecondsDelta':after.ru_utime+after.ru_stime-before.ru_utime-before.ru_stime,'maxChildRssKiBSoFar':after.ru_maxrss,'reportSha256':sha(report)if report.exists()else None};stages.append(row);(owner/'VALIDATION-STAGES.json').write_text(json.dumps(stages,indent=2));print(json.dumps(row),flush=True)
 assert appbytes(r/'app')==expected==appbytes(owner/'app');assert all(sha(owner/n)==h for n,h in source.items()if not n.startswith('runner/'))
 return row,d
try:
 row,d=run('controlled-lifetime-metatest','lifetime-regression.config.mts');a=[a for f in d.get('testResults',[])for a in f['assertionResults']];observations=json.loads((owner/'REGRESSION-OBSERVATIONS.json').read_text());assert row['exitCode']==1 and len(a)==3 and a[0]['status']=='failed'and all(x['status']=='passed'for x in a[1:]);assert 'timed out in 20000ms'in(owner/'controlled-lifetime-metatest.txt').read_text();assert observations['outcome']=='closed'and observations['listening']is False and observations['beforeStateSha256']==observations['afterStateSha256'];(owner/'CONTROLLED-METATEST-PROOF.json').write_text(json.dumps({'driverPassed':True,'expectedChildDeadlineFailure':1,'cleanupAndProductCancellationPassed':2,'observations':observations,'harnessSha256':identity},indent=2))
 for tag,config in [('health-http','v101-health-http.config.mts'),('diagnostic-http','v99-diagnostic-http.config.mts')]:
  row,d=run('controlled-target-'+tag,config);assert row['exitCode']==0 and d['success']and d['numFailedTests']==0
 fullStarted=clock();(owner/'FULL-START.json').write_text(json.dumps({'at':fullStarted,'harnessSha256':identity,'allOriginalTestsAndDeadlinesUnchanged':True}))
 rows=[];reports=[]
 for tag,config in groups:
  row,d=run('full-'+tag,config);full.append({**row,'group':tag});(owner/'FULL-RUN-SUMMARY.json').write_text(json.dumps(full,indent=2));reports.append({'group':tag,'report':'full-'+tag+'-results.json','sha256':row['reportSha256']})
  for f in d.get('testResults',[]):
   for a in f['assertionResults']:rows.append({'file':Path(f['name']).name,'fullName':a['fullName'],'group':tag,'status':a['status']})
 baseline=json.loads((e/'CURRENT-CORRECTIONS-COMPILED-VERIFICATION-UNION.json').read_text())['assertions'];key=lambda x:(x['file'],x['fullName'],x['group']);missing=collections.Counter(map(key,baseline))-collections.Counter(map(key,rows));extra=collections.Counter(map(key,rows))-collections.Counter(map(key,baseline));clean=all(x['exitCode']==0 for x in full)and len(rows)==501 and not missing and not extra and all(x['status']=='passed'for x in rows)
 events=[json.loads(x)for x in(owner/'lifetime-events.jsonl').read_text().splitlines()];events=[x for x in events if datetime.datetime.fromisoformat(x['at'].replace('Z','+00:00'))>=datetime.datetime.fromisoformat(fullStarted)];active={};overlaps=[]
 for event in events:
  k=(event['pid'],event['tag'])
  if event['event']=='created':
   overlaps +=[{'previous':v,'next':event}for key,v in active.items()if key[0]==k[0]and v.get('testName')!=event.get('testName')];active[k]=event
  elif event['event']=='closed':assert event['pendingHandlers']==0;active.pop(k,None)
 assert not overlaps and not active,'Owned fixture lifetime crosses test boundary'
 result={'exitCode':0 if clean else 1,'terminalProcessObserved':True,'harnessSha256':identity,'applicationSourceSha256':'711b7027e59fb128f57df535dfbc9ac23053167a6276da4a870d88d8899d805d','changedOriginalHarnessFiles':changed,'originalTestAndConfigBytesPreserved':True,'assertionsAndDeadlinesUnchanged':True,'fullGroups':len(full),'fullPassed':sum(x['status']=='passed'for x in rows),'fullFailed':sum(x['status']=='failed'for x in rows),'fullAllProcessesExitZero':all(x['exitCode']==0 for x in full),'all501IdentitiesPresent':not missing and not extra and len(rows)==501,'cleanCompleteRun':clean,'assertions':rows,'reports':reports,'lifetimeClosedEvents':sum(x['event']=='closed'for x in events),'crossTestFixtureOverlaps':overlaps,'pendingHandlersAtClosure':0,'initial498pass3failRetained':True,'isolatedRetriesUsedForFullPass':False,'at':clock(),'releaseReady':False,'nativeAcceptance':False,'live18329Touched':False}
except BaseException as error:
 result={'exitCode':1,'terminalProcessObserved':True,'error':str(error),'harnessSha256':identity,'stages':stages,'completedFullGroups':len(full),'at':clock(),'releaseReady':False,'nativeAcceptance':False}
(owner/'VALIDATION-COMPLETION.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items()if k not in ['assertions','reports','stages']}),flush=True);raise SystemExit(result['exitCode'])
