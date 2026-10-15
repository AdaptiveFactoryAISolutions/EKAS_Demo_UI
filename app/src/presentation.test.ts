import {describe,it,expect} from 'vitest';
import {readGuide} from './guideModel';
import {introductionVisible,dismissIntroduction,fitBoardRows,humanTime} from './presentation';
describe('guided presentation corrections',()=>{
 it('unseen visibility and dismissal agree, and dismissed reload stays absent',()=>{const state=readGuide(null);expect(introductionVisible(state,false)).toBe(true);const closed=dismissIntroduction(state);expect(closed.status).toBe('skipped');expect(introductionVisible(readGuide(JSON.stringify(closed)),false)).toBe(false);expect(introductionVisible(closed,true)).toBe(true)});
 it('dismissing reopened active help pauses without discarding progress',()=>{const state={...readGuide(null),status:'active' as const,step:2,done:['open','correct']};expect(dismissIntroduction(state)).toEqual({...state,status:'paused'})});
 it('stacks actual native Board cells after saved layout restore and preserves semantics',()=>{const options={dataPool:{connectors:[{id:'shift'}]},components:[{renderTo:'measure',chartOptions:{yAxis:{max:100,title:{text:'OEE %'}}}}],gui:{layouts:[{id:'saved',rows:[{id:'pair',cells:[{id:'measure',width:'50%'},{id:'output',width:'50%'}]},{cells:[{id:'grid'}]}]}]}};const mobile=fitBoardRows(options,true);expect(mobile.gui.layouts[0].rows.map((r:any)=>r.cells.map((c:any)=>c.id))).toEqual([['measure'],['output'],['grid']]);expect(mobile.components).toBe(options.components);expect(mobile.dataPool).toBe(options.dataPool);expect(options.gui.layouts[0].rows[0].cells).toHaveLength(2);expect(fitBoardRows(options,false)).toBe(options)});
 it('uses human UTC time while retaining missing-time qualification',()=>{expect(humanTime('2026-10-06T14:45:00Z')).toBe('6 Oct, 14:45 UTC');expect(humanTime('')).toBe('Time not captured')});
});
