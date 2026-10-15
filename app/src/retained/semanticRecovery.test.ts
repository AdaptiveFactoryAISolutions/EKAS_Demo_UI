// @vitest-environment jsdom
import {beforeEach,it,expect} from 'vitest';
import {create,persist} from './stateClient';
import {useEkas} from './store';
import {namespaceKey} from '../experience';
import {validatedBackup} from './backup';
const initial=()=>JSON.parse(JSON.stringify(useEkas.getState()));
const key=namespaceKey('retained.semantic-test');
const store=()=>create<any>()(persist(()=>initial(),{name:'semantic-test'}));
beforeEach(()=>localStorage.clear());
it('holds an unversioned semantic snapshot without relabelling, overwriting or permitting mutations',async()=>{
 const state=initial();state.boards[0].tiles[4].title='Engagement by site';state.boards[0].tiles[4].query.columns=['energyIntensity','site'];state.studioSql='select Region, sum(Good units_USD) from executive_leadership group by Region';
 const raw=JSON.stringify({schemaVersion:1,version:3,synthetic:true,notGranted:true,notDispatched:true,state});localStorage.setItem(key,raw);const s=store();await s.persist.rehydrate();
 expect(s.getState().studioSql).not.toContain('Good units_USD');expect(s.persist.getRecoveryIssue()).toContain('semantic');s.setState({studioSql:'changed'});expect(s.getState().studioSql).not.toBe('changed');expect(localStorage.getItem(key)).toBe(raw);
});
it('writes semantic identity and restores exact names and SQL only within the same model',async()=>{
 const s=store();await s.persist.rehydrate();s.setState({studioSql:'select site, sum(good_units) from manufacturing_shift_model group by site'});const saved=JSON.parse(localStorage.getItem(key)!);expect(saved.semanticModel).toBe('ekas-manufacturing-shift-v1');expect(saved.fixtureVersion).toBe('training-plant-v1');const restored=store();await restored.persist.rehydrate();expect(restored.persist.getRecoveryIssue()).toBe('');expect(restored.getState().studioSql).toBe(saved.state.studioSql);
});
it('refuses legacy workspace backups before storage writes, retaining original data for export',()=>{
 const ns={state:key,service:'service',layout:'layout.'};const doc={schemaVersion:1,version:1,synthetic:true,notGranted:true,notDispatched:true,state:initial()};const raw=JSON.stringify({schemaVersion:1,fixtureVersion:'training-plant-v1',synthetic:true,entries:{[key]:JSON.stringify(doc)}});expect(()=>validatedBackup(raw,ns,initial())).toThrow(/semantic/i);
});
it('holds even structurally valid snapshots from a different semantic model or fixture',async()=>{for(const identity of [{semanticModel:'executive-finance-v1',fixtureVersion:'training-plant-v1'},{semanticModel:'ekas-manufacturing-shift-v1',fixtureVersion:'other-plant'}]){const raw=JSON.stringify({...identity,schemaVersion:1,version:0,synthetic:true,state:initial()});localStorage.setItem(key,raw);const s=store();await s.persist.rehydrate();expect(s.persist.getRecoveryIssue()).toContain('semantic');expect(localStorage.getItem(key)).toBe(raw)}});
it('restores legitimate custom titles exactly when semantic identity matches',async()=>{const state=initial();state.boards[0].tiles[4].title='Reviewed labor exposure';localStorage.setItem(key,JSON.stringify({semanticModel:'ekas-manufacturing-shift-v1',fixtureVersion:'training-plant-v1',schemaVersion:1,version:2,synthetic:true,state}));const s=store();await s.persist.rehydrate();expect(s.persist.getRecoveryIssue()).toBe('');expect(s.getState().boards[0].tiles[4].title).toBe('Reviewed labor exposure');expect(s.getState().boards[0].tiles[4].query.columns).toEqual(['laborHours','site'])});
