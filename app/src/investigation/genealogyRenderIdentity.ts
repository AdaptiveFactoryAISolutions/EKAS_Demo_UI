import type{GenealogyProjection}from'./lotGenealogy';
/** SDK view identity follows rendered source/diagram/decision inputs. A case audit
 * version or newly owned review alone does not alter any Board connector row.
 * React/export still receive the whole current projection, including those records. */
export function genealogyRenderIdentity(identity:string,p:GenealogyProjection){return JSON.stringify([identity,p.schemaVersion,p.investigationId,p.caseId,p.cycleId,p.contextRef,p.asOf,p.effectiveStatus,p.currentScopeReviewAllowed,p.selectedRootLotId,p.selectedSnapshot,p.links,p.nodes,p.uniqueKnownUnitIds,p.gaps,p.reasons])}
