import {createLocalDemoBudget} from './localDemoBudget';
import {createProviderBudget, type BudgetPolicy} from './providerBudget';
import type {LocalBudget, LocalBudgetStatus} from './localAiRuntime';

export const PROVIDER_TEST_AUTHORIZATION = 'Patrick-20261017-USD40-provider-test';
export const LEGACY_AUTHORIZATION = 'Patrick-20261010-USD20-total';
export const PROVIDER_TEST_CAP_MICRO_USD = 40_000_000;
export const PROVIDER_TEST_REVIEWED_AT = '2026-10-17';
export const PROVIDER_TEST_EXPIRES_AT = '2026-11-16T00:00:00Z';
export const PROVIDER_TEST_PRICE_SOURCE = 'https://platform.openai.com/docs/models/gpt-6.1-sol';
export const STANDARD_INPUT_MICRO_USD_PER_MILLION = 2_000_000;
export const CACHED_INPUT_MICRO_USD_PER_MILLION = 100_000;
export const CACHE_WRITE_MICRO_USD_PER_MILLION = 2_500_000;
export const OUTPUT_MICRO_USD_PER_MILLION = 10_000_000;
const INPUT_BOUND = 64096;
const MAX_OUTPUT = 1200;
const PRICE_BREAK_TOKENS = 272_000;

const exact = (x: any, keys: string[]) => !!x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).sort().join(',') === [...keys].sort().join(',');

export function isProviderTestRaw(raw: string | null) {
  if (!raw) return false;
  try {
    return JSON.parse(raw)?.authorization === PROVIDER_TEST_AUTHORIZATION;
  } catch {
    return false;
  }
}

function assertLoadedUsage(usage: any) {
  if (!usage || typeof usage !== 'object' || Array.isArray(usage)) throw Error('DEMO_PRICE_REVIEW_REQUIRED');
  if (!Number.isSafeInteger(usage.input_tokens) || usage.input_tokens < 0 || usage.input_tokens > PRICE_BREAK_TOKENS) throw Error('DEMO_PRICE_REVIEW_REQUIRED');
  const tier = usage.service_tier ?? usage.serviceTier;
  if (tier !== undefined && tier !== 'default' && tier !== 'standard') throw Error('DEMO_PRICE_REVIEW_REQUIRED');
  for (const key of ['batch', 'flex', 'fast', 'ultrafast', 'regional', 'region', 'speed']) if (usage[key] !== undefined) throw Error('DEMO_PRICE_REVIEW_REQUIRED');
  const details = usage.input_tokens_details;
  if (details !== undefined) {
    if (!details || typeof details !== 'object' || Array.isArray(details)) throw Error('DEMO_PRICE_REVIEW_REQUIRED');
    for (const key of Object.keys(details)) if (key !== 'cached_tokens' && key !== 'cache_write_tokens') throw Error('DEMO_PRICE_REVIEW_REQUIRED');
  }
}

