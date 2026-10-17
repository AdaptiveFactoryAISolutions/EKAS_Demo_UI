//#region app/src/investigation/requestOutcome.ts
var ManufacturingResponseError = class extends Error {
	code;
	status;
	commitOutcome;
	authoritativeNonCommit;
	retryable;
	constructor(message, proof) {
		super(message);
		this.code = proof.code;
		this.status = proof.status;
		this.commitOutcome = proof.commitOutcome;
		this.authoritativeNonCommit = proof.authoritativeNonCommit;
		this.retryable = proof.retryable;
	}
};
//#endregion
export { ManufacturingResponseError };
