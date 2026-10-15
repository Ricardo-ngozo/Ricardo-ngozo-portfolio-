let modelBytes;

// Share bytes across StrictMode mounts and Home → Personal navigation.
// Every scene still owns and disposes its parsed GPU resources.
export function loadCharacterBytes() {
  modelBytes ||= fetch('/models/character.glb', { priority: 'high' }).then(response => {
    if (!response.ok) throw new Error(`Character request failed: ${response.status}`);
    return response.arrayBuffer();
  }).catch(error => { modelBytes = undefined; throw error; });
  return modelBytes;
}
