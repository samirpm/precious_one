// Self-contained local PostgreSQL for development using the binaries bundled
// with @embedded-postgres/windows-x64. Idempotent:
//   - initialises .pgdata once (user: postgres / password: password)
//   - starts the server via pg_ctl (spawned through WMI so it is fully
//     detached from the calling process — required in sandboxed shells
//     where a job-object kill would otherwise take the server down)
//   - creates the "precious_one" database over TCP if missing
// Run: npm run db
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const BIN = path.join(root, 'node_modules', '@embedded-postgres', 'windows-x64', 'native', 'bin');
const DATA = path.join(root, '.pgdata');
const LOG = path.join(DATA, 'server.log');
const PORT = 5432;
const DB = 'precious_one';
const USER = 'postgres';
const PW = 'password';

function die(label, r) {
  console.error(`[pg] ${label} failed (exit ${r.status})`);
  if (r.stdout) console.error(r.stdout.toString());
  if (r.stderr) console.error(r.stderr.toString());
  process.exit(1);
}

function run(label, exe, args) {
  const r = spawnSync(path.join(BIN, exe), args, { stdio: 'pipe' });
  if (r.status !== 0) die(label, r);
  return r;
}

function portOpen() {
  return new Promise((resolve) => {
    const socket = net.connect({ port: PORT, host: '127.0.0.1' });
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Spawns pg_ctl through WMI so the server lives outside this process tree.
function startViaWmi() {
  const ps = `
    $bin = '${BIN.replace(/\\/g, '\\\\')}\\pg_ctl.exe'
    $data = '${DATA.replace(/\\/g, '\\\\')}'
    $log = '${LOG.replace(/\\/g, '\\\\')}'
    $cmd = "\`"$bin\`" -D \`"$data\`" -l \`"$log\`" -o \`"-p ${PORT}\`" start"
    $r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmd }
    Write-Output "WMI ReturnValue: $($r.ReturnValue)"
  `;
  const tmp = path.join(os.tmpdir(), `pg-spawn-${Date.now()}.ps1`);
  fs.writeFileSync(tmp, ps);
  try {
    const r = spawnSync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tmp],
      { stdio: 'pipe' },
    );
    const out = `${r.stdout ?? ''}`;
    if (!/ReturnValue: 0/.test(out)) {
      console.error('[pg] WMI spawn failed:', out, r.stderr?.toString() ?? '');
      process.exit(1);
    }
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

async function createDatabase() {
  const client = new pg.Client({
    host: '127.0.0.1',
    port: PORT,
    user: USER,
    password: PW,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  try {
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${DB}`);
      console.log(`[pg] database "${DB}" created`);
    } else {
      console.log(`[pg] database "${DB}" already exists`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  // 1. Initialise the data directory once (initdb needs an EMPTY target dir).
  if (!fs.existsSync(path.join(DATA, 'PG_VERSION'))) {
    fs.rmSync(DATA, { recursive: true, force: true });
    // pwfile must live outside the data dir
    const pwfile = path.join(os.tmpdir(), `pg-pwfile-${Date.now()}.tmp`);
    fs.writeFileSync(pwfile, PW);
    run('initdb', 'initdb.exe', [
      '-D', DATA, '-U', USER, `--pwfile=${pwfile}`, '--auth=password', '-E', 'UTF8',
      '--no-locale',
    ]);
    fs.rmSync(pwfile, { force: true });
    console.log('[pg] data directory initialised at', DATA);
  } else {
    console.log('[pg] data directory already initialised');
  }

  // 2. Start the server, fully detached (WMI spawn).
  if (!(await portOpen())) {
    startViaWmi();
    for (let i = 0; i < 50 && !(await portOpen()); i++) await sleep(200);
    if (!(await portOpen())) {
      console.error('[pg] server did not open port', PORT);
      process.exit(1);
    }
    console.log(`[pg] postgres started on :${PORT} (log: ${LOG})`);
  } else {
    console.log(`[pg] postgres already running on :${PORT}`);
  }

  // 3. Create the app database over TCP.
  await createDatabase();
}

main().catch((err) => {
  console.error('[pg] failed:', err);
  process.exit(1);
});
