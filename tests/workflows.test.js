import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const deploy = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

test('deploy job runs only after the test job succeeds', () => {
  assert.match(deploy, /^\s{2}test:\s*$/m, 'deploy.yml must define a test job');
  assert.match(deploy, /^\s{4}needs:\s*test\s*$/m, 'deploy job must declare needs: test');
});
