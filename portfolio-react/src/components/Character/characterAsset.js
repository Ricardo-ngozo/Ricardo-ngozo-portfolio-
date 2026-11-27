import { decryptFile } from './utils/decrypt.js';
let modelBytes;
const validGLB = buffer => buffer.byteLength >= 12 && new DataView(buffer).getUint32(0, true) === 0x46546c67;
export function loadCharacterBytes() {
  modelBytes ||= (async () => {
    try {
      const response = await fetch('/models/character.glb', { priority: 'high' });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        if (validGLB(buffer)) return buffer;
      }
    } catch { /* Recover from missing files or an unresolved Git LFS pointer. */ }
    const buffer = await decryptFile('/models/character.enc', 'Character3D#@');
    if (!validGLB(buffer)) throw new Error('Character asset is not a valid GLB');
    return buffer;
  })().catch(error => { modelBytes = undefined; throw error; });
  return modelBytes;
}
