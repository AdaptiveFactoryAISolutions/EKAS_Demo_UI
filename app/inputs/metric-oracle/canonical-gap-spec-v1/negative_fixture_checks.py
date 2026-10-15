"""Executable negative/boundary fixture oracle, not product/backend implementation."""
import json,copy,math
from pathlib import Path
from datetime import datetime,timedelta
R=Path(__file__).resolve().parent;raw=json.loads((R/'raw-domain-records.json').read_text());base=raw['tables'];cases=[]
def dt(s):return datetime.fromisoformat(s.replace('Z','+00:00'))
def hrs(a,b):return (dt(b)-dt(a)).total_seconds()/3600
def dur(rows):return sum(hrs(x['start'],x['end']) for x in rows)
def patch(table,id,**fields):return {'operation':'patch','table':table,'id':id,'fields':fields}
def remove(table,id):return {'operation':'remove','table':table,'id':id}
def removeWhere(table,field,value):return {'operation':'removeWhere','table':table,'field':field,'value':value}
def apply(actions):
 t=copy.deepcopy(base)
 for a in actions:
  if a['operation']=='remove':t[a['table']]=[r for r in t[a['table']] if r['id']!=a['id']]
  elif a['operation']=='removeWhere':t[a['table']]=[r for r in t[a['table']] if r.get(a['field'])!=a['value']]
  elif a['operation']=='patch':
   r=next(x for x in t[a['table']] if x['id']==a['id']);r.update(a['fields'])
  elif a['operation']=='copy':
   r=copy.deepcopy(next(x for x in t[a['table']] if x['id']==a['id']));r['id']=a['newId'];t[a['table']].append(r)
 return t
