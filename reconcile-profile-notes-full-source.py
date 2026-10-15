from pathlib import Path
import json,hashlib,collections
r=Path(__file__).resolve().parent;out=r/'evidence/profile-notes-full-source';old=r.parent/'ekas-v106-guide-prerequisite-working';groups=json.loads((out/'GROUPS.json').read_text())['groups'];before=json.loads((out/'SOURCE-BEFORE.json').read_text());after=json.loads((out/'SOURCE-AFTER.json').read_text());assert before==after
assert json.loads((out/'TYPECHECK.json').read_text())['exitCode']==0 and json.loads((out/'TYPECHECK.json').read_text())['sourceFiles']==before
assert json.loads((out/'NODE-BEFORE.json').read_text())==before==json.loads((out/'NODE-AFTER.json').read_text())
rows=[]
for group in groups:
 d=json.loads((out/('shard-'+group+'-results.json')).read_text());assert d['success']and d['numFailedTests']==0
 selected=json.loads((out/'GROUPS.json').read_text()).get('perCaseSelections',{}).get(group)
 assertions=[a for t in d['testResults'] for a in t['assertionResults']]
 if selected:
  assert sorted(a['fullName'] for a in assertions if a['status']=='passed')==sorted(selected)
  assert all(a['status']=='skipped' for a in assertions if a['fullName'] not in selected)
 rows += [{'file':str(Path(t['name']).relative_to(r/'app')),'fullName':a['fullName'],'status':a['status'],'group':group}for t in d['testResults']for a in t['assertionResults'] if selected is None or a['fullName'] in selected]
assert all(a['status']=='passed'for a in rows)
prior=json.loads((old/'evidence/V106-FINAL-SOURCE-COVERAGE-MAP.json').read_text())['assertions'];base=collections.Counter((a['file'],a['fullName'])for a in prior);current=collections.Counter((a['file'],a['fullName'])for a in rows);transition=json.loads((r/'evidence/PROFILE-NOTES-CRITERIA-TRANSITION.json').read_text());retired=collections.Counter((a['file'],a['fullName'])for a in transition['retired']);replacement=collections.Counter((a['file'],a['fullName'])for a in transition['replacement']);assert not retired-base;base=base-retired+replacement;assert not base-current
files={str(p.relative_to(r/'app'))for p in(r/'app/src').rglob('*')if p.is_file()and'.test.ts'in p.name};assert files=={a['file']for a in rows};assert all(n==base.get(k,1)for k,n in current.items())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();invariants={}
for directory in['inputs','public']:
 original=[p for p in(old/'review-v106-immutable/app'/directory).rglob('*')if p.is_file()];assert all(sha(p)==sha(r/'app'/directory/p.relative_to(old/'review-v106-immutable/app'/directory))for p in original);invariants[directory]={'files':len(original),'byteExactPreserved':True}
for name in['package.json','package-lock.json']:assert sha(r/'app'/name)==sha(old/'review-v106-immutable/app'/name)
identity=hashlib.sha256(''.join('app/'+n+'\0'+h+'\n'for n,h in after.items()).encode()).hexdigest()
proof={'sourceSha256':identity,'sourceFiles':len(after),'assertions':rows,'passed':len(rows),'testFiles':len(files),'priorCriteriaCoveredIncludingSevenExplicitReplacements':sum(base.values()),'explicitCriteriaTransition':'evidence/PROFILE-NOTES-CRITERIA-TRANSITION.json','newAssertions':sum((current-base).values()),'preservedPriorRepeatedReporterNameGroups':sum(n>1 for n in base.values()),'typecheckExitCode':0,'sourceStableAcrossVerification':True,'preservedInputsAssets':invariants,'publicDependenciesByteExact':True,'qualification':'Owner source verification only; no live provider, native whole-product, human unaided or independent APPROVE credit.'};(r/'evidence/PROFILE-NOTES-FULL-SOURCE-COVERAGE.json').write_text(json.dumps(proof,indent=2)+'\n');print({k:proof[k]for k in['sourceSha256','sourceFiles','passed','testFiles','priorCriteriaCoveredIncludingSevenExplicitReplacements','newAssertions']})
