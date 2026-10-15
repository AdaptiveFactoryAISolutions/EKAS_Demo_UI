import type {StoragePort} from '../platform/mockRepository';
export function ownedFileStorage(path:string):StoragePort;
export function staticApplicationHandler(application:(request:Request)=>Promise<Response>,directory:string,bootstrap:unknown):(request:Request)=>Promise<Response>;

export function syntheticSessionId():string;
export function syntheticSessionCookieName(path:string):string;

export function writePrivateLocalOwnerCode(path:string):string;

export function acquireLocalDemoProfile(statePath:string):()=>void;

export function assertLocalDemoPaths(options:{directory:string;statePath:string;ownerCodePath:string}):void;

export function canonicalLocalBudgetJournalPath(originalPath:string):string;
export function assertOriginalBudgetIsolation(options:{directory:string;statePath:string;ownerCodePath:string},originalPath:string):string;
export function assertOriginalBudgetUnchanged(path:string,expected:string):void;
