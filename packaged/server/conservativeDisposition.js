//#region app/src/server/conservativeDisposition.ts
const RECOVERY_AUTHORIZATION = "Sentinel_9ea7c41c518081918035722b6f491e8c";
const RECOVERY_APPROVED_AT = "2026-10-15T04:09:28.000Z";
function validConservativeDisposition(e) {
	const d = e?.reviewDisposition;
	return !!d && typeof d === "object" && !Array.isArray(d) && Object.keys(d).sort().join(",") === "approvedAt,authorizationRef,kind,priorJournalSha256,retainedMicroUsd,reviewedAt,version" && d.version === 1 && d.kind === "permanently-retained-unknown" && d.authorizationRef === "Sentinel_9ea7c41c518081918035722b6f491e8c" && d.approvedAt === "2026-10-15T04:09:28.000Z" && typeof d.reviewedAt === "string" && Number.isFinite(Date.parse(d.reviewedAt)) && Date.parse(d.reviewedAt) >= Date.parse(d.approvedAt) && /^[a-f0-9]{64}$/.test(d.priorJournalSha256) && e.phase === "unknown" && e.usage === null && e.reservationMicroUsd === 189464 && d.retainedMicroUsd === e.reservationMicroUsd;
}
function unresolvedReservation(e) {
	return e.phase === "in_flight" || e.phase === "unknown" && !validConservativeDisposition(e);
}
//#endregion
export { RECOVERY_APPROVED_AT, RECOVERY_AUTHORIZATION, unresolvedReservation, validConservativeDisposition };