def no(reason,**fields):return {'value':None,'fixtureState':reason,**fields}
def ok(value,**fields):return {'value':value,'fixtureState':'AVAILABLE_SYNTHETIC_ARITHMETIC',**fields}
def evaluate(mid,t,q):
 if mid in ('MET-015','MET-016'):return no('DEFINITION_REQUIRED' if mid=='MET-015' else 'VALUATION_BASIS_REQUIRED')
 if mid in ('MET-011','MET-012','MET-013','MET-014'):
  rows=[x for x in t['equipment_intervals'] if x['order_id']=='CAP-ORDER'];pbt=dur([x for x in rows if x['primary_state']=='planned_busy']);counts=[x for x in t['production_counts'] if x['order_id']=='CAP-ORDER'];good=sum(x['accepted_good_unique_pieces'] for x in counts);ict=t['oee_component_standards'];pri=[x for x in t['planned_runtime_standards'] if x['id']=='CAP-PRI'];ent=t['oee_entitlements']
  if pbt<=0:return no('NO_PLANNED_BUSY_TIME')
  if not ict or not counts:return no('UNDERLYING_OEE_UNAVAILABLE')
  oee=good*ict[0]['value']/pbt
  if mid=='MET-011':return ok(pbt*(1-oee))
  if not ent:return no('ENTITLEMENT_UNAVAILABLE',fallbackMetric='MET-011')
  ent=ent[0]
  if ent['approval_state']!='approved_in_fictional_fixture' or ent['tool_id']!='ToolX' or dt(ent['valid_to_exclusive'])<=dt('2026-09-01T08:00:00Z'):return no('ENTITLEMENT_UNAVAILABLE',fallbackMetric='MET-011')
  target=ent['value']
  if mid=='MET-014':return no('INVALID_ENTITLEMENT_DENOMINATOR') if target<=0 else ok(pbt*max(0,1-oee/target))
  apco=pbt*max(0,target-oee)
  if mid=='MET-012':return ok(apco)
  if not pri or pri[0]['value']<=0:return no('PLANNED_RUNTIME_PER_ITEM_UNAVAILABLE',fallbackMetric='MET-012',availableHours=apco)
  return ok(apco/pri[0]['value'])
 if mid in ('MET-018','MET-019','MET-020'):
  parent=t['changeovers'][0];elapsed=hrs(parent['start'],parent['end'])*60;standard=t['planned_setup_standards'];seg=t['changeover_segments']
  if mid in ('MET-018','MET-019') and not standard:return no('EFFECTIVE_PUST_UNAVAILABLE',fallbackMetric='MET-017',elapsed_min=elapsed)
  if mid=='MET-018':return ok(max(0,elapsed-standard[0]['value']))
  if not seg:return no('SEGMENT_CLASSIFICATION_UNAVAILABLE')
  intervals=sorted((dt(x['start']),dt(x['end'])) for x in seg)
  if any(intervals[i][0]<intervals[i-1][1] for i in range(1,len(intervals))):return no('CONTRADICTORY_PRIMARY_STATES')
  if mid=='MET-019':return ok(dur([x for x in seg if x['primary_blocking_state']=='active_setup'])*60-standard[0]['value'])
  delays=[x for x in seg if x['primary_blocking_state']=='delay']
  if any(not x.get('causal_asset_id') or not x.get('causal_evidence_id') for x in delays):return no('CAUSAL_ASSET_EVIDENCE_UNAVAILABLE')
  return ok(dur([x for x in delays if x['causal_asset_id']=='ToolX'])*60)
 if mid=='MET-021':return no('COMPONENT_DEFINITION_BINDING_REQUIRED')
 if mid in ('MET-022','MET-024'):
  aa={x['anchor']:x for x in t['semantic_anchors']};seq=sorted(aa,key=lambda k:int(k[1:]));times=[dt(aa[k]['at']) for k in seq]
  if any(times[i]<times[i-1] for i in range(1,len(times))):return no('CONTRADICTORY_ANCHORS_QUARANTINE')
  a,b=('t0',q.get('endAnchor','t7')) if mid=='MET-022' else ('t2',q.get('responseAnchor','t4'))
  if a not in aa or b not in aa:return no('RESTORATION_ANCHOR_UNAVAILABLE' if mid=='MET-022' else 'RESPONSE_ANCHOR_UNAVAILABLE',openEvents=1 if q.get('open') else 0)
  return ok(hrs(aa[a]['at'],aa[b]['at'])*60,aggregateMeanPublishable=False)
 if mid=='MET-023':
  wo=t['work_orders'][0]
  if not wo.get('completed_at'):return no('OPEN_ADMINISTRATIVE_WORK_ORDER')
  if dt(wo['completed_at'])<dt(wo['reported_at']):return no('CONTRADICTORY_ADMINISTRATIVE_ANCHORS')
  return ok(hrs(wo['reported_at'],wo['completed_at'])*60,administrativeProxy=True)
 if mid=='MET-026':
  rows=t['person_work_intervals'];unique={}
  if not rows:return no('PERSON_TIME_UNAVAILABLE')
  for row in rows:
   key=row['source_record_key']
   if key in unique and any(unique[key][k]!=row[k] for k in ['person_token','start','end','failure_event_id']):return no('CONFLICTING_PERSON_TIME_SOURCE_IDENTITY')
   if row.get('allocation')!='exact event link':return no('EVENT_ALLOCATION_UNRESOLVED')
   unique[key]=row
  return ok(dur(list(unique.values())),unit='person_h/repair')
 if mid=='MET-027':
  if not t['plan_snapshots'] or not t['plan_snapshots'][0].get('source_watermark'):return no('CURRENT_PLAN_SOURCE_UNAVAILABLE')
  covered=unknown=count=qty=0
  for l in t['commitment_lines']:
   links=[r for r in t['commitment_production_links'] if r['commitment_line_id']==l['id']];sched=[r for r in t['current_schedule_lines'] if r['commitment_line_id']==l['id']];route=[r for r in t['routing_states'] if r['commitment_line_id']==l['id']]
   if not links or not sched or not route:unknown+=1;continue
   completion=[r for r in t['accepted_completions'] if r['commitment_line_id']==l['id']]
   if len(completion)!=1 or completion[0]['unit']!=l['unit'] or completion[0]['disposition']!='accepted_completed':unknown+=1;continue
   sh=[r for r in t['accepted_shipments'] if r['commitment_line_id']==l['id']];fg=[r for r in t['finished_goods_allocations'] if r['commitment_line_id']==l['id']]
   if any(r['unit']!=l['unit'] for r in sh+fg):unknown+=1;continue
   availableFG=[r for r in fg if r['stock_state']=='accepted_unheld_finished_goods' and r['approval_state']=='approved_in_fictional_fixture']
   openq=l['committed_quantity']-sum(r['quantity'] for r in sh)-sum(r['quantity'] for r in availableFG)
   if openq<0:return no('OVERALLOCATION_POLICY_UNRESOLVED')
   covered+=1;hold=any(r['commitment_line_id']==l['id'] and r['unresolved'] and r['prevents_fulfillment'] for r in t['quality_holds']);rr=route[0]
   exp=dt(sched[0]['scheduled_completion'])>dt(l['required_ship_ready_cutoff']) or hold or rr['blocked'] and not rr['approved_alternate'] or rr['stop_invalidated_plan'] or not all(rr[k] for k in ('qualified_capacity_available','material_available','tooling_available'))
   if exp:count+=1;qty+=openq
  if not covered:return no('ORDER_TO_PRODUCTION_LINKAGE_UNAVAILABLE',unknownCommitments=unknown)
  return ok(qty,exposedCommitments=count,unknownCommitments=unknown,coveredCommitments=covered)
 if mid=='MET-028':
  id=q.get('runId','RATE-BELOW');run=next(x for x in t['qualified_rate_runs'] if x['id']==id);quote=[x for x in t['quoted_rates'] if x['rate_run_id']==id];pieces=[x for x in t['rate_piece_observations'] if x['rate_run_id']==id];intervals=[x for x in t['rate_machine_intervals'] if x['rate_run_id']==id]
  if not quote or quote[0]['value']<=0 or quote[0]['unit']!='piece/h' or quote[0]['approval_state']!='approved_in_fictional_fixture':return no('QUOTED_RATE_UNAVAILABLE')
  if not intervals or any(x['clock']!='equipment_elapsed' for x in intervals):return no('DEMONSTRATED_RATE_UNAVAILABLE')
  candidate=len(pieces);qualified=[x for x in pieces if not x['trial'] and not x['engineering_test'] and not x['rework_reentry'] and dt(run['start'])<=dt(x['at'])<dt(run['end'])];seq=sorted(x['sequence_number'] for x in qualified);window=hrs(run['start'],run['end'])
  if len(qualified)<300 or not 1<=window<=8 or seq!=list(range(1,len(qualified)+1)):return no('INSUFFICIENT_RUNS',candidateParts=candidate,qualifiedParts=len(qualified))
  runtime=dur(intervals)
  if runtime<=0:return no('DEMONSTRATED_RATE_UNAVAILABLE')
  good=sum(x['accepted_good'] for x in qualified);demonstrated=good/runtime;return ok(quote[0]['value']-demonstrated,rateGapPercent=(quote[0]['value']-demonstrated)/quote[0]['value']*100,severity='SEVERITY_UNAVAILABLE')
 if mid in ('QAC-001','MET-029'):
  qa=t['quote_assumptions'];required=['rate','standard_shop_rate','setup','downtime','startup','scrap_yield','rework'];by={k:[x for x in qa if x['assumption_type']==k] for k in required}
  if any(len(v)!=1 for v in by.values()):return no('ASSUMPTION_SCOPE_AMBIGUOUS_OR_MISSING')
  if any(x['presence_state'] in ('NOT_MODELED','UNKNOWN_SOURCE_UNAVAILABLE') for x in qa):return no('DECOMPOSITION_NOT_YET_AVAILABLE',totalOnlyIfSeparateApprovedSameRevisionTotalExists=True)
  if any(x['unit'] not in ('piece/h','USD/h','h/setup','h/lot','1') for x in qa):return no('ASSUMPTION_UNIT_BASIS_INCOMPATIBLE')
  if any(x['approval_state']!='approved_in_fictional_fixture' or dt(x['effective_to_exclusive'])<=dt('2026-09-01T00:00:00Z') for x in qa):return no('ASSUMPTION_APPROVAL_OR_EFFECTIVITY_UNAVAILABLE')
  if not t['qac_transform_methods'][0]['no_double_count']:return no('BUCKET_DOUBLE_COUNTING')
  actual={k:dur([x for x in t['quote_actual_intervals'] if x['bridge_b_bucket']==k]) for k in ('setup','downtime','productive_runtime')};rr=t['quote_actual_runs'];rate=by['rate'][0]['value'];good=sum(x['good_unique_pieces'] for x in rr)
  if rate<=0:return no('QUOTED_RATE_UNAVAILABLE')
  quoted={'setup':sum(x['setup_events'] for x in rr)*by['setup'][0]['value'],'downtime':sum(x['lot_count'] for x in rr)*by['downtime'][0]['value'],'productive_runtime':good/rate};delta={k:actual[k]-quoted[k] for k in actual};dtot=dur(t['quote_total_conversion_intervals'])-sum(quoted.values());speed=dur([x for x in t['quote_productive_loss_intervals'] if x['bridge_a_bucket']=='speed_cycle']);quality=dur([x for x in t['quote_productive_loss_intervals'] if x['bridge_a_bucket']=='quality_yield']);rb=sum(delta.values())-dtot;ra=speed+quality-delta['productive_runtime']
  if abs(ra)>1e-9 or abs(rb)>1e-9:return no('DECOMPOSITION_NOT_YET_AVAILABLE',bridgeAResidual=ra,bridgeBResidual=rb,totalOnlyIfSeparateApprovedSameRevisionTotalExists=True)
  if mid=='MET-029':return no('CONFIDENCE_AND_RATE_BASIS_POLICY_UNRESOLVED',arithmeticCandidateUsd=dtot*by['standard_shop_rate'][0]['value'])
  return ok(dtot,bridgeAResidual=ra,bridgeBResidual=rb)
 raise ValueError(mid)
