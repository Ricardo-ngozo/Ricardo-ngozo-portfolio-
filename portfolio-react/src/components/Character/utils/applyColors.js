import * as THREE from "three";

const PALETTE = {
  skin: "#F5CBA7",
  hair: "#0a0a0a",
  eyebrow: "#1a1a1a",
  eye: "#ffffff",
  shirt: "#111111",
  pants: "#111111",
  shoe: "#1a1a1a",
  sole: "#0a0a0a",
};

const SHIRT_MESHES = ["Plane003", "Cube002", "Plane007"];
const PANTS_MESHES = ["Pant"];
const SHOE_MESHES = ["Shoe"];
const SOLE_MESHES = ["Sole"];

export function applyColors(gltf) {
  const cache = {};

  function unique(original, key) {
    if (!cache[key]) cache[key] = original.clone();
    return cache[key];
  }

  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;

    const mesh = child;
    const mat = mesh.material;
    if (!mat) return;

    const meshName = mesh.name;
    const matName = mat.name;

    if (matName === "Material.030") {
      const m = unique(mat, "hair");
      m.color.set(PALETTE.hair);
      mesh.material = m;
      return;
    }

    if (matName === "Material.014") {
      const m = unique(mat, "eyebrow");
      m.color.set(PALETTE.eyebrow);
      mesh.material = m;
      return;
    }

    if (matName === "EyesMaterial.001") {
      const m = unique(mat, "eye");
      m.color.set(PALETTE.eye);
      mesh.material = m;
      return;
    }

    if (matName === "default") {
      if (SHIRT_MESHES.includes(meshName)) {
        const m = unique(mat, "shirt");
        m.color.set(PALETTE.shirt);
        mesh.material = m;
        return;
      }
      if (PANTS_MESHES.includes(meshName)) {
        const m = unique(mat, "pants");
        m.color.set(PALETTE.pants);
        mesh.material = m;
        return;
      }
      if (SHOE_MESHES.includes(meshName)) {
        const m = unique(mat, "shoe");
        m.color.set(PALETTE.shoe);
        mesh.material = m;
        return;
      }
      if (SOLE_MESHES.includes(meshName)) {
        const m = unique(mat, "sole");
        m.color.set(PALETTE.sole);
        mesh.material = m;
        return;
      }

      const m = unique(mat, "skin");
      m.color.set(PALETTE.skin);
      mesh.material = m;
    }
  });
}
