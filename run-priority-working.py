from pathlib import Path
import subprocess,json,datetime
r=Path(__file__).resolve().parent;e=r/'evidence';rows=[]
commands=[('type',[str(r/'app/node_modules/.bin/tsc'),'--noEmit']),('targeted',[str(r/'app/node_modules/.bin/vitest'),'run','--config',str(e/'final-source/shard-rc.mjs'),'--reporter=json','--outputFile',str(e/'rc-priority-working-extended-results.json')]),('browser-build',[str(r/'app/node_modules/.bin/vite'),'build']),('local-server-build',[str(r/'app/node_modules/.bin/vite'),'build','--ssr','src/server/localDemoServer.ts','--outDir','../preview-priority-server','--emptyOutDir'])]
try:
 for name,cmd in commands:
  with(e/('rc-priority-working-'+name+'.txt')).open('w')as log:p=subprocess.run(cmd,cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
  rows.append({'stage':name,'exitCode':p.returncode});(e/'RC-PRIORITY-WORKING-PROGRESS.json').write_text(json.dumps(rows));print(json.dumps(rows[-1]),flush=True)
  if p.returncode:raise SystemExit(p.returncode)
 (r/'preview-priority-server/package.json').write_text('{"type":"module"}\n')
except BaseException as error:
 (e/'RC-PRIORITY-WORKING-COMPLETION.json').write_text(json.dumps({'exitCode':getattr(error,'code',1),'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'terminalProcessObserved':True,'wholeSourceClaimed':False}));raise
else:(e/'RC-PRIORITY-WORKING-COMPLETION.json').write_text(json.dumps({'exitCode':0,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'terminalProcessObserved':True,'wholeSourceClaimed':False}))
