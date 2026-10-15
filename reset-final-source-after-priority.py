from pathlib import Path
import json,shutil,datetime,collections
r=Path(__file__).resolve().parent;e=r/'evidence';out=e/'final-source'
assert json.loads((e/'RC-PRIORITY-WORKING-COMPLETION.json').read_text())['exitCode']==0
assert json.loads((out/'SUPERVISOR-COMPLETION.json').read_text())['exitCode']!=0
archive=e/'history-source-1eb52946-timeouts';assert not archive.exists();shutil.copytree(out,archive)
for name in ['FINAL-PIPELINE-COMPLETION.json','FINAL-PIPELINE-STATE.json','final-serial-pipeline.log']:
 if(e/name).exists():shutil.copy2(e/name,archive/name);(e/name).unlink()
for p in list(out.glob('*results.json'))+list(out.glob('*.txt'))+list(out.glob('*SUMMARY.json'))+list(out.glob('*BEFORE.json'))+list(out.glob('*AFTER.json'))+list(out.glob('*COMPLETION.json')):
 p.unlink()
# Each unchanged original assertion runs in a fresh actual process; no deadline changes.
p=out/'shard-1.mjs';config=json.loads(p.read_text()[len('export default '):-2]);original=config['test']['include'];isolated=['src/investigation/comparisonProcedure.test.ts','src/retained/v7ReviewRegressions.test.tsx'];rest=[f for f in original if f not in isolated];parts=[rest[i:i+24]for i in range(0,len(rest),24)]+[[f]for f in isolated];names=[]
for i,files in enumerate(parts):
 name='1-part'+str(i+1);names.append(name);c=json.loads(json.dumps(config));c['test']['include']=files;c['cacheDir']=config['cacheDir']+'-part'+str(i+1);(out/('shard-'+name+'.mjs')).write_text('export default '+json.dumps(c)+';\n')
assert collections.Counter(original)==collections.Counter(f for part in parts for f in part)
p=out/'GROUPS.json';groups=json.loads(p.read_text());groups['groups']=[n for g in groups['groups']for n in(names if g=='1'else[g])];groups['batchQualification']='Original group1 preserved byte-exact assertion set, split into actual fresh processes after two5s default timeouts; no timeouts changed; isolated original cases8/8passed. Cause not asserted.';p.write_text(json.dumps(groups,indent=2)+'\n')
print(json.dumps({'preservedFailedRun':str(archive),'splitFiles':len(original),'splitGroups':names,'appEdited':False}))
