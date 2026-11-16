import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import test from 'node:test';

globalThis.crypto ||= webcrypto;
const encrypted = await readFile(new URL('../public/models/character.enc', import.meta.url));
const lfsPointer = 'version https://git-lfs.github.com/spec/v1\noid sha256:model\nsize 1537316\n';

test('loads the deployed binary, decrypts a valid GLB and shares one download', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async url => {
    requests.push(url);
    // Reproduce production: the raw GLB URL returns a Git LFS text pointer.
    return new Response(url.endsWith('.enc') ? encrypted : lfsPointer);
  });
  const { loadCharacterBytes } = await import('../src/components/Character/characterAsset.js?shared');
  const first = loadCharacterBytes();
  assert.equal(first, loadCharacterBytes());
  const bytes = await first;
  const header = new DataView(bytes);
  assert.equal(header.getUint32(0, true), 0x46546c67, 'must return GLB model bytes');
  assert.equal(header.getUint32(8, true), bytes.byteLength);
  assert.equal(await loadCharacterBytes(), bytes);
  assert.deepEqual(requests, ['/models/character.enc']);
});

test('a failed request can be retried instead of poisoning the shared cache', async t => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => ++requests === 1
    ? new Response('', { status: 503 }) : new Response(encrypted));
  const { loadCharacterBytes } = await import('../src/components/Character/characterAsset.js?retry');
  await assert.rejects(loadCharacterBytes(), /503/);
  assert.equal(new DataView(await loadCharacterBytes()).getUint32(0, true), 0x46546c67);
  assert.equal(requests, 2);
});
