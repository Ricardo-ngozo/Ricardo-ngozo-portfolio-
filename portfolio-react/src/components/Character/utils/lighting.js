import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

export default function setLighting(scene) {
  let disposed = false, enabled = false, environment;
  const key = new THREE.DirectionalLight(0xfff3e6, 1.5); key.position.set(-.47, .8, 2);
  const fill = new THREE.HemisphereLight(0xfff3e6, 0x25223b, .8);
  const point = new THREE.PointLight(0xc2a4ff, 0, 100, 3); point.position.set(3, 12, 4);
  scene.add(key, fill, point);
  new HDRLoader().load('/models/char_enviorment.hdr', texture => {
    if (disposed) { texture.dispose(); return; }
    environment = texture; texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; scene.environmentIntensity = enabled ? .35 : 0;
    scene.environmentRotation.set(5.76, 85.85, 1);
  }, undefined, () => { /* Key and fill remain available if the HDR fails. */ });
  return {
    turnOnLights() { enabled = true; scene.environmentIntensity = .35; },
    setPointLight(mesh) { point.intensity = mesh?.material?.opacity > .9 ? (mesh.material.emissiveIntensity || 0) * 20 : 0; },
    dispose() { disposed = true; scene.environment = null; environment?.dispose(); key.dispose(); fill.dispose(); point.dispose(); },
  };
}
