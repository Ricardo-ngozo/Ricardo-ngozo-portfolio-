import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/** One renderer, owned by this mount. No global render loop or event handlers. */
export async function createCharacter(host, { signal, assetURL, calm = false, onState = () => {} } = {}) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, matchMedia("(max-width: 760px)").matches ? 1.35 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = "character-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  const camera = new THREE.PerspectiveCamera(29, 1, .01, 20);
  let portrait = false, yaw = -.13, disposed = false, lost = false, visible = true, raf = 0, last = 0, nextFrame = 0;
  let elapsed = 0, mood = "neutral", moodUntil = Infinity, blinkAt = 2.6, blinkStart = -10, idleAt = 9, waveStart = -10;
  const target = new THREE.Vector2(), gaze = new THREE.Vector2();
  let gltf, actor, mixer, waveAction;
  const bones = {}, morphMeshes = [], materials = new Set(), geometries = new Set(), textures = new Set();
  const lights = [
    new THREE.HemisphereLight(0xe6eeff, 0x625047, 1.6),
    new THREE.DirectionalLight(0xffeadb, 3.3),
    new THREE.DirectionalLight(0xb9ceff, 1.7),
    new THREE.DirectionalLight(0xffffff, 2)
  ];
  lights[1].position.set(-2, 3, 4); lights[2].position.set(3, 1.6, 2); lights[3].position.set(0, 2.5, -3);
  lights.forEach(light => scene.add(light));
  const orbit = new THREE.Group(); scene.add(orbit);
  function resize() {
    if (disposed) return;
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height;
    camera.position.set(0, portrait ? 1.69 : 1.10, portrait ? .72 : 3.85);
    camera.lookAt(0, portrait ? 1.69 : .94, 0);
    camera.updateProjectionMatrix(); requestFrame();
  }
  function release() {
    if (disposed) return; disposed = true; cancelAnimationFrame(raf); raf = 0;
    resizeObserver.disconnect(); visibilityObserver.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
    document.removeEventListener("visibilitychange", visibilityChange);
    signal?.removeEventListener("abort", release);
    mixer?.stopAllAction(); if (actor) mixer?.uncacheRoot(actor);
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.filter(Boolean).forEach(m => { materials.add(m); Object.values(m).forEach(v => { if (v?.isTexture) textures.add(v); }); });
      if (object.isSkinnedMesh) object.skeleton.dispose();
    });
    textures.forEach(t => { t.dispose(); if (t.image?.close) t.image.close(); });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); scene.clear();
  }
  function contextLost(event) { event.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; onState({ status: "fallback", reason: "context-lost" }); }
  function contextRestored() { lost = false; onState({ status: "ready" }); requestFrame(); }
  function visibilityChange() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else requestFrame(); }
  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(raf); raf = 0; } else requestFrame();
  }, { threshold: .01 });
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  document.addEventListener("visibilitychange", visibilityChange);
  signal?.addEventListener("abort", release, { once: true });
  if (signal?.aborted) { release(); throw new DOMException("Aborted", "AbortError"); }
  try {
    // Fetch is abortable; GLTFLoader alone does not cancel in-flight loads.
    const response = await fetch(assetURL, { signal });
    if (!response.ok) throw new Error("Character asset could not be loaded.");
    const data = await response.arrayBuffer();
    gltf = await new GLTFLoader().parseAsync(data, new URL(".", assetURL).href);
    actor = gltf.scene;
    if (disposed || signal?.aborted) {
      actor.traverse(o => { o.geometry?.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.filter(Boolean).forEach(m => { Object.values(m).forEach(t => { if(t?.isTexture){ t.dispose();t.image?.close?.(); } });m.dispose(); });o.skeleton?.dispose(); });
      throw new DOMException("Aborted", "AbortError");
    }
    orbit.add(actor);
    actor.traverse(object => {
      if (object.isBone) bones[object.name] = object;
      if (object.morphTargetDictionary) morphMeshes.push(object);
      if (object.isMesh) object.frustumCulled = false; // The waving hand can leave the bind-pose bounds.
    });
    bones.EyeL = actor.getObjectByName("EyeL"); bones.EyeR = actor.getObjectByName("EyeR");
    mixer = new THREE.AnimationMixer(actor);
    const wave = gltf.animations.find(clip => clip.name === "Wave");
    if (wave) { waveAction = mixer.clipAction(wave); waveAction.setLoop(THREE.LoopOnce, 1); waveAction.clampWhenFinished = false; }
    host.append(renderer.domElement); resizeObserver.observe(host); visibilityObserver.observe(host);
    resize(); setEmotion("neutral", Infinity); if (!calm) waveHello();
    onState({ status: "ready" }); requestFrame();
  } catch (error) { release(); throw error; }

  function setEmotion(value, seconds = 4) {
    if (!["neutral", "happy", "curious", "surprised", "annoyed"].includes(value)) return;
    mood = value; moodUntil = seconds === Infinity ? Infinity : elapsed + seconds;
    onState({ emotion: mood }); requestFrame();
  }
  function waveHello() {
    if (calm || !waveAction) { setEmotion("happy", 3); return; }
    waveAction.reset().play(); waveStart = elapsed; setEmotion("happy", 3);
    onState({ action: "wave" }); requestFrame();
  }
  function pose(dt) {
    const ease = calm ? 1 : 1 - Math.exp(-dt * 9);
    if (elapsed > moodUntil && mood !== "neutral") { mood = "neutral"; onState({ emotion: mood }); }
    if (!calm) {
      gaze.lerp(target, 1 - Math.exp(-dt * 18));
      if (bones.Head) {
        bones.Head.rotation.y = THREE.MathUtils.damp(bones.Head.rotation.y, gaze.x * .24, 3.5, dt);
        bones.Head.rotation.x = THREE.MathUtils.damp(bones.Head.rotation.x, -gaze.y * .11, 3.5, dt);
        bones.Head.rotation.z = THREE.MathUtils.damp(bones.Head.rotation.z, mood === "curious" ? -.065 : Math.sin(elapsed * .35) * .012, 5, dt);
      }
      for (const eye of [bones.EyeL, bones.EyeR]) if (eye) { eye.rotation.y = gaze.x * .16; eye.rotation.x = -gaze.y * .09; }
      if (bones.Chest) { bones.Chest.scale.y = 1 + Math.sin(elapsed * 1.55) * .006; bones.Chest.scale.z = 1 + Math.sin(elapsed * 1.55) * .01; }
      if (bones.Spine) bones.Spine.rotation.z = Math.sin(elapsed * .47) * .009;
      mixer.update(dt);
      if (bones.UpperArmL) bones.UpperArmL.rotation.z = .06;
      if (bones.ForearmL) bones.ForearmL.rotation.x = -.10;
      if (!waveAction?.isRunning()) { if(bones.UpperArmR) bones.UpperArmR.rotation.z = -.06; if(bones.ForearmR) bones.ForearmR.rotation.x = -.10; }
      if (elapsed > blinkAt) { blinkStart = elapsed; blinkAt = elapsed + 2.8 + Math.random() * 3.6; }
      if (elapsed > idleAt && elapsed - waveStart > 4) {
        idleAt = elapsed + 12 + Math.random() * 10;
        if (mood === "neutral") { setEmotion("curious", 1.8); target.set((Math.random() - .5) * .6, .12); }
      }
    } else {
      for (const name of ["Head", "Spine", "UpperArmR", "ForearmR", "HandR"]) bones[name]?.rotation.set(0,0,0);
      for (const eye of [bones.EyeL,bones.EyeR]) eye?.rotation.set(0,0,0);
      bones.Chest?.scale.set(1,1,1);
      if(bones.UpperArmL)bones.UpperArmL.rotation.z=.06;
      if(bones.UpperArmR)bones.UpperArmR.rotation.z=-.06;
      if(bones.ForearmL)bones.ForearmL.rotation.x=-.10;
      if(bones.ForearmR)bones.ForearmR.rotation.x=-.10;
    }
    const blinkTime = elapsed - blinkStart;
    const blink = !calm && blinkTime >= 0 && blinkTime < .19 ? Math.sin(blinkTime / .19 * Math.PI) : 0;
    for (const mesh of morphMeshes) for (const [name, index] of Object.entries(mesh.morphTargetDictionary)) {
      const desired = name === "blink" ? blink : name === mood ? 1 : 0;
      mesh.morphTargetInfluences[index] = name === "blink" ? desired : THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], desired, ease);
    }
    orbit.rotation.y = yaw;
  }
  function frame(now) {
    raf = 0;
    if (disposed || lost || !visible || document.hidden) return;
    const interval = matchMedia("(max-width: 760px)").matches ? 1000 / 30 : 1000 / 45;
    if (now < nextFrame && !calm) { raf = requestAnimationFrame(frame); return; }
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 45;
    last = now; nextFrame = now + interval; if (!calm) elapsed += dt;
    pose(dt); renderer.render(scene, camera);
    if (!calm) raf = requestAnimationFrame(frame);
  }
  function requestFrame() { if (!raf && !disposed && !lost && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
  return {
    setEmotion, wave: waveHello,
    lookAt(x, y) { if (!calm) { target.set(THREE.MathUtils.clamp(x,-1,1), THREE.MathUtils.clamp(y,-1,1)); requestFrame(); } },
    setCalm(value) { calm = Boolean(value); if (calm) mixer.stopAllAction(); onState({ calm }); requestFrame(); },
    setPortrait(value) { portrait = Boolean(value); resize(); },
    setYaw(value) { yaw = THREE.MathUtils.clamp(value, -Math.PI, Math.PI); requestFrame(); },
    inspect() { return { mood, calm, disposed, portrait, visible, renders: renderer.info.render.calls, frames: renderer.info.render.frame, triangles: renderer.info.render.triangles, joints: Object.keys(bones).length, head: bones.Head?.rotation.toArray(), eye: bones.EyeL?.rotation.toArray(), waveRunning: waveAction?.isRunning(), morphs: morphMeshes.map(m=>({name:m.name, targets:{...m.morphTargetDictionary}, weights:[...m.morphTargetInfluences]})) }; },
    dispose: release
  };
}

