import {it,expect} from 'vitest';
import {qaRestoreRoute} from './qaRestoreRoute';
it('owned restore clears conflicting deep links while preserving the owned route',()=>{
 const current=new URL('http://localhost:18191/ekas-qa-v45/?task=feeder&pane=decision&scope=Line+03&suite=northworks&metric=production&workspace=old&investigation=old&view=Compare&demonstration=old&practice=1&fixture=training-ui-acceptance-v1&context=old');
 expect(qaRestoreRoute(current)).toBe('/ekas-qa-v45/?suite=northworks&restored=working-context');
});
it('never navigates a protected or unowned route through owned restore',()=>{
 for(const path of ['/','/ekas/','/ekas-review/','/ekas-qa-v42/'])expect(()=>qaRestoreRoute(new URL('http://localhost:18191'+path))).toThrow('owned');
});
