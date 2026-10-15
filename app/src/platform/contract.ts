/** Proposed EKAS client contract v1; compatibility with Tom/GLiDE is unverified. */
export const API_VERSION='ekas-proposed-v1' as const;
export type Session={id:string;role:'engineer'|'viewer';allowedAssetIds:string[];presentationOnly:true};
export type Scope={assetIds:string[];partId?:string;revision?:string;operationId?:string;jobId?:string;shiftId?:string;scenarioId?:string};
export type Query={simulationCase?:string;fixtureVersion:string;metricIds:string[];definitionVersions:Record<string,number>;scope:Scope;from:string;to:string;asOf:string;groupBy:string[];filters:{field:string;operator:'eq'|'in';values:(string|number|boolean)[]}[];page:{offset:number;limit:number}};
export type Availability='observed'|'no_data'|'zero_denominator'|'masked'|'unsupported'|'invalid_definition'|'missing_input'|'future_record'|'partial_coverage';
export type ResultRow={key:string;dimensions:Record<string,string>;values:Record<string,{value:number|boolean|null;unit:string;availability:Availability;reason:string|null;numerator:number|null;denominator:number|null;evidenceIds:string[];reasonCode?:string;operandContexts?:{operand:string;aggregation:string;tables:string[];recordIds:string[];windowPolicy:unknown;coverage:string;authority:string}[];semanticVersions?:{aggregation:string;policy:string;metric:number;fixture:string;metricContract:string;rawSnapshotHash:string;baseSnapshotHash:string;policyHash:string}}>};
export type CanonicalResult={id:string;version:number;apiVersion:typeof API_VERSION;query:Query;definitionVersions:Record<string,number>;fixtureVersion:string;rows:ResultRow[];total:number;returned:number;offset:number;limit:number;truncated:boolean;createdAt:string;synthetic:true;financiallyValidated:false};
export type ResourceKind='conversation'|'answer'|'board'|'tile'|'collection'|'comment'|'monitor'|'schedule'|'user'|'group'|'memory'|'formula'|'set'|'parameter'|'domain'|'webhook'|'action'|'authorization'|'verification'|'preference'|'notification'|'sync';
export type Resource={id:string;kind:ResourceKind;version:number;content:Record<string,unknown>;createdAt:string;updatedAt:string;synthetic:true;notDispatched:true;notGranted:true;ownerSessionId:string;assetIds:string[]};
export type ErrorCode='INVALID_REQUEST'|'UNKNOWN_ENDPOINT'|'NOT_FOUND'|'FORBIDDEN'|'CONFLICT'|'IDEMPOTENCY_CONFLICT'|'UNSUPPORTED'|'TIMEOUT'|'STORAGE_UNAVAILABLE'|'COMPUTATION_FAILED'|'INVALID_RESULT';
export type ServiceError={code:ErrorCode;message:string;details?:Record<string,unknown>;retryable:boolean};
export type Request={apiVersion:typeof API_VERSION;requestId:string;session:Session;method:'GET'|'POST'|'PATCH'|'DELETE';path:string;body?:unknown;idempotencyKey?:string};
export type Response<T=unknown>={requestId:string;apiVersion:typeof API_VERSION;status:number;data?:T;error?:ServiceError;synthetic:true};
export interface Transport{send<T=unknown>(request:Request):Promise<Response<T>>}
export type CallTrace={request:Request;response:Response;durationMs:number};
