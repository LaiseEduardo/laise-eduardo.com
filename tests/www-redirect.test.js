import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../terraform/www-redirect.js', import.meta.url), 'utf8');
const handler = new Function(`${src}; return handler;`)();

test('www redirects to apex keeping path and query', () => {
  const res = handler({ request: { headers: { host: { value: 'www.laise-eduardo.com' } }, uri: '/x', querystring: { y: { value: '1' }, z: { value: '' } } } });
  assert.equal(res.statusCode, 301);
  assert.equal(res.headers.location.value, 'https://laise-eduardo.com/x?y=1&z');
});

test('apex passes through', () => {
  const req = { headers: { host: { value: 'laise-eduardo.com' } }, uri: '/', querystring: {} };
  assert.equal(handler({ request: req }), req);
});
