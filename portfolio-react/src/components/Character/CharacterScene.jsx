import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import setCharacter, { disposeCharacter } from './utils/character.js';
import setLighting from './utils/lighting.js';
import { handleHeadRotation } from './utils/mouseUtils.js';
import setAnimations from './utils/animationUtils.js';
import './character.css';

const CAM_CLOSE = { y: 13.1, z: 24.7, zoom: 1.1 };
const CAM_FULL = { y: 7.5, z: 42, zoom: 1 };

export default function CharacterScene() {
  const containerRef = useRef(null);
  const hoverRef = useRef(null);
  const [state, setState] = useState('loading');
  useEffect(() => {
    const container = containerRef.current;
    const hover = hoverRef.current;
    const controller = new AbortController();
    const scene = new THREE.Scene();
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: devicePixelRatio < 2, powerPreference: 'low-power' });
    } catch { setState('fallback'); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.append(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(14.5, 1, .1, 1000);
    camera.position.set(0, CAM_CLOSE.y, CAM_CLOSE.z); camera.zoom = CAM_CLOSE.zoom;
    let character, animations, hoverCleanup, head, screenLight, frame = 0, last = 0, visible = false, scrollT = 0;
    let calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.Workshop?.calm;
    let disposed = false, contextLost = false;
    const mouse = { x: 0, y: 0 };
    const lighting = setLighting(scene);
    const loader = setCharacter(renderer, scene, camera);
    const draw = time => {
      frame = 0;
      if (disposed || contextLost || !visible || document.hidden) return;
      const dt = Math.min((time - last) / 1000 || .016, .1); last = time;
      if (!calm) {
        const easing = 1 - Math.exp(-7 * dt);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, THREE.MathUtils.lerp(CAM_CLOSE.y, CAM_FULL.y, scrollT), easing);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, THREE.MathUtils.lerp(CAM_CLOSE.z, CAM_FULL.z, scrollT), easing);
        camera.zoom = THREE.MathUtils.lerp(camera.zoom, THREE.MathUtils.lerp(CAM_CLOSE.zoom, CAM_FULL.zoom, scrollT), easing);
        if (head) handleHeadRotation(head, mouse.x, mouse.y, easing * .6, easing, THREE.MathUtils.lerp);
        animations?.mixer.update(dt);
      }
      camera.updateProjectionMatrix(); lighting.setPointLight(screenLight); renderer.render(scene, camera);
      if (!calm) frame = requestAnimationFrame(draw);
    };
    const sync = () => { cancelAnimationFrame(frame); last = 0; if (!disposed && visible && !document.hidden) frame = requestAnimationFrame(draw); };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height)); camera.aspect = width / Math.max(1, height);
      // Keep the full face inside a narrow mobile canvas.
      camera.fov = camera.aspect < .85 ? 19 : 14.5; camera.updateProjectionMatrix(); sync();
    };
    const onScroll = () => {
      const hero = container.closest('.hero-section'); if (!hero) return;
      scrollT = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(1, hero.clientHeight)));
    };
    const onPointer = event => {
      if (calm || event.pointerType === 'touch') return;
      mouse.x = event.clientX / innerWidth * 2 - 1; mouse.y = 1 - event.clientY / innerHeight * 2;
    };
    const onMotion = () => { calm = window.Workshop?.calm || matchMedia('(prefers-reduced-motion: reduce)').matches; if (calm) { mouse.x = mouse.y = 0; } sync(); };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); observer.observe(container);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
    document.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', sync); document.addEventListener('workshop:motion', onMotion);
    window.addEventListener('scroll', onScroll, { passive: true });
    const lost = event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); setState('fallback'); };
    const restored = () => { contextLost = false; setState(character ? 'ready' : 'loading'); sync(); };
    renderer.domElement.addEventListener('webglcontextlost', lost); renderer.domElement.addEventListener('webglcontextrestored', restored);
    resize(); onScroll();
    loader.loadCharacter(controller.signal).then(gltf => {
      if (disposed) { disposeCharacter(gltf.scene); return; }
      character = gltf.scene; scene.add(character);
      animations = setAnimations(gltf);
      hoverCleanup = animations.hover(gltf, hover, () => calm);
      head = character.getObjectByName('spine006'); screenLight = character.getObjectByName('screenlight');
      lighting.turnOnLights(); animations.startIntro(calm); setState('ready'); sync();
    }).catch(error => { if (!disposed) { console.warn('Character unavailable', error); setState('fallback'); } });
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame);
      observer.disconnect(); resizeObserver.disconnect(); hoverCleanup?.(); animations?.dispose(); loader.dispose(); lighting.dispose();
      document.removeEventListener('pointermove', onPointer); document.removeEventListener('visibilitychange', sync); document.removeEventListener('workshop:motion', onMotion); window.removeEventListener('scroll', onScroll);
      renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.domElement.removeEventListener('webglcontextrestored', restored);
      if (character) disposeCharacter(character);
      scene.clear(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, []);
  return <div className="character-wrap" data-state={state} role="img" aria-label="Interactive 3D character beside Ricardo's introduction">
    <div className="character-sticky"><div className="character-canvas-div" ref={containerRef}>
      <div className="character-rim" aria-hidden="true" />
      <div className="character-hover" ref={hoverRef} aria-hidden="true" />
    </div></div>
    <img className="character-fallback" src="/images/ChatGPT Image May 14, 2026, 10_57_41 AM.png" alt="" />
    {state === 'loading' && <p className="character-status" role="status">Bringing the character to life…</p>}
  </div>;
}
