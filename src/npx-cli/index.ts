import { parseArgs, styleText } from 'node:util';
import { readPluginVersion } from './utils/paths.js';
import type { InstallOptions } from './commands/install.js';
import { refuseAutomaticPluginSetup } from './install/setup-runtime.js';

const args = process.argv.slice(2);
const firstArg = args[0]?.toLowerCase() ?? '';
// If the first token is a flag (e.g. `npx claude-mem --provider claude`),
// treat the invocation as `install` with those flags. Help/version flags are
// handled directly so they don't get swallowed by the install path.
const HELP_OR_VERSION_FLAGS = new Set(['-h', '--help', '-v', '--version']);
const command =
  firstArg.startsWith('-') && !HELP_OR_VERSION_FLAGS.has(firstArg)
    ? 'install'
    : firstArg;

function printHelp(): void {
  console.log('cmem-light private bundle CLI v' + readPluginVersion());
  console.log('help | version: local metadata only.');
  console.log('install/update/upgrade/repair: LOCAL_RUNTIME_UNAPPROVED; no automatic bootstrap, signup, download, login or registration.');
  console.log('Private runtime/loading policy is pending. Do not activate legacy runtime/IDE commands or register this partial candidate.');
  console.log('Existing selected-provider Claude/Bedrock/API/login, Codex ChatGPT login and compatible adapters are retained; profile enforcement is separate step 6 work.');
}

function parseInstallOptions(argv: string[]): InstallOptions {
  const { values } = parseArgs({
    args: argv,
    options: {
      ide: { type: 'string' },
      provider: { type: 'string' },
      model: { type: 'string' },
      runtime: { type: 'string' },
      'server-url': { type: 'string' },
      'no-auto-start': { type: 'boolean' },
      'disable-auto-memory': { type: 'boolean' },
    },
    strict: false,
    allowPositionals: true,
  });
  const flag = (name: string): string | undefined =>
    typeof values[name] === 'string' ? (values[name] as string) : undefined;
  const provider = flag('provider');
  if (provider !== undefined && provider !== 'claude' && provider !== 'codex' && provider !== 'gemini' && provider !== 'openrouter' && provider !== 'host') {
    console.error(`Unknown --provider: ${provider}. Allowed: claude, codex, gemini, openrouter, host`);
    process.exit(1);
  }
  const runtime = flag('runtime');
  if (runtime !== undefined && runtime !== 'worker' && runtime !== 'server' && runtime !== 'server-beta') {
    console.error(`Unknown --runtime: ${runtime}. Allowed: worker, server`);
    process.exit(1);
  }
  const ide = flag('ide');
  const resolvedProvider = provider as InstallOptions['provider'];
  return {
    ide,
    provider: resolvedProvider,
    providerSource: resolvedProvider ? 'flag' : undefined,
    model: flag('model'),
    noAutoStart: values['no-auto-start'] === true,
    disableAutoMemory: values['disable-auto-memory'] === true,
    runtime: runtime as InstallOptions['runtime'],
    serverUrl: flag('server-url'),
  };
}

// Commands that change the install or the worker and would otherwise ignore -h/--help
const HELP_AWARE_COMMANDS = new Set([
  '', 'install', 'update', 'upgrade', 'uninstall', 'remove', 'repair', 'prune', 'start', 'stop', 'restart',
]);

