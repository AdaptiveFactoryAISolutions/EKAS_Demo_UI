from pathlib import Path
import json,hashlib,subprocess,time,datetime,ast,collections,os,resource
r=Path(__file__).resolve().parent;p=r/'evidence/recurrence-ownership-full-compiled';manifest=json.loads((p/'PINNED-MANIFEST.json').read_text());node='/home/pat/.nvm/versions/node/v20.20.2/bin/node'
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
clock=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
def tree(base):return{str(f.relative_to(base)):sha(f)for f in sorted(base.rglob('*'))if f.is_file()and not any(n in f.relative_to(base).parts for n in ['node_modules','dist','.cache'])}
original=json.loads((r/'evidence/current-corrections-full-source/SOURCE-AFTER.json').read_text())
assert tree(r/'app')==original
runner_sha=sha(Path(__file__));assert not(p/'FULL-COMPLETION.json').exists()
syntax=ast.parse((r/'run-current-corrections-full-build-compiled.py').read_text());groups=next(ast.literal_eval(n.iter)for n in ast.walk(syntax)if isinstance(n,ast.For)and isinstance(n.target,ast.Tuple)and[x.id for x in n.target.elts]==['tag','config']);assert len(groups)==20
baseline=json.loads((r/'evidence/CURRENT-CORRECTIONS-COMPILED-VERIFICATION-UNION.json').read_text())['assertions'];key=lambda x:(x['file'],x['fullName'],x['group'])
rows=[];stages=[];started=clock();(p/'FULL-START.json').write_text(json.dumps({'at':started,'pid':os.getpid(),'identities':manifest['identities'],'runnerSha256':runner_sha,'assertionsAndDeadlinesUnchanged':True,'original711bUntouched':True},indent=2))
for tag,config in groups:
 report=p/(tag+'-results.json');assert not report.exists();begin=time.monotonic();cpu=resource.getrusage(resource.RUSAGE_CHILDREN)
 with(p/(tag+'.txt')).open('w')as log:
  child=subprocess.Popen([node,str(r/'app/node_modules/vitest/vitest.mjs'),'run','--config','native-'+config,'--reporter=default','--reporter=json','--outputFile',str(report)],cwd=p,stdout=log,stderr=subprocess.STDOUT)
  (p/'FULL-STATE.json').write_text(json.dumps({'at':clock(),'group':tag,'ownedPid':child.pid,'completedGroups':len(stages),'passed':sum(s['passed']for s in stages),'failed':sum(s['failed']for s in stages),'identities':manifest['identities']}))
  while child.poll()is None:
   sample={'at':clock(),'group':tag,'loadavg':os.getloadavg(),'pressure':{n:Path('/proc/pressure/'+n).read_text().splitlines()for n in ['cpu','io','memory']}}
   with(p/'AGGREGATE-HOST-PRESSURE.jsonl').open('a')as f:f.write(json.dumps(sample)+'\n')
   time.sleep(2)
 d=json.loads(report.read_text())if report.exists()else{};after=resource.getrusage(resource.RUSAGE_CHILDREN)
 row={'group':tag,'exitCode':child.returncode,'passed':d.get('numPassedTests',0),'failed':d.get('numFailedTests',0),'total':d.get('numTotalTests',0),'wallSeconds':time.monotonic()-begin,'childCpuSeconds':after.ru_utime+after.ru_stime-cpu.ru_utime-cpu.ru_stime,'reportSha256':sha(report)if report.exists()else None};stages.append(row)
 for file in d.get('testResults',[]):
  for a in file['assertionResults']:rows.append({'file':Path(file['name']).name,'fullName':a['fullName'],'group':tag,'status':a['status'],'duration':a.get('duration')})
 (p/'FULL-SUMMARY.json').write_text(json.dumps(stages,indent=2));print(json.dumps(row),flush=True)
 assert tree(r/'app')==original and tree(p/'app')==manifest['source'] and tree(p/'server')==manifest['server'] and tree(p/'static')==manifest['static']
 assert all(sha(p/n)==h for n,h in manifest['harness'].items())and sha(Path(__file__))==runner_sha
missing=collections.Counter(map(key,baseline))-collections.Counter(map(key,rows));extra=collections.Counter(map(key,rows))-collections.Counter(map(key,baseline));events=[json.loads(x)for x in(p/'lifetime-events.jsonl').read_text().splitlines()];active={};overlaps=[]
for event in events:
 k=(event['pid'],event['tag'])
 if event['event']=='created':
  overlaps +=[{'previous':v,'next':event}for prior,v in active.items()if prior[0]==k[0]and v.get('testName')!=event.get('testName')];active[k]=event
 elif event['event']=='closed':assert event['pendingHandlers']==0;active.pop(k,None)
clean=len(rows)==501 and not missing and not extra and all(s['exitCode']==0 for s in stages)and all(x['status']=='passed'for x in rows)and not active and not overlaps
result={'exitCode':0 if clean else 1,'terminalProcessObserved':True,'at':clock(),'startedAt':started,'identities':manifest['identities'],'runnerSha256':runner_sha,'fullGroups':len(stages),'passed':sum(x['status']=='passed'for x in rows),'failed':sum(x['status']=='failed'for x in rows),'all501IdentitiesPresent':len(rows)==501 and not missing and not extra,'allProcessesExitZero':all(s['exitCode']==0 for s in stages),'cleanCompleteRun':clean,'assertions':rows,'stages':stages,'originalTestsAndBaseConfigsByteExact':True,'assertionsAndDeadlinesUnchanged':True,'fixtureClosures':sum(x['event']=='closed'for x in events),'crossTestFixtureOverlaps':overlaps,'activeFixtures':list(active.values()),'pendingHandlersAtClosure':0,'original711bUnchanged':True,'live18329Touched':False,'preview18352Touched':False,'releaseReady':False,'nativeAcceptance':False,'isolatedRetryUnion':False}
(p/'FULL-COMPLETION.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items()if k not in ['assertions','stages']}),flush=True);raise SystemExit(result['exitCode'])
