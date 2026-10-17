import { API_VERSION } from "../platform/contract.js";
import { extractionContract } from "./governedRecords.js";
import { claimKinds } from "./turnSemantics.js";
//#region app/src/investigation/manufacturingContract.ts
const manufacturingContract = {
	apiVersion: API_VERSION,
	schemaVersion: 1,
	synthetic: true,
	candidateRevision: "EKAS-DEMO-FINAL-RC1-provisional",
	currentCandidateRevision: "EKAS-DEMO-FINAL-RC1-provisional",
	obligations: {
		schemaVersion: 1,
		synthetic: true,
		readPath: "/obligations/{investigationId}",
		commands: ["select-obligation-snapshot", "record-obligation-review"],
		selectionFields: [
			"snapshotId",
			"sourceVersion",
			"programId",
			"reason",
			"confirmation"
		],
		reviewFields: [
			"obligationId",
			"stage",
			"ownerName",
			"ownerRole",
			"dueAt",
			"reason",
			"acknowledgeExternalPending",
			"confirmation"
		],
		submittedPPAPPending: true,
		unknownSupplierUnapproved: true,
		programSpecificApplicability: true,
		originalCaptureImmutable: true,
		actualCommunicationDispatched: false,
		actualSubmissionPerformed: false,
		actualFulfillmentPerformed: false,
		externalApprovalCertified: false,
		productionConformance: false,
		deadlinePolicy: "Exact real UTC calendar secondsZ; offsets/milliseconds/normalized impossible days rejected before commit. Planned documentary due targets are not deliveries."
	},
	lotGenealogy: {
		schemaVersion: 1,
		synthetic: true,
		readPath: "/genealogy/{investigationId}",
		commands: ["select-genealogy-snapshot", "record-genealogy-scope-review"],
		quantityCertified: false,
		allProductContained: false,
		actualHoldPerformed: false,
		actualReleasePerformed: false,
		productionConformance: false,
		originalCaptureImmutable: true,
		policy: "Explicit case/cycle/root/source selection; bounded directed declared associations and deduplicated eligible existing unit references. Missing population and unmapped quantity remain unknown. Owned review is local accountability, not physical containment or release."
	},
	measurementTrust: {
		schemaVersion: 1,
		synthetic: true,
		readPath: "/measurement-trust/{investigationId}",
		command: "select-measurement-trust-record",
		commandFields: [
			"recordId",
			"sourceVersion",
			"reason",
			"confirmation"
		],
		realCalibrationCertified: false,
		physicalInterventionPerformed: false,
		productionConformance: false,
		originalCaptureImmutable: true,
		policy: "Known-time case/cycle/source calibration and MSA assurance; declared UTC validity is exclusive. Qualification admits demonstrative operands only; no real uncertainty/traceability/fitness, physical intervention, cause or savings certification."
	},
	integrationHealth: {
		schemaVersion: 1,
		synthetic: true,
		readPath: "/integration-health/{investigationId}",
		command: "select-integration-health-snapshot",
		physicalInterventionPerformed: false,
		productionConformance: false,
		policy: "Optional case-evidence transfer admission; original inputs and business guards remain authoritative; no snapshot means unassessed."
	},
	evidenceQueries: {
		domain: "manufacturing-evidence-query-v1",
		queryListPath: "/evidence-queries?investigationId={id}",
		queryReferenceLimit: 100,
		queryReferenceCompleteness: "Explicit returned/total/complete; no neighbor fallback or inferred source deletion.",
		paths: [
			"/evidence-queries",
			"/evidence-queries/{id}",
			"/evidence-queries/{id}/page"
		],
		captureDomain: "manufacturing-evidence-capture-v1",
		capturePaths: ["/evidence-captures", "/evidence-captures/{id}"],
		synthetic: true,
		productionConformance: false,
		certified: false
	},
	diagnostics: {
		schemaVersion: 1,
		synthetic: true,
		readPaths: [
			"diagnostics",
			"chronology",
			"neighborhood"
		],
		commands: ["record-diagnostic-check", "select-diagnostic-snapshot"],
		productionConformance: false,
		verifiedPhysicalCause: false,
		optionalBoardPin: "typed historical evidence capture and Board binding; non-certified, independent/native acceptance pending",
		knowledgeTime: "eventTime and knownAt/source cutoff both required",
		cause: "unconfirmed; human assessment cannot overwrite authoritative source test status"
	},
	provider: {
		configuration: "server-side OpenAI key",
		liveActivation: "not configured",
		localOllama: false,
		authority: "Governed service records; model interpretation is unverified",
		activationGates: [
			"reviewed pricing and budget",
			"secure server credential setup",
			"separate fresh merged-artifact security review remains held after denial; original R5 architecture is user-approved"
		],
		tomContractGate: "Later backend conformance only; does not gate temporary authorized OpenAI demo activation"
	},
	decisionSupport: {
		capabilitiesPath: "/api/v1/manufacturing/decision-support/capabilities",
		dispositions: 56,
		wholeAcceptance: false,
		path: "/api/v1/manufacturing/decision-support",
		readPath: "/api/v1/manufacturing/decision-support/{conversationId}",
		packetPath: "/api/v1/manufacturing/decision-support/{conversationId}/packet",
		implementedCommands: [
			"record-observation",
			"record-pm-review",
			"record-handover",
			"record-lesson",
			"save-scenario",
			"record-portfolio-review"
		],
		sharedTruth: "Current owner/action/plan/verification derived from the canonical case; support records never duplicate or mutate lifecycle truth",
		qualification: "Unverified notes and held PM proposals; no production release, causal proof, intervention or savings"
	},
	metricDemonstrations: {
		path: "/api/v1/manufacturing/metric-demonstrations",
		dataset: "training-positive-v2",
		definitionCount: 178,
		contexts: 15,
		chatSelection: "Demonstrate synthetic metric {exact ID}; separate metric-demonstration dataset, sources/table/help followups, explicit return to original case",
		selection: "Explicit synthetic raw dataset and exact definition; ordinary missing-data training remains unchanged",
		productionConformance: false
	},
	conversationalCorrections: {
		steps: [
			"exact current final-good count",
			"known UTC",
			"review reason",
			"explicit confirmation"
		],
		commit: "atomic correction and captured conversation",
		unrestrictedExtraction: false,
		countInterpretation: "version2 complete unsigned integer token; no fraction/sign/group/exponent/alternatives; exact prior count; legacy captures retained, old pending reviews restated"
	},
	assetScope: {
		interpretationVersion: 4,
		legacyInterpretationVersions: [2, 3],
		syntacticNormalization: "Only lossless compact/spaced/hyphen/case formatting against exact authored IDs; no zero padding or guessed aliases",
		unknownOrAmbiguous: "clarify with no case/numeric substitution",
		aliases: "authored canonical IDs and documented first/second-machine grammar; resolved spelling disclosed",
		historical: "original interpretation/version and captured answers retained"
	},
	comparisonCursor: {
		separateFromOriginal: true,
		snapshots: "explicit only",
		admission: "existing actor roles, work/safety proof and separate acceptance"
	},
	submissionReceipt: {
		concurrentSameRequest: "shared promise",
		lostResponseRetry: "original expectedVersion and idempotency key",
		navigation: "transition-scoped presentation; old receipts retain their conversation; success only with matching indexed turn"
	},
	sustainMonitoring: {
		newWorkflowPolicyVersion: 2,
		historicalPolicyVersion: 1,
		primaryTarget: "plan.target; distinct from recurrence alarm",
		window: "latest required recorded observations",
		eligibility: [
			"exact case scope",
			"known-time cutoff",
			"complete coverage",
			"healthy observer",
			"source version",
			"metric definition",
			"latest observation within 24 hours"
		],
		statuses: [
			"insufficient",
			"interrupted",
			"regressed",
			"sustained",
			"recurrence"
		],
		history: "original workflow/capture policy retained without rewriting"
	},
	comparisons: {
		catalog: "/api/v1/manufacturing/comparison-catalog",
		path: "/api/v1/manufacturing/comparisons",
		commands: "exact discriminated comparison commands with expectedVersion and idempotency",
		membership: "separate November–December experiment, exact source IDs and versions; current Quality791 is only a context trigger",
		measurement: "immutable measured result; acceptance separate and bound to result/fingerprint; later measurements are unaccepted",
		productionParity: false
	},
	combinedAudit: {
		path: "/api/v1/manufacturing/audit-refresh/{UTC cutoff}",
		writePath: "/api/v1/manufacturing/audit-refresh",
		sourceVersions: "all three scopes, exact denominators and immutable captures"
	},
	adapterStatus: "Mock implementation; actual Tom contract/authenticated mapping pending",
	authentication: {
		mode: "fictional presentationOnly session",
		productionRequired: [
			"authenticated principal",
			"tenant",
			"entity/capability scope",
			"server-side policy revision"
		]
	},
	concurrency: {
		expectedVersion: "required on mutable records",
		idempotencyKey: "required; exact retry reuses result, conflicting reuse fails",
		commit: "atomic conversation + investigation + captured response"
	},
	ordinarySemantics: {
		claimKinds,
		confidence: "null unless governed source supplied",
		confirmedCause: "Unavailable; no language promotion",
		actionVerified: "Read-only projection of existing performed proof, accepted measurement and guardrails; no new authorization path",
		cutoff: "Exact UTC Plant Review cutoff and eligible discovery; unsupported forms/workflow-time queries clarify without current substitution",
		discoveryUnits: {
			metric: "goal.unit",
			absoluteDifference: "goal.gapUnit; percentage points for percent metrics",
			relative: "percent of target; independent denominator"
		},
		commands: {
			"record-test-evidence": ["testId"],
			"dispose-tested-hypothesis": ["optional hypothesisId; required when ambiguous"],
			"set-action-due-date": ["dueAt"]
		},
		reviewedClaimRelationships: {
			kind: "record-reviewed-claim-link",
			relations: [
				"supports",
				"contradicts",
				"negates",
				"supersedes"
			],
			anchors: "distinct exact same-case claim IDs/versions known at cutoff",
			confirmation: "CONFIRM_REVIEWED_SYNTHETIC_CLAIM_LINK",
			history: "immutable original claims; no automatic truth selection or causal promotion",
			conversation: "Show reviewed claims / reviewed claim relationships [as of exact UTC]; captured immutable sources"
		},
		capture: "dialogueVersion1 + immutable typed semantic envelope; original captures retain legacy replay"
	},
	sourcePropagation: {
		eligibility: "exact case scope and explicit known-time cutoff",
		baselineViews: "withhold current baseline summaries, charts/tables/contributors/ranks and lifecycle reuse after an eligible revision",
		refresh: "Refresh revised source as of exact UTC returns one captured deterministic summary/Highcharts-Dashboards connected table projection",
		rawAndCohorts: "V61 chat captures retain stale qualification. V62 dependency refresh regenerates current contributors; exact human-reviewed quality current unit dispositions reconcile final-good counts. Original dated verification cohorts remain version0 and unaffected; absent corrected-row membership refuses new verification.",
		history: "immutable captured source version; no back-rewrite",
		userAccess: "Ask clarification + Review source correction / Review controlled quote forms; explicit typed confirmation"
	},
	dependencies: {
		path: "/api/v1/manufacturing/dependencies",
		readPath: "/api/v1/manufacturing/dependencies/{caseId}/{UTC cutoff}",
		commands: [
			"record-raw-reconciliation",
			"refresh-dependencies",
			"reverify-dependencies"
		],
		links: "exact source ID/version and target ID/version/scope; job identity alone never establishes cohort membership",
		raw: "specific current non-first-pass unit terminal disposition changes, latest corrected source version, expected raw review version, human reviewer/reason/UTC/explicit confirmation",
		verification: "no qualifying current-row comparison membership; reverification refuses precise missing prerequisite and never reuses acceptance",
		history: "append immutable dependency capture; originals and old chat answers unchanged"
	},
	governedRecords: {
		editorPath: "/api/v1/manufacturing/governed-records/editor/{caseId}",
		path: "/api/v1/manufacturing/governed-records",
		projectionPath: "/api/v1/manufacturing/governed-records/projections/{caseId}/{UTC cutoff}",
		sourceCorrection: {
			kind: "correct-current-source",
			required: [
				"caseId",
				"sourceRowId",
				"scope",
				"expectedVersion",
				"previousGood",
				"good",
				"knownAt",
				"reason",
				"confirmation"
			],
			confirmation: "CONFIRM_SYNTHETIC_SOURCE_CORRECTION",
			scope: "current exact case row; final-good count only; original fixtures and prior results immutable",
			downstream: "new scoped metrics, gap and derived claim; historical source versions unchanged"
		},
		reviewedClaim: {
			kind: "record-reviewed-claim",
			confirmation: "CONFIRM_REVIEWED_SYNTHETIC_CLAIM",
			extractionContract
		},
		cause: {
			kind: "confirm-cause",
			humanRole: "fictional manager",
			requires: [
				"known same-case supported hypothesis test",
				"governed causal proof",
				"isolation/counterfactual and confounder assessment",
				"explicit human disposition"
			],
			status: "qualifying proof unavailable; confirmation fails closed"
		}
	},
	aggregateDiscriminants: ["manufacturing-investigation-v2", "monthly-investigation-v1"],
	planCommands: {
		"create-verification-plan": {
			required: ["target", "requiredShifts"],
			optional: ["endpoint"],
			additionalProperties: false
		},
		"revise-verification-plan": {
			required: [
				"target",
				"requiredShifts",
				"reason"
			],
			optional: ["endpoint"],
			additionalProperties: false
		},
		"adopt-verification-plan": {
			required: [],
			additionalProperties: false
		}
	},
	evidencePolicy: {
		synthetic: true,
		notDispatched: true,
		notGranted: true,
		futureEvidence: "knownAt + explicit simulation cutoff",
		planRevision: "new fixed version invalidates acceptance/safety/sustain and requires later matching work/cohorts"
	},
	errorEnvelope: {
		fields: [
			"requestId",
			"apiVersion",
			"status",
			"error.code",
			"error.message",
			"error.retryable"
		],
		codes: [
			"INVALID_REQUEST",
			"UNKNOWN_ENDPOINT",
			"NOT_FOUND",
			"FORBIDDEN",
			"CONFLICT",
			"IDEMPOTENCY_CONFLICT",
			"TIMEOUT",
			"STORAGE_UNAVAILABLE",
			"COMPUTATION_FAILED",
			"INVALID_RESULT"
		],
		timeout: "Adapter must report TIMEOUT/unknown commit outcome; exact idempotent reconciliation before retry. Local deterministic mock does not represent live network deadlines."
	},
	externalConformance: false
};
//#endregion
export { manufacturingContract };