def case(id,mid,actions,state,value=None,request=None,extra=None):
 q=request or {};actual=evaluate(mid,apply(actions),q);assert actual['fixtureState']==state,(id,actual,state)
 if value is not None:assert abs(actual['value']-value)<1e-8,(id,actual,value)
 if extra:
  for k,v in extra.items():assert actual[k]==v,(id,k,actual[k],v)
 cases.append({'caseId':id,'metricId':mid,'baseFixture':raw['namespace'],'mutations':actions,'requestParameters':q,'expected':actual,'diagnosticCodeAuthority':'fixture-only names unless explicitlysource code INSufficientRuns/QuotedRateUnavailable/DemonstratedRateUnavailable/ScopeUnresolved/DecompositionNotYetAvailable; no new approvedproductionenum','sourceContract':'EKAS-MIK-001@1.0.2','execution':'independent fixture oracle only, no owner/backend/UI execution'})
case('capacity-no-entitlement','MET-012',[remove('oee_entitlements','CAP-ENTITLEMENT')],'ENTITLEMENT_UNAVAILABLE')
case('released-no-entitlement','MET-014',[remove('oee_entitlements','CAP-ENTITLEMENT')],'ENTITLEMENT_UNAVAILABLE')
case('gross-does-not-need-entitlement','MET-011',[remove('oee_entitlements','CAP-ENTITLEMENT')],'AVAILABLE_SYNTHETIC_ARITHMETIC',40)
case('expired-entitlement','MET-012',[patch('oee_entitlements','CAP-ENTITLEMENT',valid_to_exclusive='2026-08-31T00:00:00Z')],'ENTITLEMENT_UNAVAILABLE')
case('wrong-tool-entitlement','MET-012',[patch('oee_entitlements','CAP-ENTITLEMENT',tool_id='ToolPrevious')],'ENTITLEMENT_UNAVAILABLE')
case('units-no-PRI-hours-remain','MET-013',[remove('planned_runtime_standards','CAP-PRI')],'PLANNED_RUNTIME_PER_ITEM_UNAVAILABLE',extra={'availableHours':15.000000000000002})
case('zero-PRI','MET-013',[patch('planned_runtime_standards','CAP-PRI',value=0)],'PLANNED_RUNTIME_PER_ITEM_UNAVAILABLE')
case('zero-entitlement-denominator','MET-014',[patch('oee_entitlements','CAP-ENTITLEMENT',value=0)],'INVALID_ENTITLEMENT_DENOMINATOR')
case('entitlement-exceeded-APCO','MET-012',[patch('oee_entitlements','CAP-ENTITLEMENT',value=.5)],'AVAILABLE_SYNTHETIC_ARITHMETIC',0)
case('entitlement-exceeded-released','MET-014',[patch('oee_entitlements','CAP-ENTITLEMENT',value=.5)],'AVAILABLE_SYNTHETIC_ARITHMETIC',0)
case('zero-planned-time','MET-011',[removeWhere('equipment_intervals','primary_state','planned_busy')],'NO_PLANNED_BUSY_TIME')
case('recovery-method-missing','MET-015',[],'DEFINITION_REQUIRED')
case('finance-model-missing','MET-016',[],'VALUATION_BASIS_REQUIRED')
case('changeover-no-standard','MET-018',[remove('planned_setup_standards','PUST-1')],'EFFECTIVE_PUST_UNAVAILABLE')
case('setup-no-segments','MET-019',[removeWhere('changeover_segments','changeover_id','CHANGE-1')],'SEGMENT_CLASSIFICATION_UNAVAILABLE')
case('delay-no-causal-evidence','MET-020',[patch('changeover_segments','CHANGE-1-DELAY',causal_evidence_id=None)],'CAUSAL_ASSET_EVIDENCE_UNAVAILABLE')
case('overlapping-primary-states','MET-019',[patch('changeover_segments','CHANGE-1-DELAY',start='2026-09-15T08:10:00Z')],'CONTRADICTORY_PRIMARY_STATES')
inside=[patch('changeovers','CHANGE-1',end='2026-09-15T08:35:00Z'),remove('changeover_segments','CHANGE-1-DELAY'),remove('changeover_segments','CHANGE-1-SETUP-B'),patch('changeover_segments','CHANGE-1-SETUP-A',end='2026-09-15T08:35:00Z')]
case('inside-standard-overrun','MET-018',inside,'AVAILABLE_SYNTHETIC_ARITHMETIC',0)
case('inside-standard-signed-setup','MET-019',inside,'AVAILABLE_SYNTHETIC_ARITHMETIC',-5)
case('NEE-component-binding','MET-021',[],'COMPONENT_DEFINITION_BINDING_REQUIRED')
case('restoration-missing-end','MET-022',[remove('semantic_anchors','FAIL-1-t7')],'RESTORATION_ANCHOR_UNAVAILABLE')
case('restoration-contradictory','MET-022',[patch('semantic_anchors','FAIL-1-t7',at='2026-09-17T07:00:00Z')],'CONTRADICTORY_ANCHORS_QUARANTINE')
case('response-missing-arrival','MET-024',[remove('semantic_anchors','FAIL-1-t4')],'RESPONSE_ANCHOR_UNAVAILABLE')
case('admin-only-proxy','MET-023',[removeWhere('semantic_anchors','failure_event_id','FAIL-1')],'AVAILABLE_SYNTHETIC_ARITHMETIC',240)
case('open-administrative','MET-023',[patch('work_orders','WO-1',completed_at=None)],'OPEN_ADMINISTRATIVE_WORK_ORDER')
case('no-person-time','MET-026',[removeWhere('person_work_intervals','failure_event_id','FAIL-1')],'PERSON_TIME_UNAVAILABLE')
case('dedup-concurrent-effort','MET-026',[],'AVAILABLE_SYNTHETIC_ARITHMETIC',1.5)
case('conflicting-punch-id','MET-026',[patch('person_work_intervals','A1-INGEST-DUP',end='2026-09-17T09:20:00Z')],'CONFLICTING_PERSON_TIME_SOURCE_IDENTITY')
case('unresolved-person-event','MET-026',[patch('person_work_intervals','B1',allocation='two possible failureevents')],'EVENT_ALLOCATION_UNRESOLVED')
case('commitment-all-links-missing','MET-027',[removeWhere('commitment_production_links','unit','piece')],'ORDER_TO_PRODUCTION_LINKAGE_UNAVAILABLE')
case('commitment-one-unknown','MET-027',[],'AVAILABLE_SYNTHETIC_ARITHMETIC',100,extra={'unknownCommitments':1,'exposedCommitments':2})
case('commitment-held-FG-not-available','MET-027',[patch('finished_goods_allocations','CL-1-FG',stock_state='quality_held')],'AVAILABLE_SYNTHETIC_ARITHMETIC',130)
case('commitment-approved-alternate','MET-027',[],'AVAILABLE_SYNTHETIC_ARITHMETIC',100,extra={'exposedCommitments':2})
case('commitment-overallocated','MET-027',[patch('finished_goods_allocations','CL-1-FG',quantity=200)],'OVERALLOCATION_POLICY_UNRESOLVED')
case('commitment-completion-missing-not-shipment-substitute','MET-027',[remove('accepted_completions','CL-1-COMPLETE')],'AVAILABLE_SYNTHETIC_ARITHMETIC',50,extra={'unknownCommitments':2,'exposedCommitments':1})
case('commitment-completion-distinct-not-formula-operand','MET-027',[patch('accepted_completions','CL-1-COMPLETE',quantity=70)],'AVAILABLE_SYNTHETIC_ARITHMETIC',100,extra={'unknownCommitments':1,'exposedCommitments':2})
case('commitment-completion-incompatible-unit','MET-027',[patch('accepted_completions','CL-1-COMPLETE',unit='kg')],'AVAILABLE_SYNTHETIC_ARITHMETIC',50,extra={'unknownCommitments':2,'exposedCommitments':1})
case('commitment-watermark-missing','MET-027',[patch('plan_snapshots','PLAN-SNAPSHOT',source_watermark=None)],'CURRENT_PLAN_SOURCE_UNAVAILABLE')
case('rate299pieces','MET-028',[remove('rate_piece_observations','RATE-BELOW-PIECE0300')],'INSUFFICIENT_RUNS')
case('rate-zero-quote','MET-028',[patch('quoted_rates','RATE-BELOW-QUOTE-RATE',value=0)],'QUOTED_RATE_UNAVAILABLE')
case('rate-absent-quote','MET-028',[remove('quoted_rates','RATE-BELOW-QUOTE-RATE')],'QUOTED_RATE_UNAVAILABLE')
case('rate-unit-incompatible','MET-028',[patch('quoted_rates','RATE-BELOW-QUOTE-RATE',unit='kg/h')],'QUOTED_RATE_UNAVAILABLE')
case('rate-labour-substitution','MET-028',[patch('rate_machine_intervals','RATE-BELOW-MACHINE',clock='human_effort')],'DEMONSTRATED_RATE_UNAVAILABLE')
case('rate-short-window','MET-028',[patch('qualified_rate_runs','RATE-BELOW',end='2026-09-20T08:30:00Z')],'INSUFFICIENT_RUNS')
case('rate-too-long-window','MET-028',[patch('qualified_rate_runs','RATE-BELOW',end='2026-09-20T17:00:00Z')],'INSUFFICIENT_RUNS')
case('rate-trial-excluded','MET-028',[patch('rate_piece_observations','RATE-BELOW-PIECE0300',trial=True)],'INSUFFICIENT_RUNS')
case('qac-not-modeled','QAC-001',[patch('quote_assumptions','QAC-downtime',presence_state='NOT_MODELED',value=None)],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('qac-source-unavailable','QAC-001',[patch('quote_assumptions','QAC-setup',presence_state='UNKNOWN_SOURCE_UNAVAILABLE',value=None)],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('qac-explicit-zero-distinct','QAC-001',[],'AVAILABLE_SYNTHETIC_ARITHMETIC',24)
case('qac-duplicate-effective-rate','QAC-001',[{'operation':'copy','table':'quote_assumptions','id':'QAC-rate','newId':'QAC-rate-duplicate'}],'ASSUMPTION_SCOPE_AMBIGUOUS_OR_MISSING')
case('qac-unapproved-rate','QAC-001',[patch('quote_assumptions','QAC-rate',approval_state='draft')],'ASSUMPTION_APPROVAL_OR_EFFECTIVITY_UNAVAILABLE')
case('qac-unit-mismatch','QAC-001',[patch('quote_assumptions','QAC-setup',unit='person_h/setup')],'ASSUMPTION_UNIT_BASIS_INCOMPATIBLE')
case('qac-doublecount-transform','QAC-001',[patch('qac_transform_methods','QAC-METHOD',no_double_count=False)],'BUCKET_DOUBLE_COUNTING')
case('qac-bridgeB-unclassified-hour','QAC-001',[patch('quote_total_conversion_intervals','QAC-RUN1-TOTAL',end='2026-09-01T17:10:00Z')],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('qac-bridgeA-unclassified-tenminutes','QAC-001',[patch('quote_productive_loss_intervals','QAC-RUN1-quality_yield',end='2026-09-01T16:00:00Z')],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('dollar-confidence-unresolved','MET-029',[],'CONFIDENCE_AND_RATE_BASIS_POLICY_UNRESOLVED',extra={'arithmeticCandidateUsd':2400.0})
case('dollar-explicitzero-candidate','MET-029',[patch('quote_assumptions','QAC-standard_shop_rate',presence_state='EXPLICIT_ZERO',value=0)],'CONFIDENCE_AND_RATE_BASIS_POLICY_UNRESOLVED',extra={'arithmeticCandidateUsd':0.0})
case('dollar-not-modeled','MET-029',[patch('quote_assumptions','QAC-standard_shop_rate',presence_state='NOT_MODELED',value=None)],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('dollar-unknown-rate','MET-029',[patch('quote_assumptions','QAC-standard_shop_rate',presence_state='UNKNOWN_SOURCE_UNAVAILABLE',value=None)],'DECOMPOSITION_NOT_YET_AVAILABLE')
case('dollar-unreconciled-hours','MET-029',[patch('quote_total_conversion_intervals','QAC-RUN1-TOTAL',end='2026-09-01T17:10:00Z')],'DECOMPOSITION_NOT_YET_AVAILABLE')
(R/'negative-boundary-fixtures.json').write_text(json.dumps({'schemaVersion':'canonical-gap-negative-fixtures@1.0.0','cases':cases,'note':'Mutations apply to an isolated deep copy of newrawfixture only. Never mutate savedinvestigations or old178fixtures. These tests validate fixture/refusal expectations, not owner integration.'},indent=2)+'\n')
print('PASS:',len(cases),'executable fixture refusal/boundary cases; all17contracts plusQAC represented.')
