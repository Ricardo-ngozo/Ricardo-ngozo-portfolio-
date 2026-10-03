/** Map the supplied asset's node names, not unrelated Blender mesh datablock names. */
const PALETTE = { skin: '#965e3e', hair: '#0a0a0a', eyebrow: '#1a1a1a', eye: '#ffffff', shirt: '#111111', pants: '#111111', shoe: '#1a1a1a', sole: '#0a0a0a' };
export function applyColors(gltf) {
  const cache = new Map(), original = new Set();
  gltf.scene.traverse(mesh => {
    if (!mesh.isMesh || !mesh.material) return;
    const name = mesh.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const recolor = material => {
      original.add(material);
      let kind;
      if (/^face|^ear|^neck|^hand/.test(name) || name === 'plane007') kind = 'skin';
      else if (name === 'bodyshirt') kind = 'shirt';
      else if (name === 'pant') kind = 'pants';
      else if (name === 'shoe') kind = 'shoe';
      else if (name === 'sole') kind = 'sole';
      else if (material.name === 'Material.030') kind = 'hair';
      else if (material.name === 'Material.014') kind = 'eyebrow';
      else if (material.name === 'EyesMaterial.001') kind = 'eye';
      if (!kind) return material;
      const key = material.uuid + kind;
      if (!cache.has(key)) {
        const result = material.clone(); result.color.set(PALETTE[kind]); result.metalness = 0;
        result.roughness = kind === 'eye' ? .22 : kind === 'skin' ? .65 : .78;
        cache.set(key, result);
      }
      return cache.get(key);
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(recolor) : recolor(mesh.material);
  });
  const retained = new Set();
  gltf.scene.traverse(mesh => { (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).filter(Boolean).forEach(material => retained.add(material)); });
  original.forEach(material => { if (!retained.has(material)) material.dispose(); });
}

