"""Synthetic relational observation authoring only. No expected UI result values."""
import json,hashlib
from pathlib import Path
from datetime import datetime,timedelta,timezone
P=Path(__file__).resolve().parent
NS='training-ui-acceptance-v1'
t={k:[] for k in ['sites','lines','assets','products','revisions','routes','operations','standards','periods','jobs','lots','run_intervals','downtime_intervals','unknown_equipment_intervals','counts','schedules','labor_shifts','equipment_observation_coverage','fixture_provenance']}
def add(table,id,known_at='2026-06-20T00:00:00Z',**fields):
 row={'namespace':NS,'record_version':1,'kind':'synthetic','id':id,'known_at':known_at,**fields};t[table].append(row);return row
add('sites','UIA-S1',timezone='UTC')
add('lines','UIA-L1',site_id='UIA-S1')
add('assets','UIA-A1',line_id='UIA-L1',installed_at='2025-01-01T00:00:00Z',repairable=True)
add('products','UIA-P1',base_unit='piece')
add('revisions','UIA-P1-R1',product_id='UIA-P1',revision='R1',valid_from='2026-07-01T00:00:00Z',valid_to_exclusive='2026-10-01T00:00:00Z')
add('routes','UIA-P1-R1-ROUTE',revision_id='UIA-P1-R1',operation_ids=['UIA-P1-R1-OP10'])
add('operations','UIA-P1-R1-OP10',revision_id='UIA-P1-R1',route_order=10)
add('standards','UIA-P1-R1-OP10-STD',operation_id='UIA-P1-R1-OP10',valid_from='2026-07-01T00:00:00Z',valid_to_exclusive='2026-10-01T00:00:00Z',ideal_cycle_min=0.5,standard_labor_h_per_unit=0.01,policy_version='synthetic-ui-standard@1',authority='fictional standard only, not customer approval')
def job(id,day,good,produced,firstpass,run,down,context):
 start=day+'T06:00:00Z';end=day+'T14:00:00Z';mid=(datetime.fromisoformat(start.replace('Z','+00:00'))+timedelta(minutes=run or 0)).isoformat().replace('+00:00','Z');known=end
 add('periods',id+'-DAY',known_at=day+'T00:00:00Z',start=day+'T00:00:00Z',end=(datetime.fromisoformat(day)+timedelta(days=1)).strftime('%Y-%m-%d')+'T00:00:00Z')
 add('jobs',id,known_at=known,line_id='UIA-L1',asset_id='UIA-A1',revision_id='UIA-P1-R1',operation_id='UIA-P1-R1-OP10',lot_id=id+'-LOT',start=start,end=end,planned_min=480,run_min=run,down_min=down,coverage=1 if run is not None else 0,fixture_context=context,quality_disposition_coverage=1 if good is not None else 0)
 add('lots',id+'-LOT',known_at=known,job_id=id,revision_id='UIA-P1-R1',route_id='UIA-P1-R1-ROUTE',release_at=start,completion_at=end)
 if run is not None:
  add('run_intervals',id+'-RUN',known_at=known,job_id=id,asset_id='UIA-A1',start=start,end=mid,primary_state='production')
  if down:
   add('downtime_intervals',id+'-STOP',known_at=known,job_id=id,asset_id='UIA-A1',start=mid,end=end,reason='synthetic material wait',planned=False,included_in_oee_planned_time=True,primary_state='unplanned_stop')
 else:add('unknown_equipment_intervals',id+'-UNKNOWN',known_at=known,job_id=id,asset_id='UIA-A1',start=start,end=end,primary_state='unclassified',classification_presence='UNKNOWN_SOURCE_UNAVAILABLE')
 add('equipment_observation_coverage',id+'-COVERAGE',known_at=known,job_id=id,asset_id='UIA-A1',window_start=start,window_end=end,observed_selected_elapsed_min=480,classified_elapsed_min=480 if run is not None else 0,unclassified_elapsed_min=0 if run is not None else 480,complete_primary_state_partition=run is not None,source_class='fictional direct equipment timeline',zero_stop_assertion=(down==0 and run==480),zero_evidence_basis='whole selected equipment window observed as production' if down==0 else None)
 add('counts',id+'-COUNT',known_at=known,job_id=id,lot_id=id+'-LOT',operation_id='UIA-P1-R1-OP10',produced_unique_units=produced,final_accepted_unique_units=good,first_pass_good_units=firstpass,reworked_accepted_unique_units=good-firstpass if good is not None else None,terminal_scrap_unique_units=produced-good if good is not None else None,quality_disposition_coverage=1 if good is not None else 0,accepted_presence='EXPLICIT_VALUE' if good is not None else 'UNKNOWN_SOURCE_UNAVAILABLE',terminal_outcome_rule='firstpass accepted + recovered accepted + terminal scrap = unique produced; incomplete outcomes remain null')
 add('schedules',id+'-PLAN',known_at=day+'T14:10:00Z',job_id=id,plan_version='synthetic-ui-plan@1',frozen_at=day+'T05:00:00Z',scheduled_qty=produced,scheduled_end=end,completed_qty=produced,as_scheduled_qty=produced,actual_completion=end,approval='fictional plan only')
 add('labor_shifts',id+'-LAB',known_at=known,job_id=id,scheduled_person_h=16,paid_person_h=16,productive_person_h=14,employee_person_h=16,overtime_person_h=0,absent_scheduled_person_h=0,direct_available_person_h=16,direct_productive_person_h=14,human_effort_basis='two fictional people each paid eight hours; never equipment elapsed')
