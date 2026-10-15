from pathlib import Path
import subprocess,json,hashlib
r=Path(__file__).resolve().parent;rows=[]
assert json.loads((r/'evidence/FINAL-COMPILED-SUPERVISOR-COMPLETION.json').read_text())['exitCode']==0
for name,count in [('operator-contract',3),('private-credential',3),('legacy-budget',7)]:
 log=r/('evidence/final-'+name+'-explicit.txt');cmd=['node',str(r/('integration/operator/'+name+'.test.mjs'))]
 if name=='legacy-budget':cmd.append((r/'compiled-server/demoServer.js').as_uri())
 with log.open('w')as f:p=subprocess.run(cmd,cwd=r,stdout=f,stderr=subprocess.STDOUT)
 assert p.returncode==0
 lines=[json.loads(x)for x in log.read_text().splitlines()if x.startswith('{')];summary=lines[-1]
 assert summary['cases']==summary['passed']==count and summary['failed']==0 and summary['explicitCallbacksAwaited']
 assert sum(x.get('status')=='passed'for x in lines)==count
 rows.append({'file':str(log.relative_to(r)),'sha256':hashlib.sha256(log.read_bytes()).hexdigest(),'passed':count,'explicitCallbacksAwaited':True})
proof={'passed':13,'failed':0,'reports':rows,'fakeCredentialsOnly':True,'actualUserJournalRead':False,'liveCalls':False,'securityAccepted':False}
(r/'evidence/FINAL-OPERATOR-NODE-PROOF.json').write_text(json.dumps(proof,indent=2)+'\n');print({'passed':13,'liveCalls':False})
