import {describe,it,expect} from 'vitest';
import cases from '../../inputs/metric-oracle/known-answer-scenarios.json';
import {evaluateMetric,evaluateExpression,metricDefinitions,intervalUnion} from './metricEngine';
describe('independent complete arithmetic specification',()=>{
 it('computes every known-answer binding with the bounded parser',()=>{const seen=new Set();for(const scenario of cases.cases)for(const [id,expected] of Object.entries(scenario.expected)){const result=evaluateMetric(id,scenario.inputs,{namespace:scenario.namespace,mode:'algebra_only'});expect(result.availability,scenario.id+':'+id).toBe('observed');if(typeof expected.value==='boolean')expect(result.value).toBe(expected.value);else expect(Number(result.value),scenario.id+':'+id).toBeCloseTo(expected.value,9);expect(result.unit).toBe(expected.unit);seen.add(id)}expect(seen.size).toBe(metricDefinitions.length);expect(seen.size).toBe(178)});
 it('gates masked, missing, zero, invalid, future, partial and statistical eligibility separately from algebra',()=>{
  const policy={namespace:'training-plant-v1',mode:'observed' as const};
  expect(evaluateMetric('ekas.oee',{ideal_good_min:0,planned_min:0},policy).availability).toBe('zero_denominator');expect(evaluateMetric('ekas.scrap_rate',{scrap_units:0,produced_units:100},policy).value).toBe(0);
  expect(evaluateMetric('ekas.relative_percentage_change',{current_value:10,previous_value:null},policy).availability).toBe('missing_input');expect(evaluateMetric('ekas.cost_variance',{actual_cost:{masked:true},standard_cost:900},policy).availability).toBe('masked');
  expect(evaluateMetric('ekas.cp',{usl:90,lsl:110,sigma_within:2},{...policy,mode:'algebra_only'}).availability).toBe('invalid_formula');expect(evaluateMetric('ekas.cpk',{usl:110,lsl:90,process_mean:100,sigma_within:2},{...policy,sampleN:5,msaStatus:'unknown'}).availability).toBe('unsupported');
  expect(evaluateMetric('ekas.oee',{ideal_good_min:1,planned_min:2},{...policy,future:true}).availability).toBe('future_record');expect(evaluateMetric('ekas.oee',{ideal_good_min:1,planned_min:2},{...policy,coverage:.5}).availability).toBe('partial_coverage');expect(evaluateMetric('ekas.oee',{}, {namespace:'northworks-v3',revision:'P3',mode:'observed'}).availability).toBe('unsupported');
 });
 it('does not execute arbitrary formulas and merges overlapping intervals',()=>{expect(()=>evaluateExpression('process.exit()',{})).toThrow();expect(()=>evaluateExpression('constructor(1)',{})).toThrow();expect(intervalUnion([[0,10],[5,15]],[0,20])).toBe(15)});
});
