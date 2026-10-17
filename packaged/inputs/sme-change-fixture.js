//#region app/inputs/sme-change-fixture.json
var change = {
	"affected_documents": [
		{
			"approved_for_production": false,
			"current_revision": "FIC-D",
			"document_id": "SW-030",
			"impact": "revise",
			"knowledge_ref": "SW-030@FIC-D",
			"proposed_revision": "FIC-E",
			"proposed_state": "draft",
			"reason": "Observation and escalation-reference wording proposal"
		},
		{
			"approved_for_production": false,
			"current_revision": "FIC-C",
			"document_id": "PFMEA-030",
			"impact": "review_required",
			"knowledge_ref": "PFMEA-030@FIC-C",
			"proposed_revision": "FIC-D",
			"proposed_state": "proposed",
			"row_ref": "FM-030-01"
		},
		{
			"approved_for_production": false,
			"current_revision": "FIC-B",
			"document_id": "CP-030",
			"impact": "review_required",
			"knowledge_ref": "CP-030@FIC-B",
			"proposed_revision": "FIC-C",
			"proposed_state": "proposed",
			"row_ref": "CPR-030-01"
		}
	],
	"allowed_demo_actions": [
		"view_current_document",
		"compare_proposal",
		"inspect_gate",
		"record_local_review",
		"reset_demo"
	],
	"audit_events": [{
		"action": "created_proposal",
		"actor": "Demo manufacturing engineer",
		"at": "2026-10-06T14:35:00Z",
		"id": "EC-003-EVT-1",
		"proposal_version": 1,
		"synthetic": true
	}],
	"case_id": "CASE-003",
	"case_relationship": "proposed_follow_on_document_change",
	"classification": "process_document_change_proposal",
	"created_at": "2026-10-06T14:35:00Z",
	"deviation": {
		"customer_disposition": null,
		"expiry": null,
		"id": null,
		"reversion_approval": null,
		"scope": null,
		"status": "none_authorized"
	},
	"effectivity": {
		"effective_from": null,
		"existing_stock_disposition": "unknown",
		"lot_boundary": null,
		"partial_implementation": false,
		"serial_boundary": null,
		"status": "not_defined",
		"work_order_boundary": null
	},
	"gates": [
		{
			"action": "Inspect validation plan",
			"blocking": true,
			"detail": "A proposed plan is not a completed and reviewed validation result.",
			"evidence_ref": null,
			"id": "validation",
			"owner": "Demo quality engineer",
			"requirement_basis": "Configured demo production-release policy",
			"status": "blocked",
			"title": "Validation evidence missing"
		},
		{
			"action": "Review applicability",
			"blocking": true,
			"customer_approval_applicability": "unknown",
			"detail": "Neither required nor not-required has been established. A recorded rationale and authorized decision are needed.",
			"evidence_ref": null,
			"id": "customer_ppap",
			"owner": "Demo customer quality owner",
			"ppap_applicability": "unknown",
			"requirement_basis": "Customer and change-specific determination pending",
			"status": "unknown",
			"title": "Customer / PPAP disposition unresolved"
		},
		{
			"action": "View affected roles",
			"blocking": true,
			"detail": "Training needs, affected roles and revision-specific readiness evidence remain unconfirmed; acknowledgment is not competence.",
			"evidence_ref": null,
			"id": "training",
			"owner": "Demo operations lead",
			"requirement_basis": "Configured demo production-release policy",
			"status": "pending",
			"title": "Training readiness evidence pending"
		}
	],
	"id": "EC-003",
	"impact_checks": [
		{
			"disposition_evidence": null,
			"domain": "drawings_and_specifications",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "bom_and_routing",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "process_flow",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "inspection_and_spc",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "msa_and_gages",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "tooling_and_maintenance",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "supplier_documents",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "work_orders",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "inventory_wip_finished_goods",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		},
		{
			"disposition_evidence": null,
			"domain": "customer_requirements_and_traceability",
			"owner": "Demo cross-functional reviewer",
			"status": "unknown"
		}
	],
	"implementation_state": "not_performed",
	"known_at": "2026-10-06T14:35:00Z",
	"linked_records": [
		"CASE-003",
		"NCR-003@FIC-A",
		"FM-030-01",
		"CPR-030-01"
	],
	"owner": "Demo manufacturing engineer",
	"performance_evidence_boundary": "CASE-003 later observations follow an already-authorized like-for-like maintenance restoration (DEMO-WO-003). This separate document proposal is unreleased and not performed; no measured improvement is attributed to EC-003.",
	"permissions": {
		"can_execute_external_action": false,
		"can_record_local_demo_review": true,
		"can_release": false,
		"can_view": true
	},
	"proposal_id": "CHANGE-003",
	"proposal_version": 1,
	"proposed_content_summary": "Replace ambiguous shorthand with structured observation fields and links to the applicable approved instructions. No machine settings, interventions, tolerances or operating directions supplied.",
	"reason": "CASE-003 identifies recurring feeder-jam observations. Proposal clarifies evidence recording and escalation references; technical remedy remains unvalidated.",
	"release_state": "blocked",
	"request_id": "ECR-003",
	"reviews": [
		{
			"decision": "proposal_prepared",
			"evidence_type": "fictional_workflow_record",
			"reviewed_proposal_version": 1,
			"role": "Manufacturing engineering"
		},
		{
			"decision": "pending",
			"reviewed_proposal_version": null,
			"role": "Quality"
		},
		{
			"decision": "pending",
			"reviewed_proposal_version": null,
			"role": "Operations"
		}
	],
	"scope": {
		"analytics_product_alias": "housing-a",
		"asset_id": "FEED-03",
		"line_id": "line-03",
		"plant_id": "northworks",
		"process_step_id": "OP-030",
		"product_id": "NW-A",
		"product_revision": "P2"
	},
	"stage": "cross_functional_review",
	"title": "Feeder observation guide revision",
	"verification_state": "pending"
};
//#endregion
export { change };
