import {it,expect} from 'vitest';
import {safeWorkspaceRead,appendStep,stepLabel} from './investigation';
import {namespaceFor,ownsStorageKey} from './experience';
it('C saves revisitable scoped steps without duplicate rerenders and keeps changed scope',()=>{const s={id:'1',task:'feeder' as const,scope:'Line 03',page:'Explore',metric:'oee',view:'Compare',asOf:'t',label:stepLabel('Explore','Line 03')};expect(appendStep([s],s)).toHaveLength(1);expect(appendStep([s],{...s,scope:'Line 02'})).toHaveLength(2);expect(JSON.parse(JSON.stringify(appendStep([s],s)))[0].scope).toBe('Line 03')});
it('C reset ownership excludes both frozen alternatives and baseline',()=>{expect(ownsStorageKey(namespaceFor('C')+'workspace.v1','C')).toBe(true);for(const v of ['A','B'] as const)expect(ownsStorageKey(namespaceFor(v)+'workspace.v1','C')).toBe(false)});

it('corrupt saved workspace recovers without trusting a malformed value',()=>{expect(safeWorkspaceRead('{bad')).toEqual({});expect(safeWorkspaceRead('null')).toEqual({});expect(safeWorkspaceRead('[]')).toEqual({})});

it('branching keeps parentage and immutable sibling results',()=>{const first={id:'parent',task:'feeder' as const,scope:'Line 03',page:'Explore',metric:'oee',view:'Compare',asOf:'t',label:'result',result:'72 min'};const branch={...first,id:'child',parentId:first.id};const list=appendStep([first],branch);expect(list).toHaveLength(2);expect(list[1].parentId).toBe('parent');expect(list[0].result).toBe('72 min');expect(first).not.toHaveProperty('parentId')});

it('long automatic sustain sequences retain the original result and branch ancestry',()=>{const first={id:'original',task:'feeder' as const,scope:'Line 03',page:'Explore',metric:'oee',view:'Compare',asOf:'initial',label:'Original',result:'72 min'};let list:ReturnType<typeof appendStep>=[first];for(let i=0;i<30;i++)list=appendStep(list,{...first,id:'s'+i,parentId:'original',asOf:'later-'+i});expect(list).toHaveLength(31);expect(list[0]).toEqual(first);expect(list.at(-1)?.parentId).toBe('original')});
