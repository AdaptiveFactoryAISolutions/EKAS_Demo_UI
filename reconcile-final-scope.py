from pathlib import Path
import json,hashlib,collections
r=Path(__file__).resolve().parent;register=json.loads((r/'docs/FINAL-CLOSURE-REGISTER.json').read_text());entries=register['entries'];ids=[e['id']for e in entries];assert len(ids)==len(set(ids))
kinds=collections.Counter(e['kind']for e in entries);assert kinds['obligation']==82 and kinds['atomic-criterion']==294 and kinds['guide-workflow']==85
assert {e['id']for e in entries if e['kind']=='obligation'}=={f'M{x:02d}'for x in range(1,47)}|{f'N{x:02d}'for x in range(1,37)}
assert all(e['status']in register['allowedStatuses']for e in entries)
matrix=json.loads((r/'docs/FULL-COVERAGE-MATRIX.json').read_text());counts=collections.Counter(x['type']for x in matrix['rows']);assert counts=={'source_occurrence':322,'template_control':191,'template_workflow':85,'ekas_capability':56}
hashes=[]
for old,digest in matrix['source_hashes'].items():
 f=r/'app/inputs'/Path(old).name;actual=hashlib.sha256(f.read_bytes()).hexdigest();assert actual==digest;hashes.append({'path':str(f.relative_to(r)),'sha256':actual})
assert len(hashes)==7 and len(matrix['canonical_groups'])==162
proof={'obligations':82,'atomicCriteria':294,'guideWorkflowIds':85,'separateFindings':kinds['finding'],'uniqueRegisterIds':True,'statusCounts':dict(collections.Counter(e['status']for e in entries)),'sourceCounts':matrix['source_counts'],'matrixRows':dict(counts),'sevenOriginalSourcesByteExact':hashes,'localPackageFacets':len(register['localPackages']),'qualification':'Inventory and traceability reconciliation only. Statuses retain their required independent/native/user acceptance; no acceptance inferred from completeness of mapping.'}
(r/'evidence/FINAL-SCOPE-RECONCILIATION.json').write_text(json.dumps(proof,indent=2)+'\n');print({k:proof[k]for k in ['obligations','atomicCriteria','guideWorkflowIds','separateFindings','statusCounts']})
