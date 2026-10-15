import { decryptFile } from './utils/decrypt.js';

let modelBytes;

// Share bytes across StrictMode mounts and Home → Personal navigation.
// Every scene still owns and disposes its parsed GPU resources.
export function loadCharacterBytes() {
  // The GLB is tracked in Git LFS; Vercel serves its pointer instead of the model.
  // The encrypted binary is committed normally and ships on every deployment.
  modelBytes ||= decryptFile('/models/character.enc', 'Character3D#@')
    .catch(error => { modelBytes = undefined; throw error; });
  return modelBytes;
}
