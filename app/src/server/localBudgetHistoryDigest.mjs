import{createHash}from'node:crypto';
export const localBudgetHistoryDigest=raw=>createHash('sha256').update(raw).digest('hex');
