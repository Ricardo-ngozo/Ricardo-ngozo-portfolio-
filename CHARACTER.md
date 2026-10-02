# Ricardo character upgrade

## Completed

The supplied rigid low-poly prototype was used as the design reference. The replacement preserves the brown skin, black cap/headphones, cream hoodie, dark checked outfit and sneakers.

- Rebuilt smooth geometry: tapered face/jaw, shaped nose, almond eyes, eyelid and lip surfaces, ears, separate fingers/thumbs, rounded shoulders, garment folds, pockets/seams, sneaker details and a continuous headphone band.
- A real **27-joint glTF skin**, with blended elbow/knee weights and finger joints. This is no longer only a rigid-part transform rig.
- Five morph-bearing mesh groups. Controls include blink, happy, curious, surprised and annoyed; neutral uses zero expression weights.
- One exported Wave clip. Breathing, gaze, head lag and occasional idle behaviour are driven by the browser controller.
- Approximately 50,482 triangles, 23 draw calls and a 2.68 MB self-contained GLB with three generated textures.
- Three.js integration beside the existing hero content, transparent canvas, cursor tracking, click/keyboard reactions, project hover/focus reactions and contact outcome reactions.
- Lazy module/model loading, viewport/tab pausing, 45 fps desktop / 30 fps mobile caps, bounded pixel ratio, live Calm/system reduced-motion handling and disposal of listeners, observers, textures, geometry, skeletons and renderer.
- A static WebP rendered from the actual final model. It remains visible during loading, on a failed model load, without WebGL and after context loss.
- Existing Formspree action retained. JavaScript adds inline success/error feedback; failed messages retain their fields, duplicate submissions are blocked and timeouts are handled. Without JavaScript, native form submission remains available.

## Files

| Path | Purpose |
| --- | --- |
| `assets/character/ricardo-v2.glb` | Final portable model, skin, morph targets, materials and Wave clip |
| `tools/build_character.py` | Editable model and texture source |
| `assets/character/ricardo-poster.webp` | Still fallback rendered from the GLB |
| `character/viewer.js` | Readable Three.js controller and resource lifecycle |
| `character/boot.js` | Hero integration, lazy loading and interaction bindings |
| `character/contact.js` | Contact progressive enhancement and outcome events |
| `character/character.css` | Isolated stage/control styles |
| `character-preview.html` | Standalone view with expressions, turn, wave and portrait controls |
| `tools/test-character.mjs` | Production-browser checks |
| `assets/character/THREE-LICENSE.txt` | Three.js MIT licence |

## Build and preview

```sh
npm ci
npm run build
npm run preview
```

Open the printed local URL, then `/character-preview.html` to inspect the asset. The production output is `dist/`; Vercel is configured to build and serve that directory. The bundled viewer is also committed so the source site continues to work on a plain static host.

To regenerate the model, install the two Python dependencies in `tools/character-requirements.txt`, then run:

```sh
python tools/build_character.py
npm run build
```

Regenerating the model does not automatically replace the poster: render a matching still from `character-preview.html` afterward.

## Validation

Production build: passed. Browser checks use Edge/Chromium and the built `dist/` output, including a 390px touch/mobile context.

Checked: model rendering; eye/head tracking; all five expression states and morph weights; Wave playback; observed blinking; project hover/filter/preview behaviour; contact native validation, simulated success and simulated server failure; offscreen pausing; Calm/system reduced motion; mobile overflow; mount removal/disposal; and a forced no-WebGL fallback.

Contact responses are intercepted locally in these checks. **No live test messages were sent; actual Formspree delivery has not been verified.** Physical mobile hardware, Safari/Firefox and the Vercel preview behind account sign-in were not tested.

To rerun browser checks, install Playwright 1.62.1 as a development tool and its Chromium browser, start `npm run preview`, then run:

```sh
PREVIEW_URL=http://127.0.0.1:4173 node tools/test-character.mjs
```

On PowerShell, set `$env:PREVIEW_URL` first. Optional `BROWSER_PATH` selects an installed browser; `PLAYWRIGHT_MODULE` selects an existing Playwright installation.

## Asset limitations — read before presenting this as a realistic human

This is a **procedurally modelled, stylized character**, not photorealism, a body scan or a production digital double. Blender/bpy was unavailable; no .blend source was produced. Python source is the editable deliverable and the GLB can be imported into Blender.

An artist pass is still needed for likeness, anatomically convincing facial sculpting, continuous facial retopology, eyelid/lip deformation at close range, hand anatomy, shoulder deformation, and physically believable cloth. Small shading/seam artefacts can remain in close portraits and strong expressions. The cloth is a generated woven/check pattern with modelled folds; it has no cloth simulation. Skin has a subtle procedural normal map, not scanned skin or subsurface scattering. There are no speech visemes, jaw rig, full facial action-unit rig or motion capture.

## Provenance and licensing

No third-party character model, stock texture or motion-capture asset was downloaded. Geometry and textures are generated by the supplied Python source using the user's kit/reference as the design brief. The kit's ownership terms remain the user's responsibility; no new public asset licence is imposed here. Three.js is MIT licensed, with its licence retained. Build tooling and package versions are recorded in package-lock.json.
