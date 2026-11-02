/** SessionStart diagnostics only. Never compile, install, discover or mutate PATH. */
import { writeSync } from 'node:fs';
import { inspectLocalLauncherBundle } from './local-preflight.js';

const result = inspectLocalLauncherBundle(process.argv[1]);
// A synchronous hook systemMessage is visible to the owner. Keep the existing
// nonblocking hook envelope, but never describe a blocked bundle as ready.
const systemMessage = `cmem-light local preflight: ${result.code}: ${result.message}`;
process.stderr.write(`${systemMessage}\n`);
writeSync(1, `${JSON.stringify({ systemMessage })}\n`);
process.exit(0);
