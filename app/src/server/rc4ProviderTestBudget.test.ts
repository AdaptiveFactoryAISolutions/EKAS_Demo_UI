import {it, expect} from 'vitest';
import {createLocalDemoBudget} from './localDemoBudget';
import {createLocalAiRuntime} from './localAiRuntime';
import {createSessionCredentialStore} from './sessionCredentialStore';
import {PROVIDER_TEST_AUTHORIZATION, PROVIDER_TEST_CAP_MICRO_USD, PROVIDER_TEST_EXPIRES_AT, PROVIDER_TEST_PRICE_SOURCE, PROVIDER_TEST_REVIEWED_AT, CACHE_WRITE_MICRO_USD_PER_MILLION, OUTPUT_MICRO_USD_PER_MILLION} from './providerTestBudget';

const LIVE = () => new Date('2026-10-17T12:00:00Z');
const EXPIRED = () => new Date(PROVIDER_TEST_EXPIRES_AT);
const reservation = (output: number) => Math.ceil((64096 * CACHE_WRITE_MICRO_USD_PER_MILLION + output * OUTPUT_MICRO_USD_PER_MILLION) / 1_000_000);
const legacyOriginal = (phase: 'accounted' | 'unknown' = 'unknown') => JSON.stringify({schema: 2, authorization: 'Patrick-20261010-USD20-total', model: 'gpt-6.1-sol', authorizedMicroUsd: 20000000, usableMicroUsd: 18000000, priceReviewUntil: '2026-10-11T00:00:00Z', halted: false, entries: {old: {id: 'old', inputBound: 1050000, maxOutputTokens: 1200, reservationMicroUsd: 5800000, createdAt: '2026-10-10T12:00:00Z', phase, usage: phase === 'accounted' ? {input_tokens: 10, output_tokens: 20} : null}}});
const certificate = (legacyAudit: string | null = null) => JSON.stringify({schema: 2, authorization: PROVIDER_TEST_AUTHORIZATION, model: 'gpt-6.1-sol', authorizedMicroUsd: PROVIDER_TEST_CAP_MICRO_USD, usableMicroUsd: PROVIDER_TEST_CAP_MICRO_USD, priceReviewUntil: PROVIDER_TEST_EXPIRES_AT, reviewedAt: PROVIDER_TEST_REVIEWED_AT, priceSource: PROVIDER_TEST_PRICE_SOURCE, halted: false, entries: {}, legacyAudit});

function open(raw = certificate(), now = LIVE) {
  let saved: string | null = null;
  let n = 0;
  const store = {read: () => saved, write: (value: string) => { saved = value; }};
  const budget = createLocalDemoBudget({originalRaw: raw, store, now, nextId: () => 'rc4-' + (++n)});
  return {budget, saved: () => saved, store, now};
}

const reserve = (budget: ReturnType<typeof open>['budget'], maxOutputTokens = 1200) => budget.reserve({model: 'gpt-6.1-sol', maxOutputTokens, inputBytes: 100});

it('keeps the reviewed $20 history readable and outside the $40 cap', () => {
  const prior = open(legacyOriginal());
  expect(prior.budget.status()).toMatchObject({ceilingMicroUsd: 20000000, usableMicroUsd: 18000000, remainingMicroUsd: 12200000, unknownMicroUsd: 5800000, halted: true});
  const current = open(certificate(legacyOriginal()));
  expect(current.budget.status()).toMatchObject({ceilingMicroUsd: 40_000_000, usableMicroUsd: 40_000_000, remainingMicroUsd: 40_000_000, unknownMicroUsd: 0, halted: false, legacyAudit: {authorizationId: 'Patrick-20261010-USD20-total', ceilingMicroUsd: 20000000, unresolvedMicroUsd: 5800000, reservedMicroUsd: 5800000, countedTowardCap: false}});
  expect(() => open(certificate(certificate()))).toThrow('ORIGINAL_BUDGET_HISTORY_REQUIRED');
});

it('refuses a reservation that would cross the cap and refuses every reservation once the cap is reached', () => {
  const {budget} = open();
  const hold = reservation(1200);
  expect(hold).toBe(172240);
  let placed = 0;
  while (budget.status().remainingMicroUsd >= hold) {
    const id = reserve(budget);
    budget.beforeRequest(id);
    budget.recordUsage(id, {input_tokens: 20, output_tokens: 8, service_tier: 'default'});
    placed += 1;
  }
  expect(placed).toBe(232);
  const remaining = budget.status().remainingMicroUsd;
  expect(remaining).toBe(40320);
  expect(remaining).toBeGreaterThan(0);
  expect(remaining).toBeLessThan(reservation(1));
  expect(() => reserve(budget, 1200)).toThrow('DEMO_BUDGET_EXHAUSTED');
  expect(() => reserve(budget, 1)).toThrow('DEMO_BUDGET_EXHAUSTED');
  expect(budget.status().remainingMicroUsd).toBe(remaining);
  expect(budget.status().halted).toBe(false);
});

