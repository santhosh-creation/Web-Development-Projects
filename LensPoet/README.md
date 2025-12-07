# LensPoet — Client-side Image Editor

A free, polished, responsive image editor that runs fully client-side (offline-ready, no uploads). Includes core editing tools and “AI-like” features powered by in-browser algorithms and optional OpenCV.js (WASM).

- No paid APIs, no cloud. Your images never leave your device.
- Background removal, object removal (inpainting), smart enhance/upscaling.
- Undo/Redo, presets, brush-based refine, export PNG/JPEG.
- Prompt-helper panel to translate poem-style prompts to editing steps.
- Footer shows live date/time and: Developed By SANTHOSH_A.

## Run locally
- Just open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).
- Optional: For offline heavy features, download `opencv.js` and place at `vendor/opencv/opencv.js`.
  - Otherwise we fall back to a free CDN.

## Features
- Crop & Resize (interactive crop rectangle, aspect presets, dimension resize).
- Exposure & Contrast (live sliders).
- Color adjustments: saturation, temperature (warm/cool), vibrance, tint.
- Filters & Presets: 8 presets with preview thumbnails (B&W, Sepia, Vintage, Cinematic, High-contrast, Film, Portrait Soft, Cool Blue).
- Straighten & Rotate: -45°..+45° with auto-crop or transparency; +/-90° buttons.
- Sharpen & Blur: adjustable unsharp mask and Gaussian-like blur (worker-backed).
- Background removal:
  - Auto (GrabCut with central rectangle).
  - Foreground rectangle selection (GrabCut), refine brush (add/subtract) and color-pick background heuristic.
  - Apply transparent background or replace with solid color or uploaded image.
- Object removal (Content-aware fill):
  - Brush area and inpaint (OpenCV Telea) for acceptable results on simple scenes.
- AI enhancement & upscaling:
  - Optional denoise (bilateral filter) + unsharp.
  - Upscale 2x/4x with Lanczos (via OpenCV if available; fallback to high-quality Canvas).
- Generative fill/extend (experimental):
  - Extend canvas edges and synthesize simple textures with patch grow + blur. For complex scenes results vary.
- Prompt-helper panel:
  - Template: Subject → Details → Style → Action.
  - Includes the four poetic examples and auto-suggests steps; can nudge sliders/presets.
- Export:
  - PNG (supports transparency), JPEG (quality slider).
  - Export at current size or fit 1080p/1440p/4K.
- Local saving:
  - Download edits and optionally save/restore session in localStorage.
- Accessibility & Performance:
  - Keyboard shortcuts: C (crop), Ctrl+Z (undo), Ctrl+Shift+Z (redo), S (export), Enter/Esc.
  - ARIA labels on tool buttons, live regions for status.
  - Progressive enhancement: OpenCV.js loads lazily and only if needed.
  - Lightweight mode toggle disables heavy features for low-memory devices.
  - Heavy real-time adjustments run in a Web Worker.

## How it works (tech)
- HTML5 Canvas 2D for rendering and non-destructive passes.
- Web Worker (`fx-worker.js`) for color pipelines and convolutions.
- OpenCV.js (WASM) for segmentation (GrabCut), morphology, inpainting, Lanczos resize.
- All data kept in-memory and localStorage (if enabled). No servers.

## Limitations
- Background removal uses client-side segmentation and heuristics. Complex hair/fur or cluttered scenes may need manual refine.
- Object removal is inpainting-based and works best for small objects on fairly uniform backgrounds.
- Extend canvas is an experimental, patch-based grow. Complex generative fill is not included (no external models).

## Samples
- A tiny embedded PNG sample is included for demo.
- Sample prompts included in `/samples/sample-prompts.txt`.

## Credits
- OpenCV.js (Apache 2.0)
- No paid APIs used. Everything runs client-side.