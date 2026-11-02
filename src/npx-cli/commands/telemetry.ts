/** Legacy command retained for scripts; remote telemetry cannot be enabled. */
export async function runTelemetryCommand(argv: string[] = []): Promise<void> {
  const subCommand = argv[0]?.toLowerCase() ?? 'status';
  if (['status', 'enable', 'disable'].includes(subCommand)) {
    console.log('Telemetry: DISABLED by local fork policy. Remote telemetry is unavailable; local diagnostics remain enabled.');
    return;
  }
  console.error('Usage: claude-mem telemetry [status|enable|disable]');
  process.exitCode = 1;
}
