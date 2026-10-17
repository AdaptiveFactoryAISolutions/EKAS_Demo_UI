import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = process.env.RC6_SERVER_OUT || resolve(root, '.cache/rc6-server');
export default {
  input: resolve(root, 'app/src/server/localDemoServer.ts'),
  platform: 'node',
  external: [/^node:/],
  resolve: {extensions: ['.mjs', '.js', '.ts', '.tsx', '.json']},
  output: {
    dir: out,
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: resolve(root, 'app/src'),
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
  },
};
