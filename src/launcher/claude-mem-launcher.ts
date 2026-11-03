/** Private bundle diagnostic entry. No PATH/cache/settings discovery or child.
 * Host templates/registration still need a separate source continuation (D5).
 * Refusal preserves the hook fail-open envelope, never claims memory readiness.
 */
import { planPrivateLauncher } from './local-preflight.js';
import { LAUNCHER_PROTOCOL } from './launcher-protocol.js';

const result = planPrivateLauncher(
  process.argv.slice(2), process.argv[1], process.env, LAUNCHER_PROTOCOL,
);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.exit;
