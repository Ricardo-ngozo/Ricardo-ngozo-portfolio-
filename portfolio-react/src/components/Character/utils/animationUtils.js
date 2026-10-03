import * as THREE from "three";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData.js";

const setAnimations = (gltf) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);
  let blinkTimer;

  if (gltf.animations) {
    const introClip = gltf.animations.find((clip) => clip.name === "introAnimation");
    if (introClip) {
    const introAction = mixer.clipAction(introClip);
    introAction.setLoop(THREE.LoopOnce, 1);
    introAction.clampWhenFinished = true;
    introAction.play();
    }

    const clipNames = ["key1", "key2", "key5", "key6"];
    clipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
        action.timeScale = 1.2;
      } else {
        console.error(`Animation "${name}" not found`);
      }
    });

    let typingAction = null;
    typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 1.2;
    }
  }

  function startIntro(calm = false) {
    const intro = gltf.animations.find(clip => clip.name === 'introAnimation');
    if (intro) {
      const action = mixer.clipAction(intro); action.clampWhenFinished = true; action.reset().play();
      if (calm) { action.time = intro.duration; mixer.update(0); }
    }
    if (calm) return;
    blinkTimer = setTimeout(() => {
      const blink = gltf.animations.find(clip => clip.name === 'Blink');
      if (blink) mixer.clipAction(blink).play().fadeIn(.5);
    }, 2500);
  }

  function hover(gltf, hoverDiv, isCalm = () => false) {
    let eyeBrowUpAction = createBoneAction(gltf, mixer, "browup", eyebrowBoneNames);
    let isHovering = false;

    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }

    const onHoverFace = () => {
      if (!isCalm() && eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };

    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };

    if (!hoverDiv) return undefined;
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);

    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover, dispose() { clearTimeout(blinkTimer); mixer.stopAllAction(); mixer.uncacheRoot(character); } };
};

const createBoneAction = (gltf, mixer, clipName, boneNames) => {
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clipName);
  if (!animationClip) {
    console.error(`Animation "${clipName}" not found in GLTF file.`);
    return null;
  }

  const filteredClip = filterAnimationTracks(animationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (clip, boneNames) => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(clip.name + "_filtered", clip.duration, filteredTracks);
};

export default setAnimations;
