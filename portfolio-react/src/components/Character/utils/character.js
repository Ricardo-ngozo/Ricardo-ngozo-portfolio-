import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt.js";
import { applyColors } from "./applyColors.js";

const setCharacter = (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = (onProgress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const decrypted = await decryptFile("/models/character.enc", "Character3D#@");
        const blobUrl = URL.createObjectURL(new Blob([decrypted]));

        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);

            character.traverse((child) => {
              if (child.isMesh) {
                const mesh = child;
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                mesh.frustumCulled = true;

                if (mesh.material && !Array.isArray(mesh.material)) {
                  mesh.material.precision = "mediump";
                }
              }
            });

            applyColors(gltf);

            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;

            character.traverse((child) => {
              if (child.isMesh && child.material) {
                const mat = child.material;
                if (mat.name === "Material.027" || child.name === "screenlight") {
                  mat.transparent = true;
                  mat.opacity = 0;
                }
              }
            });

            const plane004 = character.getObjectByName("Plane004");
            if (plane004) {
              plane004.traverse((child) => {
                if (child.isMesh && child.material) {
                  const mat = child.material;
                  mat.transparent = true;
                  mat.opacity = 0;
                }
              });
            }

            dracoLoader.dispose();
            resolve(gltf);
          },
          (event) => {
            if (onProgress && event.total) {
              const percent = (event.loaded / event.total) * 100;
              onProgress(Math.min(percent, 100));
            }
          },
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
