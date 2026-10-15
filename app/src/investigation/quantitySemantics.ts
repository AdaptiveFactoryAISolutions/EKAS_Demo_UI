/** Metric level, absolute difference and relative change are distinct quantities. */
export type DifferenceUnit='percentage points'|'min'|'day'|'good units'|string;
export type AbsoluteDifference={kind:'absolute_difference';value:number;unit:DifferenceUnit;metricUnit:string};
export const absoluteDifferenceUnit=(metricUnit:string):DifferenceUnit=>metricUnit==='%'?'percentage points':metricUnit;
export const absoluteDifference=(value:number,metricUnit:string):AbsoluteDifference=>({kind:'absolute_difference',value,unit:absoluteDifferenceUnit(metricUnit),metricUnit});
export type RelativeChange={kind:'relative_change';value:number|null;unit:'%';denominator:number};
export const relativeChange=(difference:number,reference:number):RelativeChange=>({kind:'relative_change',value:reference===0?null:100*difference/Math.abs(reference),unit:'%',denominator:reference});