for i in range(84):
 day=(datetime(2026,7,1)+timedelta(days=i)).strftime('%Y-%m-%d');job(f'UIA-PAGE-{i+1:03d}',day,100+i,105+i,100+i,475,5,'pagination-84days')
job('UIA-HIGH-OEE','2026-09-25',864,900,854,460,20,'oee-zero-unavailable')
job('UIA-ZERO-DOWNTIME','2026-09-26',864,900,864,480,0,'oee-zero-unavailable')
job('UIA-UNAVAILABLE','2026-09-27',None,900,None,None,None,'oee-zero-unavailable')
add('fixture_provenance','UIA-PROVENANCE',fixture_version=NS,approval='author synthetic test fixture only; not a production configuration',observation_clock='UTC equipment elapsed; intervals half-open',human_clock='deduplicated person effort separately stated',counts='unique terminal outcomes; rework counted once after acceptance',current_state_claim=False,data_origin='fully synthetic')
(P/'raw-records.json').write_text(json.dumps({'namespace':NS,'schemaVersion':'1.0.0','purpose':'Additive isolated UI acceptance; no original fixture replacement','tables':t,'separation':'Do not merge with training-plant-v1 or canonical domains; explicit fixture/provider selection required','missingDataRule':'null is unavailable, never a numeric zero; no implicit zero from absent stops without complete partition evidence'},indent=2)+'\n')
# Static source-owned metadata fixture, separate from new observation records.
source=Path('/home/pat/Documents/Codex/2026-10-08/task-4/ekas-v25-ui-working/app/src/retained/exactSpecUi.test.tsx')
(P/'ownership-metadata.json').write_text(json.dumps({'fixtureId':'training-ui-ownership-v1','dataFixture':'training-plant-v1','classification':'static synthetic yours boolean, not real current-user authorization','sourcePath':str(source),'sourceLines':[7,7],'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sets':[{'id':'UIA-SET-TEAM','sourceTestId':'team','name':'Shared team set','col':'site','values':['TP-S2'],'yours':False},{'id':'UIA-SET-PERSONAL','sourceTestId':'mine','name':'Personal set','col':'site','values':['TP-S1'],'yours':True}],'isolatedStateOnly':True,'notGranted':True,'synthetic':True},indent=2)+'\n')
print('Synthetic raw records:',sum(map(len,t.values())),'tables:',len(t),'jobs:',len(t['jobs']))
