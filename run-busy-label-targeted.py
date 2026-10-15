from pathlib import Path
import subprocess,json
r=Path(__file__).resolve().parent;out=r/'evidence/rc-busy-label-targeted.json'
with(r/'evidence/rc-busy-label-targeted.txt').open('w')as log:p=subprocess.run([str(r/'app/node_modules/.bin/vitest'),'run','src/investigation/newDuringComputation.test.tsx','--config','vite.config.ts','--reporter=json','--outputFile',str(out)],cwd=r/'app',stdout=log,stderr=subprocess.STDOUT)
(r/'evidence/rc-busy-label-targeted-completion.json').write_text(json.dumps({'exitCode':p.returncode,'terminalProcessObserved':True}))
raise SystemExit(p.returncode)
