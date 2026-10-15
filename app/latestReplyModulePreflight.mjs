import{mkdirSync,writeFileSync}from'node:fs';
import{dirname,resolve}from'node:path';
import{beforeAll,expect}from'vitest';
// These are functional DOM assertions, not a cold TypeScript/module compiler benchmark.
// Prepare after file mocks are registered, before its unchanged five-second callbacks.
// A setup failure holds the suite; no timed-out callback may start concurrent DOM roots.
beforeAll(async()=>{const testPath=expect.getState().testPath;if(!testPath?.endsWith('/v43LatestReply.test.tsx'))return;const start=performance.now();await import('./src/retained/store');await import('./src/retained/screens');const proof={diagnostic:'latest-reply-module-preflight',elapsedMs:performance.now()-start,originalCaseTimeoutMs:5000,modulePreparationHookLimitMs:40000,assertionsChanged:false,coldStartupPerformanceAccepted:false};const directory=resolve(dirname(testPath),'../..','.cache');mkdirSync(directory,{recursive:true});writeFileSync(resolve(directory,'latest-reply-preflight.json'),JSON.stringify(proof));console.log(JSON.stringify(proof))},40000);
