from pathlib import Path
import shutil,json,hashlib
r=Path(__file__).resolve().parent;out=r/'release-rc1';assert not out.exists();out.mkdir()
source=json.loads((r/'evidence/FINAL-SOURCE-COVERAGE.json').read_text());assert source['typecheckExitCode']==0 and source['sourceStableAcrossVerification']
compiled=json.loads((r/'evidence/FINAL-COMPILED-SUPERVISOR-COMPLETION.json').read_text());assert compiled['exitCode']==0
expected=json.loads((r/'evidence/final-source/SOURCE-AFTER.json').read_text());current={str(p.relative_to(r/'app')):hashlib.sha256(p.read_bytes()).hexdigest()for p in sorted((r/'app').rglob('*'))if p.is_file()and not any(x in p.relative_to(r/'app').parts for x in ['node_modules','dist','.cache'])};assert current==expected,'Current source differs from selected full-coverage proof; bind the correct completed candidate before packaging.'
for src,dst in [(r/'app',out/'app'),(r/'app/dist',out/'static'),(r/'docs',out/'docs'),(r/'integration',out/'integration')]:shutil.copytree(src,dst,ignore=shutil.ignore_patterns('node_modules','dist','.cache','.git','__pycache__','.env','.env.*','Key.txt'))
(out/'server').mkdir()
for base in[r/'compiled-server',r/'compiled-local-server']:
 for f in base.rglob('*'):
  if f.is_file():
   dest=out/'server'/f.relative_to(base);dest.parent.mkdir(parents=True,exist_ok=True)
   if dest.exists():assert dest.read_bytes()==f.read_bytes()
   else:shutil.copy2(f,dest)
(out/'server/package.json').write_text('{"type":"module"}\n')
(out/'evidence').mkdir()
shutil.copytree(r/'evidence/historical-activation-docs',out/'evidence/historical-activation-docs')
for name in['FOLLOWUP-CANDIDATE-READINESS.json','RC-FOLLOWUP-COMPILED-PROOF.json','RC-MOCK-HISTORY-34-HTTP-PROOF.json','RC-FINAL-MOCK-HISTORY-34-HTTP-PROOF.json','rc-followup-mock-green-results.json','rc-followup-shape-red-results.json','rc-followup-mock-red-results.json','rc-incomplete-red-results.json','rc-incomplete-green-results.json','RC-INCOMPLETE-GREEN-COMPLETION.json','OPENAI-INCOMPLETE-DIAGNOSTIC-SOURCE-REVIEW-20261015.json','rc-restored-operation-red-results.json','rc-restored-operation-green-results.json','RC-RESTORED-OPERATION-GREEN-COMPLETION.json','RC-OPERATING-REVIEW-WORKING-COMPLETION.json','rc-operating-review-related-results.json','FINAL-SOURCE-COVERAGE.json','FINAL-PUBLIC-DEPENDENCIES.json','FINAL-COMPILED-COVERAGE.json','FINAL-COMPILED-SUPERVISOR-COMPLETION.json','RC-TOPIC-CONTEXT-WORKING-COMPLETION.json','RC-PRIORITY-WORKING-COMPLETION.json','RC-PRIORITY-LABEL-WORKING-COMPLETION.json','RC-OPERATION-STATUS-WORKING-COMPLETION.json','RC-CONSERVATIVE-RECOVERY-WORKING-COMPLETION.json','RC-COMPILED-CONSERVATIVE-RECOVERY-PROOF.json','RC-FROZEN-RECOVERY-CLI-PROOF.json','RC-AUDIT-JOURNEY-WORKING-COMPLETION.json','RC-COMPILED-AUDIT-MASTER-PROOF.json','rc-audit-adjacent-final-related.json','rc-operation-review-status-red.json','rc-operation-review-status-final-related.json','rc-priority-context-label-red.json','rc-priority-context-label-green.json','rc-priority-red.json','rc-priority-targeted.json','rc-priority-working-extended-results.json','OPENAI-FIRST-USE-PRICING-REVIEW-20261015.json','rc-plant-topic-red.json','rc-plant-topic-final-related.json','RC-HEADER-SETTLE-CORRECTION.json','rc-header-settle-red.json','rc-header-position-preflight.json','RC-ADMIN-DIALOG-WORKING-COMPLETION.json','rc-admin-confirm-red.json','rc-admin-confirm-corrected.json','BUDGET-RECOVERY-SEARCH-CONCLUSION.json','FINAL-SCOPE-RECONCILIATION.json','FINAL-OPERATOR-NODE-PROOF.json','OPENAI-PRIMARY-SOURCE-REVIEW-20261014.json','rc-final-adverse-regression-attempt.json','rc-genealogy-corrected-attempt.json','rc-position-corrected-attempt.json','rc-shared-profile-budget-attempt.json']:
 f=r/'evidence'/name;assert f.is_file(),str(f);shutil.copy2(f,out/'evidence'/name)
shutil.copytree(r/'evidence/independent-cf-ordinary-review',out/'evidence/independent-cf-ordinary-review')
# Curated synthetic verification history only; never copy actual owner profiles or accounting journals.
for name in ['THREE-FIX-REGISTER-RECONCILIATION.json','CF-NATIVE-MOCK-PREVIEW-IDENTITY.json']:
 shutil.copy2(r/'evidence'/name,out/'evidence'/name)
for folder in ['history-source-3771-comparison-procedure-timeout','history-source-3771-batch2-timeouts','history-source-3771-final-fpy-semantic-failure','history-cf-compiled-diagnostic-deadline','history-cf-compiled-reconcile-group-alias','history-cf-hosted-smoke-mock-budget-path']:
 base=r/'evidence'/folder;dest=out/'evidence'/folder;dest.mkdir()
 for f in base.iterdir():
  if f.is_file() and f.suffix in ['.json','.txt','.md','.py','.mjs']:
   shutil.copy2(f,dest/f.name)
 startup=base/'startup-node-runtime-mismatch'
 if startup.exists():shutil.copytree(startup,dest/startup.name)
# No private profiles, owner bootstrap code, budgets, runtime state or node_modules.
assert not any(p.name in['node_modules','private','.git']for p in out.rglob('*'))
print(json.dumps({'releaseTree':str(out),'qualification':'Prepared only; fresh extraction/CLI/offline/security/coverage/native/user acceptance still required before final-ready claim.'}))
