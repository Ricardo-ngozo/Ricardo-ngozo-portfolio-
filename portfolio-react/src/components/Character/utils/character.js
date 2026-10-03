import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { decryptFile } from './decrypt.js';
import { applyColors } from './applyColors.js';

export function disposeCharacter(root) {
  const resources = new Set();
  root.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    if (object.skeleton) resources.add(object.skeleton);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach(material => { resources.add(material); Object.values(material).forEach(value => { if (value?.isTexture) resources.add(value); }); });
  });
  resources.forEach(resource => resource.dispose());
}

export default function setCharacter() {
  const draco = new DRACOLoader();
  // Three's bundled decoder URLs are emitted as local assets by Vite.
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  return {
    async loadCharacter(signal) {
      const buffer = await decryptFile('/models/character.enc', 'Character3D#@', signal);
      signal.throwIfAborted();
      const gltf = await loader.parseAsync(buffer, '/models/');
      if (signal.aborted) { disposeCharacter(gltf.scene); signal.throwIfAborted(); }
      applyColors(gltf);
      const character = gltf.scene;
      ['footR', 'footL'].forEach(name => { const foot = character.getObjectByName(name); if (foot) foot.position.y = 3.36; });
      character.traverse(object => {
        if (!object.isMesh) return;
        object.castShadow = object.receiveShadow = false;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.filter(Boolean).forEach(material => {
          if (material.name === 'Material.027' || object.name === 'screenlight') { material.transparent = true; material.opacity = 0; }
        });
      });
      character.getObjectByName('Plane004')?.traverse(object => {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.filter(Boolean).forEach(material => { material.transparent = true; material.opacity = 0; });
      });
      return gltf;
    },
    dispose() { draco.dispose(); },
  };
}
