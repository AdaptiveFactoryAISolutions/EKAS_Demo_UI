from pathlib import Path
import json,hashlib,shutil
r=Path(__file__).resolve().parent;e=r/'evidence';old=e/'current-working-preview-topic-context';d=e/'current-working-preview-priority-label'
assert json.loads((e/'RC-PRIORITY-LABEL-WORKING-COMPLETION.json').read_text())['exitCode']==0
assert not d.exists();d.mkdir();(d/'private').mkdir(mode=0o700)
shutil.copytree(r/'app',d/'app',ignore=shutil.ignore_patterns('node_modules','dist','.cache'))
shutil.copytree(r/'app/dist',d/'static');shutil.copytree(r/'preview-priority-label-server',d/'server')
for name in ['state.json','state.json.roles.json','state.json.mock-budget.json']:
 if (old/'private'/name).exists():shutil.copy2(old/'private'/name,d/'private'/name)
s=(old/'launch.mjs').read_text().replace('18328','18335').replace('topic-context-preview','priority-label-preview');(d/'launch.mjs').write_text(s)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def identity(root,prefix):
 files={str(p.relative_to(root)):sha(p)for p in sorted(root.rglob('*'))if p.is_file()}
 return hashlib.sha256(''.join(prefix+n+'\0'+h+'\n'for n,h in files.items()).encode()).hexdigest(),files
source,files=identity(d/'app','app/');static,assets=identity(d/'static','static/');server,compiled=identity(d/'server','server/')
(d/'SOURCE-FILES.json').write_text(json.dumps(files));(d/'IDENTITY.json').write_text(json.dumps({'status':'WORKING_PRIORITY_CORRECTION_NOT_FINAL','sourceSha256':source,'staticSha256':static,'serverSha256':server,'staticFiles':len(assets),'typecheckExitCode':0,'targetedPassed':json.loads((e/'rc-priority-label-working-extended-results.json').read_text())['numPassedTests'],'wholeSourcePassed':False,'nativePriorityAccepted':False,'qualification':'Versioned priority policy2 preserves captured0/1; immutable reviewer snapshot, live transport refused.'},indent=2)+'\n')
print((d/'IDENTITY.json').read_text())
