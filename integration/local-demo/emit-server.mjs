import {spawnSync} from 'node:child_process';
import {cpSync, mkdirSync, rmSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const rolldown = resolve(root, 'app/node_modules/.bin/rolldown');
const config = resolve(root, 'integration/local-demo/server.rolldown.config.mjs');
const emitted = resolve(root, '.cache/rc6-server');
rmSync(emitted, {recursive: true, force: true});
mkdirSync(emitted, {recursive: true});
const built = spawnSync(rolldown, ['-c', config], {cwd: root, stdio: 'inherit', env: {...process.env, RC6_SERVER_OUT: emitted}});
if (built.status !== 0) process.exit(built.status || 1);
const packaged = resolve(root, 'packaged');
rmSync(packaged, {recursive: true, force: true});
cpSync(emitted, packaged, {recursive: true});
console.log('Compiled server modules are in packaged/. The launcher imports packaged/server/localDemoServer.js and serves static/.');
console.log('Copy app/dist to static/ after npm run build.');
