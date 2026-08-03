#!/usr/bin/env node
/**
 * Bridge between `ionic serve` and Next.js dev.
 *
 * For a "custom" Ionic project, `ionic serve` invokes the `ionic:serve` npm
 * script and passes `--host <h> --port <p>`. Next.js uses `--hostname`/`--port`
 * and errors on `--host`, so this script translates the flags and launches
 * `next dev`. Ionic marks the server ready on the first line of stdout and then
 * opens the browser at the chosen port. See CLAUDE.md §7.
 */
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
let host = 'localhost';
let port = '8100';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--host') host = args[++i];
  else if (a.startsWith('--host=')) host = a.slice('--host='.length);
  else if (a === '--port') port = args[++i];
  else if (a.startsWith('--port=')) port = a.slice('--port='.length);
}

// node_modules/.bin is on PATH because this runs via `npm run`.
const child = spawn('next', ['dev', '-H', host, '-p', port], {
  stdio: 'inherit',
  shell: true,
});

const forward = (signal) => () => child.kill(signal);
process.on('SIGINT', forward('SIGINT'));
process.on('SIGTERM', forward('SIGTERM'));
child.on('exit', (code) => process.exit(code ?? 0));
