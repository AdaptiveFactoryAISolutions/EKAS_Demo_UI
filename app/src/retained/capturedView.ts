import {resultMeta,resultIdentity} from './model';
import type {Row,RunCtx,Query} from './model';
export type Capture={metadata?:{total:number;returned:number;truncated:boolean};query:Query;context:RunCtx;rows:Row[];capturedAt:string;resultId:string|null};
/** Never recompute an immutable capture or use its historical controls as a grant.
 * Aggregated rows may omit site or carry derived sensitive values/evidence, so
 * stricter scope/masking conservatively withholds the entire snapshot. */
export function eligibleCapture(capture:Capture,current:RunCtx){
 const scopeAllowed=!current.rls||(capture.context.rls&&capture.context.site===current.site);
 const stricterMask=current.maskDowntime&&!capture.context.maskDowntime;
 const allowed=scopeAllowed&&!stricterMask;
 const rows=allowed?structuredClone(capture.rows):[];if(allowed&&capture.metadata)resultMeta.set(rows,{...capture.metadata});if(allowed&&capture.resultId)resultIdentity.set(rows,capture.resultId);return {allowed,rows,maskDowntime:capture.context.maskDowntime||current.maskDowntime,reason:!scopeAllowed?'Historical data withheld: current site access does not authorize this captured scope.':stricterMask?'Historical data withheld: current redaction is stricter than this capture.':'Immutable historical snapshot; no current requery.'};
}
/** Describe the captured query/policy, never a default preference or current context. */
export function capturedScopeSummary(capture:Capture){const siteFilters=capture.query.filters.filter(f=>f.col==='site'),site=capture.context.rls?'site '+capture.context.site+' (enforced at capture)':siteFilters.some(f=>f.op==='in')?'site filter '+siteFilters.filter(f=>f.op==='in').flatMap(f=>f.values).join(', '):'all sites (no enforced site at capture)';return 'Captured site scope: '+site+' · filters '+(capture.query.filters.length?capture.query.filters.map(f=>f.col+' '+f.op+' ['+f.values.join(', ')+']').join('; '):'none')+(capture.query.excludedScopes?.length?' · excluded tuples '+JSON.stringify(capture.query.excludedScopes):'')+' · cutoff '+(capture.query.asOf??'not captured');}
