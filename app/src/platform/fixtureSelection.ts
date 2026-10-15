import contexts from '../../inputs/metric-oracle/ui-acceptance-fixtures-v1/selectable-contexts.json';
import ownership from '../../inputs/metric-oracle/ui-acceptance-fixtures-v1/ownership-metadata.json';
import type {Query,RunCtx} from './workspaceQuery';
export type FixtureContextId='oee-zero-unavailable'|'pagination-84days'|'ownership-all-yours';
export type ProviderSelection={fixtureVersion:'training-ui-acceptance-v1';version:'1.0.0';contextId:FixtureContextId};
export function validProvider(value:unknown):value is ProviderSelection{const p=value as ProviderSelection;return !!p&&typeof p==='object'&&p.fixtureVersion==='training-ui-acceptance-v1'&&p.version==='1.0.0'&&Object.hasOwn(contexts.contexts,p.contextId)}
export function selectionFromSearch(search:string):ProviderSelection|undefined{const params=new URLSearchParams(search),contextId=params.get('context') as FixtureContextId;const p={fixtureVersion:params.get('fixture'),version:'1.0.0',contextId};return validProvider(p)?p:undefined}
export function fixtureSelectionIssue(search:string){const p=new URLSearchParams(search);return p.has('fixture')&&!selectionFromSearch(search)?'Unknown synthetic fixture/context. No original dataset or saved state has been substituted.':''}
export const selectedProvider=selectionFromSearch(typeof window==='undefined'?'':window.location.search);
export function contextEnvelope(p:ProviderSelection):{query:Query;runCtx:RunCtx;label:string}{if(!validProvider(p))throw new Error('Unknown synthetic provider/context/version');const c=contexts.contexts[p.contextId];return {query:{...structuredClone(c.query),provider:{...p}} as Query,runCtx:{...c.runCtx},label:c.label}}
export const acceptanceSets=ownership.sets;
export function providerFixture(p?:ProviderSelection){return p&&p.contextId!=='ownership-all-yours'?'training-ui-acceptance-v1':'training-plant-v1'}
export function fixtureNamespace(search:string){const selected=selectionFromSearch(search);return selected?'fixture.training-ui-acceptance-v1.1.0.0.'+selected.contextId+'.':fixtureSelectionIssue(search)?'fixture.invalid-selection.':''}
export function providerSites(p?:ProviderSelection){return providerFixture(p)==='training-ui-acceptance-v1'?['UIA-S1']:['TP-S1','TP-S2']}
