from pathlib import Path
import json,hashlib,collections
r=Path(__file__).resolve().parent; out=r/'evidence/guide-help-full-compiled'
assert json.loads((r/'evidence/GUIDE-HELP-FULL-COMPILED-SUPERVISOR-COMPLETION.json').read_text())['exitCode']==0
summary=json.loads((out/'RUN-SUMMARY.json').read_text()); assert len(summary)==20 and all(x['exitCode']==0 for x in summary)
rows=[]; reports=[]
for item in summary:
 f=out/(item['group']+'-results.json');d=json.loads(f.read_text());assert d['success'] and d['numFailedTests']==0
 reports.append({'report':str(f.relative_to(r)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'passed':d['numPassedTests']})
 for t in d['testResults']:
  for a in t['assertionResults']: rows.append({'file':Path(t['name']).name,'fullName':a['fullName'],'status':a['status'],'group':item['group']})
assert all(x['status']=='passed'for x in rows)
prior=json.loads((r.parent/'ekas-v106-guide-prerequisite-working/evidence/V106-COMPILED-UNION-COVERAGE.json').read_text())['assertions']
groupAliases={'metric-all-http':'metric-all-http-final'}
key=lambda x:(x['file'],x['fullName'],groupAliases.get(x['group'],x['group']))
base=collections.Counter(map(key,prior));current=collections.Counter(map(key,rows));assert not base-current
assert sum(base.values())==501
for f in(r/'evidence/compiled-harness-template').iterdir():assert f.read_bytes()==(out/f.name).read_bytes()
source=json.loads((r/'evidence/GUIDE-HELP-FULL-SOURCE-COVERAGE.json').read_text())
expected=json.loads((r/'evidence/guide-help-full-source/SOURCE-AFTER.json').read_text())
for basepath in [r/'app',out/'app']:
 actual={str(f.relative_to(basepath)):hashlib.sha256(f.read_bytes()).hexdigest()for f in sorted(basepath.rglob('*'))if f.is_file()and not any(x in f.relative_to(basepath).parts for x in ['node_modules','dist','.cache'])}
 assert actual==expected,'Compiled tests must use exact source-verified app bytes'
proof={'allPassed':True,'totalPassed':len(rows),'allPrior501IdentitiesRetained':True,'allHarnessTemplatesByteExact':True,'explicitReportGroupAliases':groupAliases,'additionalAssertions':sum((current-base).values()),'sourceSha256':source['sourceSha256'],'reports':reports,'assertions':rows,'nativeAccepted':False,'wholeAccepted':False,'qualification':'Owner compiled checks only. Independent native review, human acceptance and real provider actions are separate.'}
(r/'evidence/GUIDE-HELP-FULL-COMPILED-COVERAGE.json').write_text(json.dumps(proof,indent=2)+'\n');print({k:proof[k]for k in ['totalPassed','allPrior501IdentitiesRetained','sourceSha256']})
