export const unavailableComparisonNotice='Previous-shift records are unavailable. A decline cannot be calculated. Choose an explicit alternative.';
export function resolveComparisonNotice(notice:string){return notice===unavailableComparisonNotice?'':notice}
