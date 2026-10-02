import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character.js";
import setLighting from "./utils/lighting.js";
import handleResize from "./utils/resizeUtils.js";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils.js";
import setAnimations from "./utils/animationUtils.js";
import "./character.css";

const CAM_CLOSE = { y: 13.1, z: 24.7, zoom: 1.1 };
const CAM_FULL = { y: 7.5, z: 42.0, zoom: 1.0 };

export default function CharacterScene() {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const scrollWrap = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    if (!canvasDiv.current) return undefined;

    const rafId = requestAnimationFrame(() => {
      const container = canvasDiv.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      container.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, width / height, 0.1, 1000);
      camera.position.set(0, CAM_CLOSE.y, CAM_CLOSE.z);
      camera.zoom = CAM_CLOSE.zoom;
      camera.updateProjectionMatrix();

      let headBone = null;
      let screenLight = null;
      let mixer = null;
      let animationId = 0;
      let hoverCleanup = null;
      let scrollT = 0;
      let debounce;

      const clock = new THREE.Clock();
      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(renderer, scene, camera);
      const onResize = () => handleResize(renderer, camera, canvasDiv);

      const onScroll = () => {
        const el = scrollWrap.current;
        if (!el) return;

        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          scrollT = el.scrollTop / maxScroll;
          return;
        }

        const rect = el.getBoundingClientRect();
        const viewportRange = window.innerHeight + rect.height;
        const progress = (window.innerHeight - rect.top) / viewportRange;
        scrollT = Math.min(Math.max(progress, 0), 1);
      };

      const mouse = { x: 0, y: 0 };
      const interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event) =>
        handleMouseMove(event, (x, y) => {
          mouse.x = x;
          mouse.y = y;
        });

      const onTouchStart = (event) => {
        const element = event.target;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (touchEvent) =>
            handleTouchMove(touchEvent, (x, y) => {
              mouse.x = x;
              mouse.y = y;
            })
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, ix, iy) => {
          mouse.x = x;
          mouse.y = y;
          interpolation.x = ix;
          interpolation.y = iy;
        });
      };

      const cameraLerpSpeed = 0.12;

      loadCharacter(() => {})
        .then((gltf) => {
          if (!gltf) return;

          const animations = setAnimations(gltf);
          hoverCleanup = animations.hover ? animations.hover(gltf, hoverDivRef.current) : null;
          mixer = animations.mixer;

          const character = gltf.scene;
          scene.add(character);

          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;

          light.turnOnLights();
          animations.startIntro();
          window.addEventListener("resize", onResize);
        })
        .catch((error) => {
          console.error("CharacterScene load failed:", error);
        });

      scrollWrap.current?.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("mousemove", onMouseMove);
      container.addEventListener("touchstart", onTouchStart);
      container.addEventListener("touchend", onTouchEnd);

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          THREE.MathUtils.lerp(CAM_CLOSE.y, CAM_FULL.y, scrollT),
          cameraLerpSpeed
        );
        camera.position.z = THREE.MathUtils.lerp(
          camera.position.z,
          THREE.MathUtils.lerp(CAM_CLOSE.z, CAM_FULL.z, scrollT),
          cameraLerpSpeed
        );
        camera.zoom = THREE.MathUtils.lerp(
          camera.zoom,
          THREE.MathUtils.lerp(CAM_CLOSE.zoom, CAM_FULL.zoom, scrollT),
          cameraLerpSpeed
        );
        camera.updateProjectionMatrix();

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
      };
      animate();

      container.__cleanup = () => {
        cancelAnimationFrame(animationId);
        clearTimeout(debounce);
        if (hoverCleanup) hoverCleanup();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("mousemove", onMouseMove);
        scrollWrap.current?.removeEventListener("scroll", onScroll);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchend", onTouchEnd);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (canvasDiv.current?.__cleanup) {
        canvasDiv.current.__cleanup();
      }
    };
  }, []);

  return (
    <div className="character-wrap" ref={scrollWrap}>
      <div className="character-sticky">
        <div className="character-canvas-div" ref={canvasDiv}>
          <div className="character-rim" aria-hidden="true" />
          <div className="character-hover" ref={hoverDivRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
