/** Baseline RFC3339 microsecond instants. Local persisted DTOs retain their millisecond convention. */
export function pilotInstantMicros(value:unknown):bigint|null{
 if(typeof value!=='string')return null;const match=value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:\d{2})$/);if(!match)return null;
 const date=Date.parse(match[1]+'Z');if(!Number.isFinite(date)||new Date(date).toISOString().slice(0,19)!==match[1])return null;
 let offset=0;if(match[3]!=='Z'){const hours=Number(match[3].slice(1,3)),minutes=Number(match[3].slice(4,6));if(hours>23||minutes>59)return null;offset=(match[3][0]==='+'?1:-1)*(hours*60+minutes)*60000000;}
 return BigInt(date)*1000n+BigInt((match[2]||'').padEnd(6,'0'))-BigInt(offset);
}
export const pilotTimestamp=(value:unknown):value is string=>pilotInstantMicros(value)!==null;
export function comparePilotInstants(a:string,b:string){const left=pilotInstantMicros(a),right=pilotInstantMicros(b);if(left===null||right===null)throw new Error('Invalid pilot instant');return left<right?-1:left>right?1:0;}