it('refuses expired pricing before a reservation and before a provider call', async () => {
  const {budget} = open(certificate(), EXPIRED);
  expect(() => reserve(budget, 64)).toThrow('DEMO_PRICE_REVIEW_REQUIRED');
  expect(budget.status().remainingMicroUsd).toBe(40_000_000);
  let calls = 0;
  const runtime = createLocalAiRuntime({budget, credentialStore: createSessionCredentialStore(), now: () => EXPIRED().getTime(), fetchImpl: async () => { calls += 1; throw Error('LIVE_FORBIDDEN'); }});
  runtime.saveSettings({mode: 'openai', model: 'gpt-6.1-sol', maxOutputTokens: 1200, inputByteBound: 60000}, 0);
  runtime.setCredential('DUMMY_NO_REAL_KEY', 1, 0);
  await expect(runtime.test({operationId: 'expired-pricing', expectedRevision: 2, acceptPotentialCost: true})).rejects.toThrow('AI_PRICING_EXPIRED');
  expect(calls).toBe(0);
  expect(runtime.status().pricing).toMatchObject({reviewedAt: '2026-10-17', expiresAt: PROVIDER_TEST_EXPIRES_AT, inputMicroUsdPerMillion: 2_000_000, cachedInputMicroUsdPerMillion: 100_000, cacheWriteMicroUsdPerMillion: 2_500_000, outputMicroUsdPerMillion: 10_000_000});
});

it('does not charge a duplicate when the same usage is recorded again or the same test is retried', async () => {
  const {budget} = open();
  const id = reserve(budget, 64);
  budget.beforeRequest(id);
  const usage = {input_tokens: 20, output_tokens: 8, total_tokens: 28, service_tier: 'default', output_tokens_details: {reasoning_tokens: 0}};
  budget.recordUsage(id, usage);
  budget.recordUsage(id, usage);
  const after = budget.status();
  expect(after.remainingMicroUsd).toBe(40_000_000 - reservation(64));
  expect(after.inFlightMicroUsd).toBe(0);
  expect(after.unknownMicroUsd).toBe(0);
  let calls = 0;
  let reserves = 0;
  const counting = {reserve() { reserves += 1; return 'same-hold'; }, beforeRequest() {}, recordUsage() {}, markUnknown() {}, status: () => budget.status()};
  const runtime = createLocalAiRuntime({budget: counting, credentialStore: createSessionCredentialStore(), now: () => LIVE().getTime(), fetchImpl: async () => { calls += 1; return Response.json({status: 'completed', usage, output: [{type: 'message', role: 'assistant', content: [{type: 'output_text', text: 'DUMMY connection received'}]}]}); }});
  runtime.saveSettings({mode: 'openai', model: 'gpt-6.1-sol', maxOutputTokens: 1200, inputByteBound: 60000}, 0);
  runtime.setCredential('DUMMY_NO_REAL_KEY', 1, 0);
  const request = {operationId: 'retry-same-operation', expectedRevision: 2, acceptPotentialCost: true as const};
  const first = runtime.test(request);
  const second = runtime.test(request);
  await expect(first).resolves.toMatchObject({operationId: 'retry-same-operation', status: 'passed'});
  await expect(second).resolves.toMatchObject({operationId: 'retry-same-operation'});
  expect(calls).toBe(1);
  expect(reserves).toBe(1);
});

it('reconciles an interrupted call by keeping the reservation unknown and inside the cap', () => {
  const first = open();
  const id = reserve(first.budget, 64);
  first.budget.beforeRequest(id);
  expect(first.budget.status().inFlightMicroUsd).toBe(reservation(64));
  const reloaded = createLocalDemoBudget({originalRaw: certificate(), store: first.store, now: LIVE, nextId: () => 'rc4-after-interrupt'});
  expect(reloaded.status()).toMatchObject({halted: true, unknownMicroUsd: reservation(64), inFlightMicroUsd: 0, remainingMicroUsd: 40_000_000 - reservation(64)});
  expect(() => reloaded.reserve({model: 'gpt-6.1-sol', maxOutputTokens: 64, inputBytes: 100})).toThrow('DEMO_USAGE_REVIEW_REQUIRED');
  expect(reloaded.status().remainingMicroUsd).toBe(40_000_000 - reservation(64));
});

it('refuses unloaded Fast, Batch, regional, and over-272K usage instead of pricing it as standard', () => {
  for (const usage of [
    {input_tokens: 20, output_tokens: 8, service_tier: 'fast'},
    {input_tokens: 20, output_tokens: 8, batch: true},
    {input_tokens: 20, output_tokens: 8, regional: 'eu'},
    {input_tokens: 272001, output_tokens: 8, service_tier: 'default'},
    {input_tokens: 20, output_tokens: 8, input_tokens_details: {cached_tokens: 1, audio_tokens: 1}},
  ]) {
    const {budget} = open();
    const id = reserve(budget, 64);
    budget.beforeRequest(id);
    expect(() => budget.recordUsage(id, usage)).toThrow('DEMO_PRICE_REVIEW_REQUIRED');
    expect(budget.status()).toMatchObject({halted: true, unknownMicroUsd: reservation(64), remainingMicroUsd: 40_000_000 - reservation(64)});
  }
});