async function main(): Promise<void> {
  // `uninstall --help` must show help, not run the uninstall.
  if (HELP_AWARE_COMMANDS.has(command) && args.slice(1).some((arg) => arg === '--help' || arg === '-h')) {
    printHelp();
    return;
  }

  // Refuse before dynamically importing installer, auth, IDE or user-state code.
  if (!['help', '--help', '-h', 'version', '--version', '-v'].includes(command)) refuseAutomaticPluginSetup();

  switch (command) {
    case '':
    case 'install': {
      const { runInstallCommand } = await import('./commands/install.js');
      await runInstallCommand(parseInstallOptions(args));
      break;
    }

    case 'repair': {
      const { runRepairCommand } = await import('./commands/install.js');
      await runRepairCommand();
      break;
    }

    case 'update':
    case 'upgrade': {
      const { runInstallCommand } = await import('./commands/install.js');
      await runInstallCommand();
      break;
    }

    case 'uninstall':
    case 'remove': {
      const { runUninstallCommand } = await import('./commands/uninstall.js');
      await runUninstallCommand();
      break;
    }

    case 'version':
    case '--version':
    case '-v': {
      console.log(readPluginVersion());
      break;
    }

    case 'help':
    case '--help':
    case '-h': {
      printHelp();
      break;
    }

    case 'start': {
      const { runStartCommand } = await import('./commands/runtime.js');
      runStartCommand();
      break;
    }
    case 'stop': {
      const { runStopCommand } = await import('./commands/runtime.js');
      runStopCommand();
      break;
    }
    case 'restart': {
      const { runRestartCommand } = await import('./commands/runtime.js');
      runRestartCommand();
      break;
    }
    case 'status': {
      const { runStatusCommand } = await import('./commands/runtime.js');
      runStatusCommand();
      break;
    }

    case 'doctor': {
      const { runDoctorCommand } = await import('./commands/doctor.js');
      await runDoctorCommand();
      break;
    }

    case 'prune': {
      const { runPruneCommand } = await import('./commands/prune.js');
      await runPruneCommand(args.slice(1));
      break;
    }

    case 'telemetry': {
      const { runTelemetryCommand } = await import('./commands/telemetry.js');
      await runTelemetryCommand(args.slice(1));
      break;
    }

    case 'teambrain': {
      const { runTeamBrainCommand } = await import('./commands/teambrain.js');
      process.exitCode = await runTeamBrainCommand(args.slice(1));
      break;
    }

    case 'server': {
      const { runServerCommand } = await import('./commands/server.js');
      await runServerCommand(args.slice(1));
      break;
    }

    case 'worker': {
      const { runWorkerAliasCommand } = await import('./commands/server.js');
      runWorkerAliasCommand(args.slice(1));
      break;
    }

    case 'search': {
      const { runSearchCommand } = await import('./commands/runtime.js');
      await runSearchCommand(args.slice(1));
      break;
    }

    case 'mcp': {
      const { runMcpCommand } = await import('./commands/runtime.js');
      runMcpCommand();
      break;
    }

    case 'hook': {
      const { runHookCommand } = await import('./commands/runtime.js');
      runHookCommand(args.slice(1));
      break;
    }

    case 'adopt': {
      const { runAdoptCommand } = await import('./commands/runtime.js');
      runAdoptCommand(args.slice(1));
      break;
    }

    case 'project': {
      const { runProjectCommand } = await import('./commands/runtime.js');
      runProjectCommand(args.slice(1));
      break;
    }

    case 'cleanup': {
      const { runCleanupCommand } = await import('./commands/runtime.js');
      runCleanupCommand(args.slice(1));
      break;
    }

    case 'backup': {
      const { runBackupCommand } = await import('./commands/backup.js');
      await runBackupCommand(args.slice(1));
      break;
    }

    case 'restore': {
      const { runRestoreCommand } = await import('./commands/restore.js');
      await runRestoreCommand(args.slice(1));
      break;
    }

    case 'transcript': {
      const subCommand = args[1]?.toLowerCase();
      if (subCommand === 'watch') {
        const { runTranscriptWatchCommand } = await import('./commands/runtime.js');
        runTranscriptWatchCommand();
      } else {
        console.error(styleText('red', `Unknown transcript subcommand: ${subCommand ?? '(none)'}`));
        console.error(`Usage: npx claude-mem transcript watch`);
        process.exit(1);
      }
      break;
    }

    case 'memory': {
      const subCommand = args[1]?.toLowerCase();
      if (subCommand === 'ingest') {
        const { runMemoryIngestCommand } = await import('./commands/runtime.js');
        runMemoryIngestCommand(args.slice(2));
      } else {
        console.error(styleText('red', `Unknown memory subcommand: ${subCommand ?? '(none)'}`));
        console.error(`Usage: npx claude-mem memory ingest [--source <dir> | --all] [--dry-run] [--require-cwd]`);
        process.exit(1);
      }
      break;
    }

    default: {
      console.error(styleText('red', `Unknown command: ${command}`));
      console.error(`Run ${styleText('bold', 'npx claude-mem --help')} for usage information.`);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(styleText('red', 'Fatal error:'), error.message || error);
  process.exit(1);
});
