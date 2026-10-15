"""Additive disposition overlay. Authority documents and prior package hashes are preserved."""
import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent
ROOT=Path('/home/pat/EKAS_Platform_v2')
def read(n):return json.loads((P/n).read_text())
d=read('decisions-required.json')
updates={
'D01':('undefined_calculation_method','follow-on definition required','Approved input contract §5.3 retains TBC-P4-16-015; no formula/input/validation/overlap method is supplied.'),
'D02':('undefined_calculation_method_and_customer_valuation','follow-on definition and Finance/customer basis required','Approved input contract §5.3 retains TBC-P4-16-016. Standard-cost doctrine for MET-029 does not define MET-016.'),
'D03':('undefined_confidence_method','TBC-420 remains open','D-096/CR-051 settle the first standard-cost lens and visible confidence; exact band thresholds and per-figure versus presence-combination method remain undefined. Candidate arithmetic is not an approved computed confidence rule.'),
'D04':('missing_customer_configuration_not_open_TBC417','TBC-417 RESOLVED by later CR-051; customer severity absent','CR-051 §Disposition and TBC register resolve TBC-417 through MET-029 doctrine. Earlier D-092 open-status wording is historical. No customer severity configuration is supplied; numeric MET-028 gaps remain available with SEVERITY_UNAVAILABLE. This is not permission to infer profitability.'),
'D05':('distribution_method_and_customer_source_binding','percentile/estimator undefined; source hierarchy already controlled','MIK-001 requires an upper percentile but selects no percentile or estimator. Equipment-state over administrative precedence, contradictory-sequence quarantine and open-event reporting are already defined. Concrete same-class source priorities belong to adapter configuration.'),
'D06':('source_diagnostic_correction','clean calculations unblocked','Use the explicit max(0,elapsed-PUST) formula for MET-018 and signed AUST-PUST for MET-019. The under-standard diagnostic equality needs document clarification, not approval to calculate 0 and -5.'),
'D07':('undefined_component_binding','canonical component/version binding required','Approved input contract §6.4 repeats Effectiveness/Quality but does not supply definitions or setup-denominator binding. No approved canonical activation follows from the 66.5% illustration.'),
'D08':('context_specific_authority_and_potential_source_clarification','clean homogeneous synthetic examples unblocked','Retain MET-004 component aggregation in §5 and the explicit capacity-family rule in §5a within their respective contexts. Never replace generic MET-004 silently. A unified mixed-product OEE interpretation needs controlled clarification; existing homogeneous fixtures need no choice.'),
'D09':('implementation_separation','resolved without new approval for separate fixtures','D-092 already adopts 300 consecutive parts within 1–8h unless an effective customer-approved override exists. Keep the QAC 490-minute reconstruction separate from qualified MET-028 runs; no override requested or invented.'),
'D10':('customer_rate_basis_compatibility','lens already adopted; rate applicability must be explicit','D-096/CR-051 already adopt reconciled conversion hours times standard shop rate. Customer evidence must establish compatible basis including setup/downtime; do not reopen the lens or silently expand per_productive_hour applicability.'),
'D11':('customer_mapping_and_activation_validation','exact-scope synthetic example unblocked; customer activation validation retained','QAC already governs conjunctive scope, ambiguity refusal, single B/A buckets, no double-count and both bridges. The existing repository synthetic oracle uses 1e-9h; production tolerance, broader-scope precedence and specific transformations require declared approved mapping. TBC-418 requires cleared representative artifact validation.'),
'D12':('customer_source_exception_adjudication','clean dedup/concurrent-person arithmetic unblocked','Approved input contract §2/§7 settles equipment union versus deduplicated additive person-time. Conflicting person bookings or cross-event allocations require source adjudication only when encountered; no invented effort split.'),
'D13':('customer_source_binding_and_required_input_correction','clean synthetic case complete after accepted-completion addition','Approved input contract §8 requires actual accepted completion separately from accepted shipment. Added six independent completion facts; no formula substitution. Completion/shipment reconciliation remains explicitly TBC-P4-16-027-COMPLETION-SHIPMENT. Source freshness and over-allocation exception policies are customer/adapter configuration; missing inputs remain unknown/refused.'),
'D14':('physical_mapping_and_activation_control','logical input contract approved; physical mappings/activation open','WP-P4-16 logical inputs are APPROVED/DONE. TBC-411..414 physical DAT mappings remain open and MIK-004 pointers remain DRAFT. No need to reapprove clean synthetic definitions, but no production activation or certification is inferred.')}
for r in d['items']:
 category,status,disposition=updates[r['id']]
 r['originalGapStatement']=r['decision'];r['decision']=disposition;r['category']=category;r['status']=status;r['historicalStatementRetained']=True
 if r['id']=='D04':r['tbc417Status']='RESOLVED 2026-08-19 by CR-051 / D-096';r['customerSeverityConfiguration']='ABSENT'
d['revision']='canonical-gap-spec@1.0.1';d['note']='Disposition overlay after existing-decision search; no source authority or method approvals changed.'
(P/'decisions-required.json').write_text(json.dumps(d,indent=2)+'\n')
b=read('source-and-protection-binding.json')
extras=['PM/decisions/D-092-quoted-versus-demonstrated-rate-gap.md','PM/decisions/D-093-quote-assumption-input-contract.md','PM/decisions/D-096-dollar-valuation-layer.md','docs/registers/change-requests/CR-051.md','docs/registers/tbc-register.md','docs/governance/contracts/WP-P4-16-met-011-027-input-contract.md','tests/corpus/quote_assumption_reconciliation_oracle.py']
for rel in extras:
 path=ROOT/rel
 if not any(x['path']==str(path) for x in b['sourceDocuments']):b['sourceDocuments'].append({'path':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'role':'existing approved decision/input-contract or retained synthetic oracle; precedence/status explicitly distinguished'})
(P/'source-and-protection-binding.json').write_text(json.dumps(b,indent=2)+'\n')
s=read('gap-contracts.json');m=next(x for x in s['definitions'] if x['metricId']=='MET-027');m['approvedInputContractSupplement']={'path':str(ROOT/extras[5]),'sourceLines':[212,234],'requiredAdditionalField':'actual_accepted_completion_quantity','separateFrom':'accepted_shipped_quantity and approved_finished_goods_allocation','noSubstitution':True,'reconciliationStatus':'TBC-P4-16-027-COMPLETION-SHIPMENT retained'}
(P/'gap-contracts.json').write_text(json.dumps(s,indent=2)+'\n')
a=read('api-result-contract.json');a['perMetricExtensions']['MET027']+=['actual accepted completion quantity and independent acceptance lineage; never shipment substitution','separate accepted shipped quantity and approved available finished-goods allocation']
a['existingDecisionDispositions']={'TBC417':'resolved by CR-051 / D-096; customer severity configuration still absent','TBC420':'open exact confidence method/thresholds','WP-P4-16':'logical inputs approved; physical mappings and activation not inferred'}
(P/'api-result-contract.json').write_text(json.dumps(a,indent=2)+'\n')
print('Applied 14 categorized dispositions and seven additional source bindings.')
