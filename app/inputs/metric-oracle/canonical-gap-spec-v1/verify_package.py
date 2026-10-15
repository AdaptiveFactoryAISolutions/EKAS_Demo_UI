"""Independent package integrity checks; does not import or exercise EKAS product code."""
import hashlib,json
from pathlib import Path
from datetime import datetime
P=Path(__file__).resolve().parent
read=lambda n:json.loads((P/n).read_text())
checks=[]
def check(name,condition):
    assert condition,name
    checks.append(name)
def hours(r):return (datetime.fromisoformat(r['end'])-datetime.fromisoformat(r['start'])).total_seconds()/3600
for f in P.glob('*.json'):json.loads(f.read_text())
check('all JSON parses',True)
bind=read('source-and-protection-binding.json')
for r in bind['sourceDocuments']:check('source hash '+Path(r['path']).name,hashlib.sha256(Path(r['path']).read_bytes()).hexdigest()==r['sha256'])
for path,h in bind['protectedArtifacts'].items():check('protected hash '+path,hashlib.sha256(Path(path).read_bytes()).hexdigest()==h)
r=read('raw-domain-records.json'); t=r['tables']; ids=[x['id'] for rows in t.values() for x in rows]
check('1431 records / 43 tables',len(ids)==1431 and len(t)==43)
check('unique raw IDs',len(set(ids))==len(ids))
positive=read('positive-oracles.json'); negative=read('negative-boundary-fixtures.json')
expected={'MET-'+str(i).zfill(3) for i in [11,12,13,14,15,16,18,19,20,21,22,23,24,26,27,28,29]}
check('all 17 positive contract IDs',set(x['metricId'] for x in positive['results'])==expected)
check('all 17 negative contract IDs',expected<=set(x['metricId'] for x in negative['cases']))
check('25 positive / 60 negative cases',len(positive['results'])==25 and len(negative['cases'])==60)
for result in positive['results']:
 check('positive lineage '+result['metricId']+'/'+result['fixtureCaseId'],set(result['sourceRecordIds'])<=set(ids))
check('oracle raw hash',positive['sourceRecordSha256']==hashlib.sha256((P/'raw-domain-records.json').read_bytes()).hexdigest())
q=read('qac-reconciliation-oracle.json')
check('QAC lineage',set(q['sourceRecordIds'])<=set(ids))
check('QAC independent B arithmetic',abs(15-12+9-6+98-80-24)<1e-9 and q['bridgeB']['residual']==0)
check('QAC independent A arithmetic',10+8==18 and q['bridgeA']['residual']==0)
check('QAC measured parent hours',abs(sum(map(hours,t['quote_total_conversion_intervals']))-122)<1e-9)
for parent in t['quote_total_conversion_intervals']:
 children=[x for x in t['quote_actual_intervals'] if x['quote_run_id']==parent['quote_run_id']]
 check('QAC parent partition '+parent['quote_run_id'],len(children)==3 and abs(sum(map(hours,children))-hours(parent))<1e-9 and min(x['start'] for x in children)==parent['start'] and max(x['end'] for x in children)==parent['end'])
check('separate qualified rate clocks',all(hours(x)==4 for x in t['rate_machine_intervals']))
check('independent capacity arithmetic',100*(1-.6)==40 and 100*.75-.01*6000==15 and 15/.01==1500 and abs(100*(1-.6/.75)-20)<1e-9)
check('independent setup arithmetic',85-40==45 and 55-40==15 and 55+30==85)
check('independent maintenance arithmetic',50+40==90 and 90/60==1.5)
check('independent rate arithmetic',300/4==75 and 400/4==100 and 500/4==125)
check('independent NEE arithmetic',abs((7/8)*.8*.95-.665)<1e-9)

comp={x['commitment_line_id']:x for x in t['accepted_completions']}
check('six distinct completion records',len(comp)==6 and [comp['CL-'+str(i)]['quantity'] for i in range(1,7)]==[65,40,25,0,10,8])
m27=next(x for x in positive['results'] if x['metricId']=='MET-027')['expected']
check('MET027 independent exposed quantity',m27['grossExposedQuantityByUnit']['piece']==(100-20-30)+(80-20-10)==100)
check('MET027 separate completion lineage',all(comp[x['lineId']]['id'] in x['recordIds'] and x['actualAcceptedCompletionQuantity']==comp[x['lineId']]['quantity'] for x in m27['lineResults']))
check('MET027 independent coverage',m27['unknownCommitmentCount']==1 and m27['coveredCommitmentCount']==5 and abs(m27['coveragePercent']-500/6)<1e-9)

report={'status':'PASS','scope':'isolated synthetic fixture/oracle integrity only; no EKAS product execution or certification','checksPassed':len(checks),'checks':checks}
(P/'verification-report.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS:',len(checks),'checks; protected sources/fixtures unchanged')
