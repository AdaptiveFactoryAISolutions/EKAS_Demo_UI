from pathlib import Path
import subprocess,json,shutil,hashlib,datetime
r=Path(__file__).resolve().parent;owner=r/'evidence/profile-notes-full-compiled';owner.mkdir(exist_ok=False)
for f in(r/'evidence/compiled-harness-template').iterdir():shutil.copy2(f,owner/f.name)
summary=[]
for name,cmd in [('browser',[str(r/'app/node_modules/.bin/vite'),'build']),('server',[str(r/'app/node_modules/.bin/vite'),'build','--ssr','src/server/demoServer.ts','--outDir','../profile-notes-full-server','--emptyOutDir']),('local-server',[str(r/'app/node_modules/.bin/vite'),'build','--ssr','src/server/localDemoServer.ts','--outDir','../profile-notes-full-local-server','--emptyOutDir'])]:
 with(r/('evidence/profile-notes-full-'+name+'-build.txt')).open('w')as log:p=subprocess.run(cmd,cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
 print(json.dumps({'build':name,'exitCode':p.returncode}),flush=True)
 if p.returncode:raise SystemExit(p.returncode)
for src,dst in [(r/'app',owner/'app'),(r/'app/dist',owner/'static'),(r/'profile-notes-full-server',owner/'server')]:shutil.copytree(src,dst,ignore=shutil.ignore_patterns('node_modules','dist','.cache','.git'))
(owner/'server/package.json').write_text('{"type":"module"}\n');(r/'profile-notes-full-local-server/package.json').write_text('{"type":"module"}\n');(owner/'node_modules').symlink_to(r/'app/node_modules',target_is_directory=True)
for tag,config in [('attention-http','v105-attention-http.config.mts'),('obligation-http','v104-obligation-http.config.mts'),('genealogy-calendar-http','v104-genealogy-calendar-http.config.mts'),('genealogy-http','v103-genealogy-http.config.mts'),('measurement-http','v102-measurement-http.config.mts'),('health-http','v101-health-http.config.mts'),('evidence-http','v100-evidence-http.config.mts'),('diagnostic-http','v99-diagnostic-http.config.mts'),('compiled','final.config.mts'),('exact-workids','workids.config.mts'),('duration','duration.config.mts'),('containment-recovery-ui','v98-containment-recovery-ui.config.mts'),('containment-http','v98-containment-http.config.mts'),('operating-workload-http','v97-operating-workload-http.config.mts'),('governed-http','v96-governed-http.config.mts'),('compiled-mock-current','v93-mock.config.mts'),('long-sessions','v95-long.config.mts'),('additive-http','additive.config.mts'),('independent-corrections','review-corrections.config.mts'),('metric-all-http','metric-all-http.config.mts')]:
 report=owner/(tag+'-results.json')
 with(owner/(tag+'.txt')).open('w')as log:p=subprocess.run([str(r/'app/node_modules/.bin/vitest'),'run','--config',config,'--reporter=json','--outputFile',str(report)],cwd=owner,stdout=log,stderr=subprocess.STDOUT)
 d=json.loads(report.read_text())if report.exists()else{};row={'group':tag,'exitCode':p.returncode,'passed':d.get('numPassedTests'),'failed':d.get('numFailedTests'),'total':d.get('numTotalTests')};summary.append(row);print(json.dumps(row),flush=True);(owner/'RUN-SUMMARY.json').write_text(json.dumps(summary,indent=2))
 if p.returncode:raise SystemExit(p.returncode)
(owner/'COMPLETION.json').write_text(json.dumps({'exitCode':0,'terminalProcessObserved':True,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
