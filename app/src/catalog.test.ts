import {describe,it,expect} from 'vitest';
import {catalog,missingIds} from './catalog';
import original from '../inputs/metrics-missing-rows.json';
describe('Complete source occurrence ledger',()=>{
 it('retains exactly 322 unique requirement IDs and no gaps',()=>{
  expect(catalog).toHaveLength(322);expect(new Set(catalog.map(r=>r.id)).size).toBe(322);expect(missingIds).toEqual([]);
 });
 it('retains every restored source formula, name, grouping, unit and exact source line',()=>{
  for(const r of original){const row=catalog.find(x=>x.id===r.requirement_id)!;expect(row.name).toBe(r.source_name);expect(row.key).toBe(r.canonical_id);expect(row.formula).toBe(r.source_formula??'See source concept / governance requirement');expect(row.unit).toBe(r.source_unit??'Not specified in source');expect(row.sourceLines).toBe(r.source_lines.join('–'));}
 });
 it('catalog presence does not claim executable or certified production capability',()=>{
  expect(catalog.every(r=>r.readiness==='Definition only')).toBe(true);
 });
});
import inventoryText from '../inputs/metrics.inventory.md?raw';
import {groups,sourceSections,allKindGroupCount} from './catalog';
it('reconciles every occurrence with exact inventory text and all 28 source sections',()=>{
 const text=inventoryText;
 const rows=text.split('\n').filter(line=>/^\| KPI-\d{3} \|/.test(line));expect(rows).toHaveLength(322);
 for(const line of rows){const [id,name,kind,key,anchor,formula]=line.slice(1,-1).split(' | ').map(x=>x.trim());const r=catalog.find(x=>x.id===id)!;expect([r.name,r.kind,r.key,r.sourceLines,r.formula]).toEqual([name,kind,key,anchor,formula]);}
 expect(sourceSections).toHaveLength(28);expect(new Set(catalog.map(r=>r.section)).size).toBe(28);expect(groups).toHaveLength(162);expect(allKindGroupCount).toBe(257);
 const eligible=catalog.filter(r=>['metric','analytical_measure','model'].includes(r.kind));expect(new Set(groups.flatMap(g=>g.rows.map(r=>r.id)))).toEqual(new Set(eligible.map(r=>r.id)));
 for(const section of sourceSections){expect(text).toContain('## '+section.id+'. '+section.title);expect(catalog.some(r=>r.section===section.id)).toBe(true);}
});
