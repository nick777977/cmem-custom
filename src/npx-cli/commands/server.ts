import { runStartCommand, runStopCommand, runRestartCommand, runStatusCommand } from './runtime.js';

/** Standalone deployment is retired; never discover or contact Postgres/Redis. */
export async function runServerCommand(_argv: string[] = []): Promise<void> {
  console.error('LOCAL_WORKER_ONLY: standalone server deployment has been retired.');
  process.exitCode = 1;
}

export function runWorkerAliasCommand(argv: string[] = []): void {
  switch (argv[0]?.toLowerCase()) {
    case 'start': return runStartCommand();
    case 'stop': return runStopCommand();
    case 'restart': return runRestartCommand();
    case 'status': return runStatusCommand();
    default:
      console.error('Usage: npx claude-mem worker start|stop|restart|status');
      process.exitCode = 1;
  }
}
