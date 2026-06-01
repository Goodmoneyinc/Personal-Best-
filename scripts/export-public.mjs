import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const maskRoot = '.public-export-mask';
const maskedPaths = [
  ['app/api', `${maskRoot}/api`],
  ['app/admin', `${maskRoot}/admin`],
  ['middleware.ts', `${maskRoot}/middleware.ts`],
];

const renamed = [];

function restore() {
  for (const [from, to] of renamed.reverse()) {
    if (existsSync(to)) {
      renameSync(to, from);
    }
  }
}

try {
  mkdirSync(maskRoot, { recursive: true });

  for (const [from, to] of maskedPaths) {
    if (existsSync(from)) {
      renameSync(from, to);
      renamed.push([from, to]);
    }
  }

  const nextBin = join('node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');
  const result = spawnSync(nextBin, ['build'], {
    env: {
      ...process.env,
      NEXT_OUTPUT: 'export',
    },
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
} finally {
  restore();
  if (existsSync(maskRoot)) {
    rmSync(maskRoot, { recursive: true, force: true });
  }
}
