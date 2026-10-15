from pathlib import Path
import json,zipfile,hashlib,subprocess,shutil,os
r=Path(__file__).resolve().parent;i=json.loads((r/'FINAL-RC1-FROZEN-IDENTITY.json').read_text());z=r/i['zip'];root=r/'fresh-extracted-rc1';assert not root.exists()
assert hashlib.sha256(z.read_bytes()).hexdigest()==i['zipSha256']
with zipfile.ZipFile(z)as archive:
 names=archive.namelist();assert archive.testzip()is None and len(names)==len(set(names));assert all(not Path(n).is_absolute()and'..'not in Path(n).parts for n in names);archive.extractall(root)
m=json.loads((root/'MANIFEST.json').read_text());assert hashlib.sha256((root/'MANIFEST.json').read_bytes()).hexdigest()==i['manifestSha256']
for name,row in m['files'].items():
 f=root/name;assert f.is_file()and f.stat().st_size==row['bytes']and hashlib.sha256(f.read_bytes()).hexdigest()==row['sha256']
assert not list(root.rglob('node_modules'));assert not list(root.rglob('.env'));assert not list(root.rglob('Key.txt'))
proof={'zipSha256':i['zipSha256'],'matchedManifestMembers':len(m['files']),'safeUniqueEntries':len(names),'mismatches':0,'noNodeModules':True,'noCredentialFilePackaged':True,'privateLegacyRepositoryRequired':False,'runtimeTested':False,'editableSourceBuildTested':False}
(r/'evidence/FINAL-FRESH-EXTRACTION-IDENTITY.json').write_text(json.dumps(proof,indent=2)+'\n');print(proof)
# Editable-source rebuild uses the installed public dependency cache; this does not claim fresh npm ci.
(root/'app/node_modules').symlink_to(r/'app/node_modules',target_is_directory=True)
try:
 with(r/'evidence/final-fresh-source-build.txt').open('w')as log:p=subprocess.run([str(root/'app/node_modules/.bin/vite'),'build'],cwd=root/'app',stdout=log,stderr=subprocess.STDOUT)
 assert p.returncode==0
 original={str(f.relative_to(root/'static')):hashlib.sha256(f.read_bytes()).hexdigest()for f in(root/'static').rglob('*')if f.is_file()}
 rebuilt={str(f.relative_to(root/'app/dist')):hashlib.sha256(f.read_bytes()).hexdigest()for f in(root/'app/dist').rglob('*')if f.is_file()}
 assert original==rebuilt
 proof.update({'editableSourceBuildTested':True,'editableSourceBuildExitCode':0,'rebuiltStaticByteExact':True,'publicInstalledCacheUsed':True,'freshNpmCiClaimed':False})
finally:(root/'app/node_modules').unlink()
(r/'evidence/FINAL-FRESH-EXTRACTION-IDENTITY.json').write_text(json.dumps(proof,indent=2)+'\n');print({'editableSourceBuildTested':proof['editableSourceBuildTested'],'rebuiltStaticByteExact':proof['rebuiltStaticByteExact']})