function legacyAudit(raw: string | null, now: () => Date) {
  if (raw === null) return null;
  if (typeof raw !== 'string') throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED');
  let parsed: any;
  try { parsed = JSON.parse(raw); } catch { throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED'); }
  if (parsed?.authorization === PROVIDER_TEST_AUTHORIZATION) throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED');
  if (parsed?.authorization !== LEGACY_AUTHORIZATION) throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED');
  const budget = createLocalDemoBudget({originalRaw: raw, store: {read: () => null, write() { throw Error('LEGACY_AUDIT_READONLY'); }}, now, nextId: () => { throw Error('LEGACY_AUDIT_READONLY'); }});
  const status = budget.status();
  if (!status.available) throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED');
  return {authorizationId: LEGACY_AUTHORIZATION, ceilingMicroUsd: status.ceilingMicroUsd, unresolvedMicroUsd: status.unknownMicroUsd, reservedMicroUsd: status.usableMicroUsd - status.remainingMicroUsd, countedTowardCap: false as const};
}

export function createProviderTestBudget({originalRaw, store, now, nextId}: {originalRaw: string; store: {read(): string | null; write(value: string): void}; now: () => Date; nextId: () => string}): LocalBudget {
  let certificate: any;
  try { certificate = JSON.parse(originalRaw); } catch { throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED'); }
  if (!exact(certificate, ['schema', 'authorization', 'model', 'authorizedMicroUsd', 'usableMicroUsd', 'priceReviewUntil', 'reviewedAt', 'priceSource', 'halted', 'entries', 'legacyAudit']) || certificate.schema !== 2 || certificate.authorization !== PROVIDER_TEST_AUTHORIZATION || certificate.model !== 'gpt-6.1-sol' || certificate.authorizedMicroUsd !== PROVIDER_TEST_CAP_MICRO_USD || certificate.usableMicroUsd !== PROVIDER_TEST_CAP_MICRO_USD || certificate.priceReviewUntil !== PROVIDER_TEST_EXPIRES_AT || certificate.reviewedAt !== PROVIDER_TEST_REVIEWED_AT || certificate.priceSource !== PROVIDER_TEST_PRICE_SOURCE || certificate.halted !== false || !exact(certificate.entries, [])) throw Error('ORIGINAL_BUDGET_HISTORY_REQUIRED');
  const legacy = legacyAudit(certificate.legacyAudit, now);
  const policy: BudgetPolicy = {version: 1, authorizationId: PROVIDER_TEST_AUTHORIZATION, model: 'gpt-6.1-sol', expiresAt: PROVIDER_TEST_EXPIRES_AT, totalMicroUsd: PROVIDER_TEST_CAP_MICRO_USD, inputContextTokenBound: INPUT_BOUND, maxOutputTokens: MAX_OUTPUT, inputMicroUsdPerMillion: CACHE_WRITE_MICRO_USD_PER_MILLION, outputMicroUsdPerMillion: OUTPUT_MICRO_USD_PER_MILLION};
  let wrapped: any = null;
  const prior = store.read();
  if (prior !== null) {
    try { wrapped = JSON.parse(prior); } catch { throw Error('DEMO_BUDGET_RECOVERY_REQUIRED'); }
    if (!exact(wrapped, ['schema', 'originalRaw', 'current']) || wrapped.schema !== 'local-demo-budget-v1' || wrapped.originalRaw !== originalRaw) throw Error('ORIGINAL_BUDGET_HISTORY_CHANGED');
  }
  const nested = {read: () => wrapped === null ? null : JSON.stringify(wrapped.current), write: (raw: string) => { const next = {schema: 'local-demo-budget-v1', originalRaw, current: JSON.parse(raw)}; store.write(JSON.stringify(next)); wrapped = next; }};
  const budget = createProviderBudget({policy, store: nested, now, nextId});
  const base = {available: true, synthetic: false, ceilingMicroUsd: PROVIDER_TEST_CAP_MICRO_USD, usableMicroUsd: PROVIDER_TEST_CAP_MICRO_USD, confirmedSpendMicroUsd: null as number | null};
  return {status(): LocalBudgetStatus {
    const summary = budget.summary();
    const current = wrapped?.current?.entries || [];
    return {...base, remainingMicroUsd: summary.remainingMicroUsd, inFlightMicroUsd: current.filter((entry: any) => entry.phase === 'in_flight').reduce((sum: number, entry: any) => sum + entry.reservationMicroUsd, 0), unknownMicroUsd: current.filter((entry: any) => entry.phase === 'unknown').reduce((sum: number, entry: any) => sum + entry.reservationMicroUsd, 0), halted: summary.halted, ...(legacy ? {legacyAudit: legacy} : {})} as LocalBudgetStatus;
  }, reserve(input) { return budget.reserve(input); }, beforeRequest(id) { budget.beforeRequest(id); }, recordUsage(id, usage) {
    const existing = (wrapped?.current?.entries || []).find((entry: any) => entry.id === id);
    if (existing?.phase === 'accounted' && JSON.stringify(existing.usage) === JSON.stringify(usage)) return;
    try { assertLoadedUsage(usage); }
    catch (error) {
      if (existing && existing.phase !== 'accounted') budget.markUnknown(id);
      throw error;
    }
    budget.recordUsage(id, usage);
  }, markUnknown(id) { budget.markUnknown(id); }};
}
