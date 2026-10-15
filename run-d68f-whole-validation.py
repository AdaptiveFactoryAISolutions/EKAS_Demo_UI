from pathlib import Path
import subprocess,json,datetime,os
r=Path(__file__).resolve().parent;out=r/'evidence/d68f-whole-validation';out.mkdir(exist_ok=False)
clock=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
stages=[]
for name in ['compiled','source']:
 child=subprocess.Popen(['python3',str(r/('run-d68f-full-'+name+'.py'))],cwd=r)
 state={'stage':name,'startedAt':clock(),'supervisorPid':os.getpid(),'ownedChildPid':child.pid,'releaseReady':False};(out/'STATE.json').write_text(json.dumps(state,indent=2));print(json.dumps(state),flush=True)
 code=child.wait();row={'stage':name,'exitCode':code,'terminalProcessObserved':True,'at':clock()};stages.append(row);(out/'STAGES.json').write_text(json.dumps(stages,indent=2));print(json.dumps(row),flush=True)
compiledPath=r/'evidence/d68f-full-compiled/FULL-COMPLETION.json';sourcePath=r/'evidence/d68f-full-source/SOURCE-COMPLETION.json';compiled=json.loads(compiledPath.read_text())if compiledPath.exists()else{};source=json.loads(sourcePath.read_text())if sourcePath.exists()else{}
clean=all(x['exitCode']==0 for x in stages)and compiled.get('cleanCompleteRun')is True and compiled.get('passed')==501 and source.get('exitCode')==0 and source.get('passed')==2924 and source.get('testFiles')==493 and source.get('allGroupsFresh')is True
result={'exitCode':0 if clean else 1,'terminalProcessObserved':True,'at':clock(),'sourceSha256':'d68f632c304c96aa4e6a75310e929b946d266d66f4b9397fda03577b1c657354','identities':compiled.get('identities'),'compiled':{k:compiled.get(k)for k in ['exitCode','passed','failed','fullGroups','all501IdentitiesPresent','allProcessesExitZero','cleanCompleteRun','fixtureClosures','pendingHandlersAtClosure','crossTestFixtureOverlaps']},'source':{k:source.get(k)for k in ['exitCode','passed','failed','testFiles','allGroupsFresh','allProcessesExitZero','priorAssertionsPreserved','priorCriteriaMissing','newAssertions','sourceFilesUnchanged','allTestFilesCovered']},'sourceGroups':len(source.get('groups',[])),'stages':stages,'originalAndParentSourcesPreserved':True,'servedPreviewsTouched':False,'liveProfileAccessed':False,'productionCredentialsAccessed':False,'paidCalls':0,'browserActions':0,'nativeAcceptance':False,'unaidedAcceptance':False,'ordinaryFunctionalReview':'assigned separately; not credited here','releaseReady':False,'finalZip':False}
(out/'COMPLETION.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True);raise SystemExit(result['exitCode'])
