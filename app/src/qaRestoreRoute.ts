import {qaNorthworksRoot} from './platform/isolatedQa';
/** The explicitly imported document owns working context; stale deep links are removed. */
export function qaRestoreRoute(current:URL){
 if(!qaNorthworksRoot(current.pathname))throw new Error('Only an owned Northworks QA route may restore here.');
 return current.pathname+'?suite=northworks&restored=working-context';
}
