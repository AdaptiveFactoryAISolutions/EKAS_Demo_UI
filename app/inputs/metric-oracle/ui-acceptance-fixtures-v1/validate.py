import json,hashlib
from pathlib import Path
from datetime import datetime
P=Path(__file__).resolve().parent
read=lambda n:json.loads((P/n).read_text());raw=read('raw-records.json');t=raw['tables'];oracle=read('known-answers.json');checks=[]
def check(name,b):
 assert b,name
 checks.append(name)
def minutes(a,b):return(datetime.fromisoformat(b.replace('Z','+00:00'))-datetime.fromisoformat(a.replace('Z','+00:00'))).total_seconds()/60
for f in P.glob('*.json'):json.loads(f.read_text())
check('JSON parses',True)
ids=[r['id']for rows in t.values()for r in rows];check('raw IDs globally unique',len(ids)==len(set(ids)));check('87jobs /84 pagination plus3edges',len(t['jobs'])==87 and len([j for j in t['jobs']if j['fixture_context']=='pagination-84days'])==84)
check('790records /19tables',len(ids)==790 and len(t)==19)
fk={'site_id':'sites','line_id':'lines','asset_id':'assets','product_id':'products','revision_id':'revisions','operation_id':'operations','job_id':'jobs','lot_id':'lots','route_id':'routes'}
for table,rows in t.items():
 for r in rows:
  check('namespace/kind/version '+r['id'],r['namespace']==raw['namespace']and r['record_version']==1 and r['kind']=='synthetic')
  check('cutoff '+r['id'],r['known_at']<='2026-09-29T00:00:00Z')
  for field,target in fk.items():
   if field in r:check('FK '+r['id']+'.'+field,any(x['id']==r[field]for x in t[target]))
for job in t['jobs']:
 c=next(x for x in t['counts']if x['job_id']==job['id']);cv=next(x for x in t['equipment_observation_coverage']if x['job_id']==job['id']);run=[x for x in t['run_intervals']if x['job_id']==job['id']];stop=[x for x in t['downtime_intervals']if x['job_id']==job['id']];unk=[x for x in t['unknown_equipment_intervals']if x['job_id']==job['id']];intervals=sorted(run+stop+unk,key=lambda x:x['start'])
 check('equipment partition '+job['id'],minutes(job['start'],job['end'])==480 and sum(minutes(x['start'],x['end'])for x in intervals)==480 and intervals[0]['start']==job['start']and intervals[-1]['end']==job['end']and all(intervals[i-1]['end']==intervals[i]['start']for i in range(1,len(intervals))))
 check('covered minutes '+job['id'],cv['classified_elapsed_min']+cv['unclassified_elapsed_min']==480)
 if c['final_accepted_unique_units']is not None:
  check('terminal count conservation '+job['id'],c['first_pass_good_units']+c['reworked_accepted_unique_units']==c['final_accepted_unique_units']and c['final_accepted_unique_units']+c['terminal_scrap_unique_units']==c['produced_unique_units'])
  check('ideal within observedruntime '+job['id'],c['produced_unique_units']*.5<=job['run_min'])
 else:check('explicit missing counts/timeline '+job['id'],all(c[k]is None for k in ['final_accepted_unique_units','first_pass_good_units','terminal_scrap_unique_units','reworked_accepted_unique_units'])and job['run_min']is None and job['down_min']is None and not cv['complete_primary_state_partition'])
ordered=sorted(t['jobs'],key=lambda x:x['start']);check('noasset overlap/duplicates',all(ordered[i-1]['end']<=ordered[i]['start']for i in range(1,len(ordered))))
rows={x['jobId']:x for x in oracle['rows']}
for id in ['UIA-HIGH-OEE','UIA-ZERO-DOWNTIME']:check('independent 90percent '+id,rows[id]['oeeFraction']==.9 and rows[id]['oeePercent']==90 and rows[id]['goodUnits']==864 and rows[id]['idealGoodMinutes']==432 and rows[id]['plannedMinutes']==480)
check('verifiedzero distinct missing',rows['UIA-ZERO-DOWNTIME']['downtimeMinutes']==0 and rows['UIA-HIGH-OEE']['downtimeMinutes']==20 and rows['UIA-UNAVAILABLE']['downtimeMinutes']is None and rows['UIA-UNAVAILABLE']['oeeFraction']is None)
check('zero evidence positive full exposure',next(x for x in t['equipment_observation_coverage']if x['job_id']=='UIA-ZERO-DOWNTIME')['zero_stop_assertion'] and next(x for x in t['run_intervals']if x['job_id']=='UIA-ZERO-DOWNTIME')['end']=='2026-09-26T14:00:00Z')
p=oracle['paginationAcceptance'];check('independent sum100..183',p['fullPopulationGoodSum']==11886 and sum(range(100,184))==11886);check('first80distinct/4hidden',p['totalDistinctGroups']==84 and p['returnedGroupsAtLimit80']==80 and p['returnedGoodSum']==11480 and p['hiddenGoodSum']==406 and sum(range(104,184))==11480 and p['firstReturnedJob']=='UIA-PAGE-084' and p['lastReturnedJob']=='UIA-PAGE-005');check('raw distinct dates',len({r['day']for r in oracle['rows']if r['contextId']=='pagination-84days'})==84)
check('oracle rawhash',oracle['rawSha256']==hashlib.sha256((P/'raw-records.json').read_bytes()).hexdigest())
metadata=read('ownership-metadata.json');check('existing ownership sourcehash',hashlib.sha256(Path(metadata['sourcePath']).read_bytes()).hexdigest()==metadata['sourceSha256']);check('All/Yours static source classification',[x['name']for x in metadata['sets']]==['Shared team set','Personal set']and[x['name']for x in metadata['sets']if x['yours']]==['Personal set']and metadata['notGranted'])
bind=read('source-and-protection-binding.json')
for path,h in bind['protectedArtifacts'].items():check('protected '+path,hashlib.sha256(Path(path).read_bytes()).hexdigest()==h)
check('source request preserved',hashlib.sha256(Path(bind['sourceRequest']).read_bytes()).hexdigest()==bind['requestSha256'])
report={'status':'PASS','checks':len(checks),'rawRecords':len(ids),'tables':len(t),'jobs':87,'scope':'fixture integrity and independent arithmetic only; not product/API/UI integration','checksPassed':checks};(P/'verification-report.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS',len(checks),'checks; protected64files unchanged')
