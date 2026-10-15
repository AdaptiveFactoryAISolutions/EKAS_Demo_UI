from pathlib import Path
import json,hashlib,zipfile,shutil
r=Path(__file__).resolve().parent;t=r/'release-rc1';assert t.is_dir()
hold=r/'evidence/FINAL-FREEZE-HOLD.json';assert not hold.exists() or not json.loads(hold.read_text())['hold'],'Parent native-review hold remains active'
source=json.loads((r/'evidence/FINAL-SOURCE-COVERAGE.json').read_text());compiled=json.loads((r/'evidence/FINAL-COMPILED-COVERAGE.json').read_text())
assert source['sourceStableAcrossVerification']and compiled['allPassed']and compiled['allPrior501IdentitiesRetained']
assert json.loads((r/'evidence/FINAL-PIPELINE-COMPLETION.json').read_text())['exitCode']==0
assert json.loads((r/'evidence/FINAL-OPERATOR-NODE-PROOF.json').read_text())['passed']==13
(t/'package.json').write_text('{"private":true,"type":"module"}\n')
(t/'README.md').write_text("# EKAS final RC1 provisional review\n\nUse Node 20.20.2 or later. From this directory run: `node integration/local-demo/start.mjs --port 18330 --state /your/private/demo/state.json --owner-code /your/private/demo/owner-code`. Choose unused explicit port and private profile paths. AI starts disabled; see docs/LOCAL-ADMIN-RUNBOOK.md. No key belongs in launch arguments, files in this package or browser storage.\n\nThe compiled local runtime requires no node_modules, private repository or external service. Public dependency installation for editable source is separate: `cd app`, `npm ci`, `npm run build`. The actual bundled Highcharts/Dashboards/Grid are retained.\n\nThis is synthetic data and provisional review, not production acceptance. Read docs/FINAL-REVIEW-STATUS.md and the single docs/FINAL-CLOSURE-REGISTER.json. OpenAI is the intended server provider; Tom production API conformance is engineer work. No real key, provider call, private budget history, fabricated human score or approval is shipped.\n")
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
files={str(f.relative_to(t)):{'sha256':sha(f),'bytes':f.stat().st_size}for f in sorted(t.rglob('*'))if f.is_file()}
def tree(prefix):return hashlib.sha256(''.join(n+'\0'+v['sha256']+'\n'for n,v in files.items()if n.startswith(prefix+'/')).encode()).hexdigest()
assert tree('app')==source['sourceSha256']
m={'version':'EKAS-DEMO-FINAL-RC1','status':'PROVISIONAL_REVIEW','sourceSha256':tree('app'),'staticSha256':tree('static'),'serverSha256':tree('server'),'sourceChecks':source['passed'],'compiledChecks':compiled['totalPassed'],'operatorFakeChecks':13,'liveProviderActivated':False,'TomBackendConformance':False,'nativeAccepted':False,'wholeProductAccepted':False,'files':files}
(t/'MANIFEST.json').write_text(json.dumps(m,indent=2)+'\n')
z=r/'EKAS_DEMO_FINAL_RC1_PROVISIONAL_REVIEW.zip';assert not z.exists()
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED)as archive:
 for f in sorted(t.rglob('*')):
  if f.is_file():archive.write(f,str(f.relative_to(t)))
with zipfile.ZipFile(z)as archive:
 names=archive.namelist();assert archive.testzip()is None and len(names)==len(set(names));assert all(not Path(n).is_absolute()and'..'not in Path(n).parts for n in names)
identity={k:m[k]for k in ['version','status','sourceSha256','staticSha256','serverSha256','sourceChecks','compiledChecks']};identity.update({'zip':z.name,'zipSha256':sha(z),'zipBytes':z.stat().st_size,'zipEntries':len(names),'manifestSha256':sha(t/'MANIFEST.json'),'LibrarySaved':False})
assert z.stat().st_size<50000000
(r/'FINAL-RC1-FROZEN-IDENTITY.json').write_text(json.dumps(identity,indent=2)+'\n');print(identity)
