/* LensPoet — Client-side Image Editor
   All processing runs in the browser. Optional OpenCV.js is loaded lazily.
   Developed By SANTHOSH_A
*/

// DOM hooks
const canvas = document.getElementById('mainCanvas');
const overlayCanvas = document.getElementById('overlayCanvas');
const maskCanvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const octx = overlayCanvas.getContext('2d');
const mctx = maskCanvas.getContext('2d');

const canvasWrap = document.getElementById('canvasWrap');
const spinner = document.getElementById('spinner');
const toastEl = document.getElementById('toast');
const cvStatusEl = document.getElementById('cvStatus');

// Topbar & modals
const fileInput = document.getElementById('fileInput');
const btnSave = document.getElementById('btnSave');
const exportModal = document.getElementById('exportModal');
const helpModal = document.getElementById('helpModal');
const btnHelp = document.getElementById('btnHelp');

// Footer time/date
const liveDate = document.getElementById('liveDate');
const liveTime = document.getElementById('liveTime');

// Controls
const btnFit = document.getElementById('btnFit');
const btnActual = document.getElementById('btnActual');
const btnResetAll = document.getElementById('btnResetAll');
const btnSaveSession = document.getElementById('btnSaveSession');
const chkAutosave = document.getElementById('chkAutosave');
const toggleLightweight = document.getElementById('toggleLightweight');

const btnCrop = document.getElementById('btnCrop');
const btnResize = document.getElementById('btnResize');
const cropAspect = document.getElementById('cropAspect');
const resizeW = document.getElementById('resizeW');
const resizeH = document.getElementById('resizeH');
const resizeKeep = document.getElementById('resizeKeep');
const btnCropApply = document.getElementById('btnCropApply');
const btnCropCancel = document.getElementById('btnCropCancel');

const rotateSlider = document.getElementById('rotateSlider');
const chkAutoCrop = document.getElementById('chkAutoCrop');
const chkTransparentRotate = document.getElementById('chkTransparentRotate');
const btnRotateLeft = document.getElementById('btnRotateLeft');
const btnRotateRight = document.getElementById('btnRotateRight');
const btnRotateApply = document.getElementById('btnRotateApply');

const sExposure = document.getElementById('sExposure');
const sContrast = document.getElementById('sContrast');
const sSaturation = document.getElementById('sSaturation');
const sVibrance = document.getElementById('sVibrance');
const sTemp = document.getElementById('sTemp');
const sTint = document.getElementById('sTint');
const btnAdjApply = document.getElementById('btnAdjApply');
const btnAdjReset = document.getElementById('btnAdjReset');

const sSharpen = document.getElementById('sSharpen');
const sBlur = document.getElementById('sBlur');
const btnSharpBlurApply = document.getElementById('btnSharpBlurApply');
const btnSharpBlurReset = document.getElementById('btnSharpBlurReset');

const presetStrip = document.getElementById('presetStrip');
const btnApplyPreset = document.getElementById('btnApplyPreset');
const btnResetPreset = document.getElementById('btnResetPreset');

const btnBgAuto = document.getElementById('btnBgAuto');
const btnBgColorPick = document.getElementById('btnBgColorPick');
const btnBgFGRect = document.getElementById('btnBgFGRect');
const btnBgRefine = document.getElementById('btnBgRefine');
const bgBrushSize = document.getElementById('bgBrushSize');
const bgBrushSoft = document.getElementById('bgBrushSoft');
const btnBgApplyTransparent = document.getElementById('btnBgApplyTransparent');
const btnBgReplace = document.getElementById('btnBgReplace');
const bgColor = document.getElementById('bgColor');
const bgUpload = document.getElementById('bgUpload');

const btnObjectBrush = document.getElementById('btnObjectBrush');
const btnObjectClear = document.getElementById('btnObjectClear');
const objBrushSize = document.getElementById('objBrushSize');
const objBrushSoft = document.getElementById('objBrushSoft');
const btnInpaintPreview = document.getElementById('btnInpaintPreview');
const btnInpaintApply = document.getElementById('btnInpaintApply');

const extTop = document.getElementById('extTop');
const extRight = document.getElementById('extRight');
const extBottom = document.getElementById('extBottom');
const extLeft = document.getElementById('extLeft');
const btnExtendPreview = document.getElementById('btnExtendPreview');
const btnExtendApply = document.getElementById('btnExtendApply');

const chkDenoise = document.getElementById('chkDenoise');
const chkUnsharp = document.getElementById('chkUnsharp');
const selUpscale = document.getElementById('selUpscale');
const btnEnhance = document.getElementById('btnEnhance');

const promptInput = document.getElementById('promptInput');
const btnUsePrompt = document.getElementById('btnUsePrompt');
const promptPlan = document.getElementById('promptPlan');
const btnUndo = document.getElementById('btnUndo');
const btnRedo = document.getElementById('btnRedo');
const btnOpenSamples = document.getElementById('btnOpenSamples');

// Export controls
const expFormat = document.getElementById('expFormat');
const expQualityRow = document.getElementById('expQualityRow');
const expQuality = document.getElementById('expQuality');
const expSize = document.getElementById('expSize');
const btnDoExport = document.getElementById('btnDoExport');
const btnExportCancel = document.getElementById('btnExportCancel');
const btnHelpClose = document.getElementById('btnHelpClose');

// State
const state = {
  img: null,
  width: 0,
  height: 0,
  scale: 1,
  panX: 0,
  panY: 0,
  tool: null,
  lightweight: false,
  opencvReady: false,
  history: [],
  redo: [],
  maxHistory: 12,
  crop: { active: false, rect: null, aspect: 'free' },
  rotatePending: 0,
  adjustments: { exp:0, con:0, sat:0, vib:0, temp:0, tint:0 },
  sharpen: 0,
  blur: 0,
  presetSelected: null,
  bg: {
    mode: null, // 'auto','fgrect','refine'
    mask: null,
    brushing: false,
    brushMode: 'add', // 'add'/'subtract' for refine
    colorPick: false,
    selectedBG: null // image for replacement
  },
  obj: {
    brushing: false,
    mask: null,
  },
  extendPreview: null,
  autosave: false,
  worker: null,
  workerBusy: false,
};

// Utils
function showToast(msg, ms=1500){ toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'), ms); }
function showSpinner(on){ spinner.classList.toggle('hidden', !on); }
function clamp(v,min,max){ return Math.min(max, Math.max(min,v)); }
function dpr(){ return window.devicePixelRatio || 1; }

// Time/Date
function tickClock(){
  const now = new Date();
  liveDate.textContent = now.toLocaleDateString();
  liveTime.textContent = now.toLocaleTimeString();
}
setInterval(tickClock, 1000); tickClock();

// Canvas sizing
function resizeCanvases(w, h){
  const ratio = dpr();
  [canvas, overlayCanvas, maskCanvas].forEach(c=>{
    c.width = Math.max(1, Math.floor(w*ratio));
    c.height = Math.max(1, Math.floor(h*ratio));
    c.style.width = w + 'px';
    c.style.height = h + 'px';
  });
  ctx.setTransform(ratio,0,0,ratio,0,0);
  octx.setTransform(ratio,0,0,ratio,0,0);
  mctx.setTransform(ratio,0,0,ratio,0,0);
}

function fitToScreen(){
  if (!state.img) return;
  const wrap = canvasWrap.getBoundingClientRect();
  const maxW = Math.max(320, wrap.width - 20);
  const maxH = Math.max(200, wrap.height - 20);
  const scale = Math.min(maxW / state.width, maxH / state.height);
  const w = Math.floor(state.width * scale);
  const h = Math.floor(state.height * scale);
  resizeCanvases(w, h);
  drawImageToCanvas();
}

function actualSize(){
  if (!state.img) return;
  resizeCanvases(state.width, state.height);
  drawImageToCanvas();
}

function drawImageToCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
  mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
  if(!state.img) return;
  // Fit main image to current canvas size
  ctx.drawImage(state.img, 0, 0, state.width, state.height, 0, 0, canvas.width/dpr(), canvas.height/dpr());
}

function snapshotToImage(){
  const off = document.createElement('canvas');
  off.width = Math.max(1, state.width);
  off.height = Math.max(1, state.height);
  off.getContext('2d').drawImage(canvas, 0, 0, canvas.width/dpr(), canvas.height/dpr(), 0, 0, off.width, off.height);
  const img = new Image();
  img.src = off.toDataURL();
  return img;
}

function pushHistory(){
  try{
    const data = ctx.getImageData(0,0,canvas.width/dpr(), canvas.height/dpr());
    state.history.push({ w: canvas.width/dpr(), h: canvas.height/dpr(), data });
    if (state.history.length > state.maxHistory) state.history.shift();
    state.redo = [];
  }catch(e){
    console.warn('History push failed', e);
  }
}

function restoreFromImageData(entry){
  resizeCanvases(entry.w, entry.h);
  ctx.putImageData(entry.data, 0, 0);
  state.width = entry.w;
  state.height = entry.h;
  // Update img as snapshot for consistency
  const img = snapshotToImage();
  state.img = img;
}

function undo(){
  if (state.history.length < 2) return; // keep at least current
  const current = state.history.pop();
  state.redo.push(current);
  const prev = state.history[state.history.length-1];
  restoreFromImageData(prev);
  drawImageToCanvas();
}

function redo(){
  if (state.redo.length === 0) return;
  const entry = state.redo.pop();
  state.history.push(entry);
  restoreFromImageData(entry);
  drawImageToCanvas();
}

// Image load
fileInput.addEventListener('change', async e=>{
  const file = e.target.files[0];
  if(!file) return;
  const img = new Image();
  img.onload = ()=>{
    state.img = img;
    state.width = img.naturalWidth;
    state.height = img.naturalHeight;
    actualSize();
    pushHistory();
    genPresetThumbnails();
    showToast('Image loaded');
  };
  img.src = URL.createObjectURL(file);
});

function loadSample(){
  // Small embedded PNG sample to ensure offline demo
  const sampleDataURI = SAMPLE_BASE64; // from below constant
  const img = new Image();
  img.onload = ()=>{
    state.img = img;
    state.width = img.naturalWidth;
    state.height = img.naturalHeight;
    actualSize();
    pushHistory();
    genPresetThumbnails();
    showToast('Loaded sample image');
  };
  img.src = sampleDataURI;
}

// Worker
function ensureWorker(){
  if (state.worker) return;
  state.worker = new Worker('fx-worker.js');
  state.worker.onmessage = (e)=>{
    state.workerBusy = false;
    showSpinner(false);
    const { type, imageData } = e.data;
    if (type === 'imageData'){
      const w = canvas.width/dpr(), h = canvas.height/dpr();
      ctx.putImageData(new ImageData(imageData.data, w, h), 0, 0);
      const img = snapshotToImage();
      state.img = img;
      pushHistory();
      drawImageToCanvas();
    }
  };
}

// Adjustments preview
function getCanvasImageData(){ return ctx.getImageData(0,0,canvas.width/dpr(), canvas.height/dpr()); }

function runWorkerAdjustments(){
  ensureWorker();
  if (state.workerBusy) return;
  state.workerBusy = true; showSpinner(true);
  const imgData = getCanvasImageData();
  state.worker.postMessage({
    type:'adjust',
    imageData: imgData,
    params: {
      exposure: parseFloat(sExposure.value),
      contrast: parseFloat(sContrast.value),
      saturation: parseFloat(sSaturation.value),
      vibrance: parseFloat(sVibrance.value),
      temperature: parseFloat(sTemp.value),
      tint: parseFloat(sTint.value),
      sharpen: parseFloat(sSharpen.value),
      blur: parseFloat(sBlur.value)
    }
  }, [imgData.data.buffer]);
}

// Handlers for sliders (preview live)
[sExposure, sContrast, sSaturation, sVibrance, sTemp, sTint].forEach(el=>{
  el.addEventListener('input', debounce(runWorkerAdjustments, 80));
});
[sSharpen, sBlur].forEach(el=>{
  el.addEventListener('input', debounce(runWorkerAdjustments, 120));
});
btnAdjApply.addEventListener('click', ()=>{
  pushHistory();
  showToast('Adjustments applied');
});
btnAdjReset.addEventListener('click', ()=>{
  [sExposure, sContrast, sSaturation, sVibrance, sTemp, sTint].forEach(el=>el.value=0);
  drawImageToCanvas();
});

btnSharpBlurApply.addEventListener('click', ()=>{
  pushHistory();
  showToast('Sharpen/Blur applied');
});
btnSharpBlurReset.addEventListener('click', ()=>{
  sSharpen.value = 0; sBlur.value = 0; drawImageToCanvas();
});

// Crop
let cropRect = null, cropDragging = false, cropHandle = null;
function startCrop(){
  if(!state.img) return;
  state.tool = 'crop';
  state.crop.active = true;
  cropRect = { x: 20, y: 20, w: (canvas.width/dpr())-40, h: (canvas.height/dpr())-40 };
  drawCropOverlay();
  overlayCanvas.style.pointerEvents = 'auto';
}
btnCrop.addEventListener('click', startCrop);
btnResize.addEventListener('click', ()=>{
  if(!state.img) return;
  resizeW.value = state.width;
  resizeH.value = state.height;
});
resizeW.addEventListener('input', ()=>{
  if (resizeKeep.checked){
    const ratio = state.height/state.width;
    resizeH.value = Math.round(parseFloat(resizeW.value) * ratio);
  }
});
resizeH.addEventListener('input', ()=>{
  if (resizeKeep.checked){
    const ratio = state.width/state.height;
    resizeW.value = Math.round(parseFloat(resizeH.value) * ratio);
  }
});
btnCropApply.addEventListener('click', ()=>{
  if (state.crop.active && cropRect){
    applyCrop();
  } else if (resizeW.value && resizeH.value){
    applyResize(parseInt(resizeW.value,10), parseInt(resizeH.value,10));
  }
});
btnCropCancel.addEventListener('click', cancelCrop);
function applyResize(w,h){
  w = Math.max(1, Math.floor(w)); h = Math.max(1, Math.floor(h));
  const off = document.createElement('canvas'); off.width = w; off.height = h;
  off.getContext('2d').imageSmoothingEnabled = true;
  off.getContext('2d').imageSmoothingQuality = 'high';
  off.getContext('2d').drawImage(canvas, 0, 0, canvas.width/dpr(), canvas.height/dpr(), 0,0,w,h);
  state.width = w; state.height = h;
  const img = new Image(); img.onload=()=>{ state.img=img; actualSize(); pushHistory(); showToast(`Resized to ${w}×${h}`); };
  img.src = off.toDataURL();
}
function applyCrop(){
  const {x,y,w,h} = cropRect;
  const off = document.createElement('canvas'); off.width = Math.max(1,Math.floor(w)); off.height = Math.max(1,Math.floor(h));
  off.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, off.width, off.height);
  const img = new Image();
  img.onload = ()=>{
    state.img = img; state.width = off.width; state.height = off.height;
    actualSize();
    state.crop.active = false; overlayCanvas.style.pointerEvents='none'; octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
    pushHistory();
    showToast('Cropped');
  };
  img.src = off.toDataURL();
}
function cancelCrop(){
  state.crop.active = false; overlayCanvas.style.pointerEvents='none'; octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
}
function drawCropOverlay(){
  octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
  if (!cropRect) return;
  const {x,y,w,h} = cropRect;
  // darken outside area
  octx.save();
  octx.fillStyle = 'rgba(0,0,0,0.5)';
  octx.fillRect(0,0,overlayCanvas.width/dpr(), overlayCanvas.height/dpr());
  octx.globalCompositeOperation = 'destination-out';
  roundRect(octx, x, y, w, h, 2); octx.fill();
  octx.restore();
  // border
  octx.strokeStyle = '#4cc9f0'; octx.lineWidth = 2; roundRect(octx, x, y, w, h, 2); octx.stroke();

  // handles
  const hs = 8;
  const handles = handlePositions(x,y,w,h);
  octx.fillStyle='#4cc9f0';
  handles.forEach(hp=>octx.fillRect(hp.x-hs/2, hp.y-hs/2, hs, hs));
}
function handlePositions(x,y,w,h){
  return [
    {k:'n', x:x+w/2, y:y},
    {k:'s', x:x+w/2, y:y+h},
    {k:'e', x:x+w, y:y+h/2},
    {k:'w', x:x, y:y+h/2},
    {k:'ne', x:x+w, y:y},
    {k:'nw', x:x, y:y},
    {k:'se', x:x+w, y:y+h},
    {k:'sw', x:x, y:y+h}
  ];
}
function getHandleAt(x,y){
  const hs=10;
  const {x:cx,y:cy,w,h} = cropRect;
  for (const hp of handlePositions(cx,cy,w,h)){
    if (Math.abs(hp.x-x)<=hs && Math.abs(hp.y-y)<=hs) return hp.k;
  }
  return null;
}
// Overlay events
overlayCanvas.addEventListener('mousedown', e=>{
  if (!state.crop.active) return;
  const p = getRelPos(e);
  const h = getHandleAt(p.x, p.y);
  if (h){ cropHandle = h; cropDragging=true; return; }
  // Move crop rect if inside
  if (p.x>=cropRect.x && p.x<=cropRect.x+cropRect.w && p.y>=cropRect.y && p.y<=cropRect.y+cropRect.h){
    cropHandle = 'move'; cropDragging=true; state._dragOffX=p.x-cropRect.x; state._dragOffY=p.y-cropRect.y; return;
  }
});
overlayCanvas.addEventListener('mousemove', e=>{
  if (!state.crop.active || !cropDragging) return;
  const p = getRelPos(e);
  const {x,y,w,h} = cropRect;
  let nx=x, ny=y, nw=w, nh=h;
  const ar = cropAspect.value;
  const keepRatio = ar!=='free';
  const ratioVal = aspectValue(ar, w/h);
  switch(cropHandle){
    case 'move':
      nx = clamp(p.x-state._dragOffX,0,canvas.width/dpr()-w);
      ny = clamp(p.y-state._dragOffY,0,canvas.height/dpr()-h);
      break;
    case 'n':
      nh = clamp(h - (p.y - y), 10, canvas.height/dpr()); ny = y + (h-nh);
      if (keepRatio){ nw = Math.round(nh*ratioVal); nx = clamp(x + (w-nw)/2,0,canvas.width/dpr()-nw); }
      break;
    case 's':
      nh = clamp(p.y - y, 10, canvas.height/dpr()-y);
      if (keepRatio){ nw = Math.round(nh*ratioVal); nx = clamp(x + (w-nw)/2,0,canvas.width/dpr()-nw); }
      break;
    case 'e':
      nw = clamp(p.x - x, 10, canvas.width/dpr()-x);
      if (keepRatio){ nh = Math.round(nw/ratioVal); ny = clamp(y + (h-nh)/2,0,canvas.height/dpr()-nh); }
      break;
    case 'w':
      nw = clamp(w - (p.x - x), 10, canvas.width/dpr()); nx = x + (w-nw);
      if (keepRatio){ nh = Math.round(nw/ratioVal); ny = clamp(y + (h-nh)/2,0,canvas.height/dpr()-nh); }
      break;
    case 'ne':
      nw = clamp(p.x - x, 10, canvas.width/dpr()-x);
      nh = clamp(h - (p.y - y), 10, canvas.height/dpr()); ny = y + (h-nh);
      if (keepRatio){ nh = Math.round(nw/ratioVal); ny = y + (h-nh); }
      break;
    case 'nw':
      nw = clamp(w - (p.x - x), 10, canvas.width/dpr()); nx = x + (w-nw);
      nh = clamp(h - (p.y - y), 10, canvas.height/dpr()); ny = y + (h-nh);
      if (keepRatio){ nh = Math.round(nw/ratioVal); ny = y + (h-nh); }
      break;
    case 'se':
      nw = clamp(p.x - x, 10, canvas.width/dpr()-x);
      nh = clamp(p.y - y, 10, canvas.height/dpr()-y);
      if (keepRatio){ nh = Math.round(nw/ratioVal); }
      break;
    case 'sw':
      nw = clamp(w - (p.x - x), 10, canvas.width/dpr()); nx = x + (w-nw);
      nh = clamp(p.y - y, 10, canvas.height/dpr()-y);
      if (keepRatio){ nh = Math.round(nw/ratioVal); }
      break;
  }
  cropRect = {x:nx,y:ny,w:nw,h:nh};
  drawCropOverlay();
});
window.addEventListener('mouseup', ()=>{ cropDragging=false; cropHandle=null; });
function aspectValue(aspect, fallback){
  if(aspect==='1:1') return 1;
  if(aspect==='4:3') return 4/3;
  if(aspect==='3:2') return 3/2;
  if(aspect==='16:9') return 16/9;
  if(aspect==='A4') return 210/297;
  return fallback||1;
}
function getRelPos(e){
  const r = overlayCanvas.getBoundingClientRect();
  return { x: (e.clientX - r.left), y:(e.clientY - r.top) };
}
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

// Rotate
btnRotateLeft.addEventListener('click', ()=>{ rotateSlider.value = (parseFloat(rotateSlider.value)-90); });
btnRotateRight.addEventListener('click', ()=>{ rotateSlider.value = (parseFloat(rotateSlider.value)+90); });
btnRotateApply.addEventListener('click', ()=>{
  if(!state.img) return;
  const deg = parseFloat(rotateSlider.value)||0;
  applyRotate(deg, chkAutoCrop.checked, chkTransparentRotate.checked);
  rotateSlider.value = 0;
});
function applyRotate(deg, autoCrop=true, useAlpha=true){
  const rad = deg*Math.PI/180;
  const srcW = canvas.width/dpr(), srcH = canvas.height/dpr();
  const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
  const boundW = Math.floor(srcW*cos + srcH*sin);
  const boundH = Math.floor(srcW*sin + srcH*cos);
  const off = document.createElement('canvas');
  off.width = boundW; off.height = boundH;
  const c = off.getContext('2d');
  c.save();
  c.translate(boundW/2, boundH/2);
  c.rotate(rad);
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  if (!useAlpha){ c.fillStyle='#000'; c.fillRect(-boundW/2,-boundH/2,boundW,boundH); }
  c.drawImage(canvas, -srcW/2, -srcH/2, srcW, srcH);
  c.restore();

  let final = off;
  if (autoCrop){
    // compute largest rect without black triangles (approximate)
    const w = srcW, h = srcH;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    const cropW = Math.floor(w*absCos + h*absSin - 2);
    const cropH = Math.floor(w*absSin + h*absCos - 2);
    const cx = Math.floor((boundW - cropW)/2);
    const cy = Math.floor((boundH - cropH)/2);
    const off2 = document.createElement('canvas'); off2.width=cropW; off2.height=cropH;
    off2.getContext('2d').drawImage(off, cx, cy, cropW, cropH, 0, 0, cropW, cropH);
    final = off2;
  }

  const img = new Image();
  img.onload = ()=>{
    state.img = img; state.width = final.width; state.height = final.height;
    actualSize(); pushHistory(); showToast(`Rotated ${deg.toFixed(1)}°`);
  };
  img.src = final.toDataURL();
}

// Presets
const PRESETS = [
  { id:'bw', name:'B&W', fn:(p)=>({sat:-1, con:0.2}) },
  { id:'sepia', name:'Sepia', fn:(p)=>({sepia:1}) },
  { id:'vintage', name:'Vintage', fn:(p)=>({sat:-0.3, temp:0.2, tint:0.05, con:-0.1, grain:0.08}) },
  { id:'cinema', name:'Cinematic', fn:(p)=>({con:0.15, sat:0.1, tint:-0.05, temp:-0.1, vib:0.2}) },
  { id:'hi-contrast', name:'High Contrast', fn:(p)=>({con:0.35, sat:0.05, exp:0.05}) },
  { id:'film', name:'Film', fn:(p)=>({sat:-0.1, tint:0.1, grain:0.12}) },
  { id:'portrait', name:'Portrait Soft', fn:(p)=>({blur:1.0, sat:0.05, vib:0.15}) },
  { id:'cool', name:'Cool Blue', fn:(p)=>({temp:-0.25, con:0.05, vib:0.1}) },
];

function genPresetThumbnails(){
  presetStrip.innerHTML = '';
  if (!state.img) return;
  PRESETS.forEach(p=>{
    const item = document.createElement('div');
    item.className = 'preset'; item.setAttribute('role','button');
    const pc = document.createElement('canvas'); const pw=140, ph=90; pc.width=pw; pc.height=ph;
    const pctx = pc.getContext('2d');
    // draw small image
    pctx.drawImage(state.img, 0, 0, state.width, state.height, 0, 0, pw, ph);
    // apply preset preview (fast approximations)
    applyPresetToContext(pctx, pw, ph, p.fn({}));
    const name = document.createElement('div'); name.className='name'; name.textContent=p.name;
    item.appendChild(pc); item.appendChild(name);
    item.addEventListener('click', ()=>{
      document.querySelectorAll('.preset').forEach(n=>n.classList.remove('selected'));
      item.classList.add('selected');
      state.presetSelected = p;
    });
    presetStrip.appendChild(item);
  });
}

function applyPresetToContext(pctx, w, h, params){
  const imgData = pctx.getImageData(0,0,w,h);
  const data = imgData.data;
  const sat = params.sat||0, con=params.con||0, exp=params.exp||0, vib=params.vib||0, temp=params.temp||0, tint=params.tint||0;
  const sepia = params.sepia||0, grain = params.grain||0, blur = params.blur||0;

  // basic color pipeline
  for(let i=0;i<data.length;i+=4){
    let r=data[i], g=data[i+1], b=data[i+2];

    // exposure
    r*= Math.pow(2, exp); g*= Math.pow(2, exp); b*= Math.pow(2, exp);

    // temperature/tint (approximate)
    r *= (1 + temp*0.5 + tint*0.2);
    g *= (1 - tint*0.2);
    b *= (1 - temp*0.5 + tint*0.2);

    // vibrance/saturation (simple)
    const avg = (r+g+b)/3;
    const mx = Math.max(r,g,b);
    const amt = (1 - (mx/255)) * (vib*0.8 + sat);
    r += (r-avg)*amt; g += (g-avg)*amt; b += (b-avg)*amt;

    // contrast
    const c = (1+con);
    r = (r-128)*c + 128; g=(g-128)*c + 128; b=(b-128)*c + 128;

    // sepia
    if (sepia){
      const nr = (r*0.393 + g*0.769 + b*0.189);
      const ng = (r*0.349 + g*0.686 + b*0.168);
      const nb = (r*0.272 + g*0.534 + b*0.131);
      r=nr; g=ng; b=nb;
    }

    data[i]=clamp(Math.round(r),0,255);
    data[i+1]=clamp(Math.round(g),0,255);
    data[i+2]=clamp(Math.round(b),0,255);
  }
  pctx.putImageData(imgData,0,0);

  // blur (portrait soft) — quick canvas filter for preview only
  if (blur>0){
    pctx.filter = `blur(${blur}px)`; const tmp = document.createElement('canvas'); tmp.width=w; tmp.height=h;
    tmp.getContext('2d').drawImage(pctx.canvas, 0,0);
    pctx.clearRect(0,0,w,h); pctx.drawImage(tmp,0,0);
    pctx.filter='none';
  }
  // grain overlay
  if (grain>0){
    const gctx = pctx;
    const imgData2 = gctx.getImageData(0,0,w,h);
    const d2 = imgData2.data;
    for(let i=0;i<d2.length;i+=4){
      const n = (Math.random()-0.5)*255*grain;
      d2[i]+=n; d2[i+1]+=n; d2[i+2]+=n;
    }
    gctx.putImageData(imgData2,0,0);
  }
}

btnApplyPreset.addEventListener('click', ()=>{
  if (!state.presetSelected) return;
  ensureWorker();
  // Merge preset params into current controls and run worker pipeline
  const params = state.presetSelected.fn({});
  if (params.sat!==undefined) sSaturation.value = params.sat;
  if (params.con!==undefined) sContrast.value = params.con;
  if (params.exp!==undefined) sExposure.value = params.exp;
  if (params.vib!==undefined) sVibrance.value = params.vib;
  if (params.temp!==undefined) sTemp.value = params.temp;
  if (params.tint!==undefined) sTint.value = params.tint;
  if (params.blur!==undefined) sBlur.value = params.blur;
  runWorkerAdjustments();
  showToast(`Preset: ${state.presetSelected.name}`);
});
btnResetPreset.addEventListener('click', ()=>{
  state.presetSelected=null;
  drawImageToCanvas();
});

// Background removal — OpenCV
async function ensureOpenCV(){
  if (state.lightweight){ showToast('Lightweight mode: CV features disabled'); return false; }
  if (state.opencvReady) return true;
  cvStatusEl.textContent = 'CV: loading…';
  const loaded = await loadOpenCVScript();
  if (loaded){
    cvStatusEl.textContent = 'CV: ready';
    cvStatusEl.style.background = '#143';
    state.opencvReady = true;
    return true;
  } else {
    cvStatusEl.textContent = 'CV: failed';
    return false;
  }
}
function loadScript(src){
  return new Promise((res, rej)=>{
    const s = document.createElement('script'); s.src = src; s.async = true;
    s.onload = ()=>res(true); s.onerror=()=>rej(false);
    document.body.appendChild(s);
  });
}
async function loadOpenCVScript(){
  try{
    // try local vendor path first
    await loadScript('vendor/opencv/opencv.js');
  }catch(e){
    try{
      await loadScript('https://cdn.jsdelivr.net/npm/opencv.js@4.10.0/opencv.js');
    }catch(e2){
      console.error('OpenCV failed to load.', e2);
      return false;
    }
  }
  return new Promise((resolve)=>{
    if (cv && cv.Mat) resolve(true);
    else {
      const timer = setInterval(()=>{
        if (window.cv && cv.Mat){
          clearInterval(timer); resolve(true);
        }
      }, 100);
      setTimeout(()=>{ clearInterval(timer); resolve(!!(window.cv && cv.Mat)); }, 8000);
    }
  });
}

// Background removal UI flows
btnBgAuto.addEventListener('click', async ()=>{
  if (!await ensureOpenCV()) return;
  const ok = await bgAutoGrabCutRect();
  if (ok) showToast('Auto background mask generated. Use Refine Brush if needed.');
});

btnBgFGRect.addEventListener('click', ()=>{
  if (!state.img){ showToast('Load image first'); return; }
  state.bg.mode='fgrect';
  overlayCanvas.style.pointerEvents='auto';
  startRectSelection('fgrect', (rect)=>{
    bgGrabCutWithRect(rect);
  });
});

btnBgColorPick.addEventListener('click', ()=>{
  if (!state.img){ showToast('Load image first'); return; }
  state.bg.colorPick = true;
  overlayCanvas.style.pointerEvents='auto';
  showToast('Click on the background color to sample');
});

btnBgRefine.addEventListener('click', ()=>{
  if (!state.img){ showToast('Load image first'); return; }
  state.bg.mode='refine';
  enableMaskBrush('bg');
  showToast('Refine: paint white to keep foreground, black to remove background. Toggle with right-click.');
});

bgUpload.addEventListener('change', e=>{
  const f = e.target.files[0]; if(!f) return;
  const img = new Image(); img.onload=()=>{ state.bg.selectedBG = img; showToast('New background selected'); };
  img.src = URL.createObjectURL(f);
});

btnBgApplyTransparent.addEventListener('click', ()=>{
  applyBackgroundMask(true);
});
btnBgReplace.addEventListener('click', ()=>{
  applyBackgroundMask(false);
});

async function bgAutoGrabCutRect(){
  if (!await ensureOpenCV()) return false;
  // create a central rectangle for foreground
  const w = canvas.width/dpr(), h = canvas.height/dpr();
  const rect = { x: Math.floor(w*0.1), y: Math.floor(h*0.1), w: Math.floor(w*0.8), h: Math.floor(h*0.8) };
  return bgGrabCutWithRect(rect);
}
async function bgGrabCutWithRect(rect){
  if (!await ensureOpenCV()) return false;
  showSpinner(true);
  await sleep(10);
  const src = cv.imread(canvas);
  const mask = new cv.Mat();
  const bgdModel = new cv.Mat(); const fgdModel = new cv.Mat();
  const r = new cv.Rect(rect.x, rect.y, rect.w, rect.h);
  cv.grabCut(src, mask, r, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT);
  // Convert to binary mask: probable/definite foreground -> 255
  for (let i = 0; i < mask.rows; i++) {
    for (let j = 0; j < mask.cols; j++) {
      const v = mask.ucharPtr(i, j)[0];
      mask.ucharPtr(i, j)[0] = (v===cv.GC_FGD || v===cv.GC_PR_FGD) ? 255 : 0;
    }
  }
  // Smooth edges
  const kernel = cv.Mat.ones(3,3,cv.CV_8U);
  cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel);
  cv.GaussianBlur(mask, mask, new cv.Size(5,5), 0);
  // draw to maskCanvas (white=fg, black=bg)
  mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
  const maskDst = new cv.Mat();
  cv.cvtColor(mask, maskDst, cv.COLOR_GRAY2RGBA);
  cv.imshow(maskCanvas, maskDst);
  src.delete(); mask.delete(); bgdModel.delete(); fgdModel.delete(); kernel.delete(); maskDst.delete();
  overlayCanvas.style.pointerEvents = 'none';
  showSpinner(false);
  return true;
}

function enableMaskBrush(mode){
  maskCanvas.style.pointerEvents='auto';
  maskCanvas.addEventListener('mousedown', onMaskBrushDown);
  maskCanvas.addEventListener('mousemove', onMaskBrushMove);
  window.addEventListener('mouseup', onMaskBrushUp);
  state.bg.mode = mode;
  state.bg.brushMode = 'add';
}

function disableMaskBrush(){
  maskCanvas.style.pointerEvents='none';
  maskCanvas.removeEventListener('mousedown', onMaskBrushDown);
  maskCanvas.removeEventListener('mousemove', onMaskBrushMove);
  window.removeEventListener('mouseup', onMaskBrushUp);
}

let brushing = false;
function onMaskBrushDown(e){
  brushing = true; drawBrush(e);
}
function onMaskBrushMove(e){
  if (!brushing) return;
  drawBrush(e);
}
function onMaskBrushUp(){
  brushing = false;
}
maskCanvas.addEventListener('contextmenu', e=>{ e.preventDefault(); toggleBrushMode(); });
function toggleBrushMode(){
  if (state.bg.mode==='refine'){
    state.bg.brushMode = (state.bg.brushMode==='add')?'subtract':'add';
    showToast('Brush: ' + (state.bg.brushMode==='add'?'Add FG (white)':'Remove BG (black)'));
  } else if (state.obj.brushing){
    state.obj.brushMode = (state.obj.brushMode==='add')?'erase':'add';
    showToast('Object mask brush: ' + (state.obj.brushMode==='add'?'Paint mask':'Erase mask'));
  }
}
function drawBrush(e){
  const r = maskCanvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const size = state.bg.mode==='refine' ? parseInt(bgBrushSize.value,10) : parseInt(objBrushSize.value,10);
  const soft = state.bg.mode==='refine' ? parseFloat(bgBrushSoft.value) : parseFloat(objBrushSoft.value);
  const add = (state.bg.mode==='refine') ? (state.bg.brushMode==='add') : (state.obj.brushMode!=='erase');
  const grad = mctx.createRadialGradient(x,y,0, x,y,size/2);
  const color = add ? '255,255,255' : '0,0,0';
  grad.addColorStop(0, `rgba(${color},1)`);
  grad.addColorStop(clamp(1-soft,0,1), `rgba(${color},1)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  mctx.globalCompositeOperation = 'source-over';
  mctx.fillStyle = grad;
  mctx.beginPath(); mctx.arc(x,y,size/2,0,Math.PI*2); mctx.fill();
}

overlayCanvas.addEventListener('click', (e)=>{
  if (state.bg.colorPick){
    const p = getRelPos(e);
    const imgData = ctx.getImageData(p.x, p.y, 1, 1).data;
    // create mask by color distance threshold
    const w = canvas.width/dpr(), h = canvas.height/dpr();
    const src = ctx.getImageData(0,0,w,h);
    const dst = mctx.createImageData(w,h);
    for (let i=0;i<src.data.length;i+=4){
      const r = src.data[i], g = src.data[i+1], b = src.data[i+2];
      const dist = Math.sqrt((r-imgData[0])**2 + (g-imgData[1])**2 + (b-imgData[2])**2);
      const v = (dist < 40) ? 0 : 255; // threshold
      dst.data[i]=dst.data[i+1]=dst.data[i+2]=v; dst.data[i+3]=255;
    }
    mctx.putImageData(dst,0,0);
    state.bg.colorPick=false;
    overlayCanvas.style.pointerEvents='none';
    showToast('Color-picked background mask created. Refine if needed.');
  }
});

// Apply mask to transparency or replace background
function applyBackgroundMask(transparent=true){
  if (!state.img) return;
  const w = canvas.width/dpr(), h = canvas.height/dpr();
  const off = document.createElement('canvas'); off.width=w; off.height=h;
  const oc = off.getContext('2d');
  oc.clearRect(0,0,w,h);
  // compose alpha from maskCanvas brightness (white=FG -> alpha)
  const base = ctx.getImageData(0,0,w,h);
  const mask = mctx.getImageData(0,0,w,h);
  const out = oc.createImageData(w,h);
  for (let i=0;i<base.data.length;i+=4){
    const a = mask.data[i]; // 0-255
    if (transparent){
      out.data[i]=base.data[i];
      out.data[i+1]=base.data[i+1];
      out.data[i+2]=base.data[i+2];
      out.data[i+3]=a;
    } else {
      // composite over chosen bg
      const fgA = a/255;
      const bgCol = hexToRgb(bgColor.value);
      const bgR = state.bg.selectedBG ? -1 : bgCol.r;
      if (state.bg.selectedBG){
        // draw background image first
      }
      const fr = base.data[i], fg = base.data[i+1], fb = base.data[i+2];
      const br = bgR>=0?bgR:0, bg_ = bgR>=0?bgCol.g:0, bb = bgR>=0?bgCol.b:0;
      out.data[i]  = Math.round(fr*fgA + br*(1-fgA));
      out.data[i+1]= Math.round(fg*fgA + bg_*(1-fgA));
      out.data[i+2]= Math.round(fb*fgA + bb*(1-fgA));
      out.data[i+3]= 255;
    }
  }
  oc.putImageData(out,0,0);

  // If image bg provided: draw it beneath by separate pass
  if (!transparent && state.bg.selectedBG){
    const out2 = document.createElement('canvas'); out2.width=w; out2.height=h;
    const c2 = out2.getContext('2d');
    c2.drawImage(state.bg.selectedBG, 0,0, state.bg.selectedBG.naturalWidth, state.bg.selectedBG.naturalHeight, 0,0,w,h);
    c2.drawImage(off, 0,0);
    finalizeCanvas(out2);
  } else {
    finalizeCanvas(off);
  }
  showToast(transparent?'Applied transparent background':'Background replaced');
}
function finalizeCanvas(off){
  const img = new Image();
  img.onload = ()=>{ state.img=img; state.width=off.width; state.height=off.height; actualSize(); pushHistory(); };
  img.src = off.toDataURL();
}
function hexToRgb(hex){
  const v = hex.replace('#','');
  const bigint = parseInt(v,16);
  return { r: (bigint>>16)&255, g:(bigint>>8)&255, b:bigint&255 };
}

// Object removal (content-aware fill via inpainting)
btnObjectBrush.addEventListener('click', ()=>{
  state.obj.brushing = true;
  state.obj.brushMode = 'add';
  enableObjectMaskBrush();
  showToast('Paint over objects to remove (right-click to erase).');
});
btnObjectClear.addEventListener('click', ()=>{
  mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
});
btnInpaintPreview.addEventListener('click', async ()=>{
  await runInpaint(true);
});
btnInpaintApply.addEventListener('click', async ()=>{
  await runInpaint(false);
});

function enableObjectMaskBrush(){
  maskCanvas.style.pointerEvents='auto';
  maskCanvas.addEventListener('mousedown', onObjBrushDown);
  maskCanvas.addEventListener('mousemove', onObjBrushMove);
  window.addEventListener('mouseup', onObjBrushUp);
}
function disableObjectMaskBrush(){
  maskCanvas.style.pointerEvents='none';
  maskCanvas.removeEventListener('mousedown', onObjBrushDown);
  maskCanvas.removeEventListener('mousemove', onObjBrushMove);
  window.removeEventListener('mouseup', onObjBrushUp);
}
let objBrushing=false;
function onObjBrushDown(e){ state.obj.brushMode = state.obj.brushMode || 'add'; objBrushing=true; drawBrush(e); }
function onObjBrushMove(e){ if (!objBrushing) return; drawBrush(e); }
function onObjBrushUp(){ objBrushing=false; }
maskCanvas.addEventListener('mouseleave', ()=>{ objBrushing=false; });

async function runInpaint(preview=true){
  if (!await ensureOpenCV()) return;
  const w = canvas.width/dpr(), h = canvas.height/dpr();
  if (w<1 || h<1) return;
  showSpinner(true); await sleep(10);
  const src = cv.imread(canvas);
  const mask = cv.imread(maskCanvas);
  const maskG = new cv.Mat();
  cv.cvtColor(mask, maskG, cv.COLOR_RGBA2GRAY);
  cv.threshold(maskG, maskG, 10, 255, cv.THRESH_BINARY);
  const dst = new cv.Mat();
  cv.inpaint(src, maskG, dst, 3, cv.INPAINT_TELEA); // Telea inpainting
  if (preview){
    cv.imshow(overlayCanvas, dst);
    overlayCanvas.style.pointerEvents='none';
    setTimeout(()=>{ overlayCanvas.getContext('2d').clearRect(0,0,overlayCanvas.width,overlayCanvas.height); }, 1500);
  }else{
    const out = document.createElement('canvas'); out.width=w; out.height=h;
    cv.imshow(out, dst);
    finalizeCanvas(out);
    mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
  }
  src.delete(); mask.delete(); maskG.delete(); dst.delete();
  showSpinner(false);
  showToast(preview?'Previewed inpaint':'Inpaint applied');
}

// Extend canvas (experimental content-aware fill)
btnExtendPreview.addEventListener('click', ()=>{
  const preview = extendCanvas(true);
  if (preview) overlayCanvas.getContext('2d').drawImage(preview,0,0);
});
btnExtendApply.addEventListener('click', ()=>{
  const out = extendCanvas(false);
  if (out) finalizeCanvas(out);
});
function extendCanvas(preview=false){
  const t = parseInt(extTop.value,10)||0, r = parseInt(extRight.value,10)||0, b = parseInt(extBottom.value,10)||0, l = parseInt(extLeft.value,10)||0;
  if (t+r+b+l===0){ showToast('Nothing to extend'); return null; }
  const w = canvas.width/dpr(), h = canvas.height/dpr();
  const nw = w + l + r, nh = h + t + b;
  const out = document.createElement('canvas'); out.width=nw; out.height=nh;
  const c = out.getContext('2d'); c.clearRect(0,0,nw,nh);
  c.drawImage(canvas, 0, 0, w, h, l, t, w, h);
  // Content-aware fill edges (simple grow/blur method for textures)
  // Fill top band
  fillBand(c, out, l, 0, w, t, l, t, 'top');
  // right
  fillBand(c, out, l+w, t, r, h, l+w-1, t, 'right');
  // bottom
  fillBand(c, out, l, t+h, w, b, l, t+h-1, 'bottom');
  // left
  fillBand(c, out, 0, t, l, h, l, t, 'left');
  // corner blending
  c.filter='blur(2px)'; c.drawImage(out,0,0); c.filter='none';

  if (preview) return out;
  showToast('Extended (experimental)');
  return out;
}
function fillBand(ctx, canvasEl, x, y, w, h, srcX, srcY, side){
  if (w<=0||h<=0) return;
  const srcCtx = document.createElement('canvas').getContext('2d');
  srcCtx.canvas.width = canvas.width/dpr(); srcCtx.canvas.height = canvas.height/dpr();
  srcCtx.drawImage(canvas,0,0,canvas.width/dpr(), canvas.height/dpr());
  const samples = srcCtx.getImageData(0,0,srcCtx.canvas.width,srcCtx.canvas.height);
  const dst = ctx.getImageData(x,y,w,h);
  for (let j=0;j<h;j++){
    for (let i=0;i<w;i++){
      let bx=srcX, by=srcY;
      if (side==='top'){ bx = srcX + i%Math.max(1,Math.min(20, w)); by = srcY + (j%3); }
      if (side==='right'){ bx = srcX; by = srcY + j%Math.max(1,Math.min(20,h)); }
      if (side==='bottom'){ bx = srcX + i%Math.max(1,Math.min(20, w)); by = srcY; }
      if (side==='left'){ bx = srcX; by = srcY + j%Math.max(1,Math.min(20,h)); }
      const si = ((by)*samples.width + (bx)) * 4;
      const di = (j*w + i)*4;
      dst.data[di] = samples.data[si];
      dst.data[di+1] = samples.data[si+1];
      dst.data[di+2] = samples.data[si+2];
      dst.data[di+3] = 255;
    }
  }
  ctx.putImageData(dst, x, y);
  // soften seam
  ctx.save(); ctx.globalAlpha=0.5; ctx.filter='blur(3px)';
  ctx.drawImage(canvasEl, x-1,y-1,w+2,h+2, x-1,y-1,w+2,h+2);
  ctx.restore();
}

// Smart Enhance
btnEnhance.addEventListener('click', async ()=>{
  if (!state.img) return;
  const up = parseInt(selUpscale.value,10);
  const doDenoise = chkDenoise.checked;
  const doUnsharp = chkUnsharp.checked;
  showSpinner(true); await sleep(10);

  let w = canvas.width/dpr(), h = canvas.height/dpr();
  if (up>1){
    // Lanczos via OpenCV if available; fallback to canvas high-quality
    let off = document.createElement('canvas'); off.width=w*up; off.height=h*up;
    const c = off.getContext('2d'); c.imageSmoothingEnabled=true; c.imageSmoothingQuality='high';
    c.drawImage(canvas, 0,0,w,h, 0,0, off.width, off.height);
    if (await ensureOpenCV()){
      const src = cv.imread(canvas);
      const dst = new cv.Mat(); const dsize = new cv.Size(w*up, h*up);
      cv.resize(src, dst, dsize, 0,0, cv.INTER_LANCZOS4);
      const out = document.createElement('canvas'); out.width=w*up; out.height=h*up;
      cv.imshow(out, dst);
      off = out;
      src.delete(); dst.delete();
    }
    finalizeCanvas(off);
    w*=up; h*=up;
  }

  if (doDenoise && await ensureOpenCV()){
    const src = cv.imread(canvas); const dst = new cv.Mat();
    cv.bilateralFilter(src, dst, 7, 25, 25);
    const out = document.createElement('canvas'); out.width=w; out.height=h; cv.imshow(out, dst);
    finalizeCanvas(out);
    src.delete(); dst.delete();
  }

  if (doUnsharp){
    ensureWorker();
    const imgData = getCanvasImageData();
    state.workerBusy = true;
    state.worker.postMessage({ type:'unsharp', imageData: imgData, amount: 0.6, radius: 1.0 }, [imgData.data.buffer]);
    await waitWorker();
  }

  showSpinner(false);
  showToast('Smart Enhance complete');
});

function waitWorker(){ return new Promise(res=>{ const t=setInterval(()=>{ if(!state.workerBusy){ clearInterval(t); res(); }}, 50); }); }

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

// Prompt Helper
btnUsePrompt.addEventListener('click', ()=>{
  const text = (promptInput.value||'').toLowerCase();
  const plan = [];
  if (/replace.*city.*beach|beach.*golden/.test(text)){
    plan.push('Suggest: Background removal → apply transparent → set new background (beach) → warm (Temp +0.3), Vibrance +0.2.');
  }
  if (/erase|remove.*phone|object/.test(text)){
    plan.push('Suggest: Object removal → paint mask over object → Inpaint Apply.');
  }
  if (/misty|diffused|soft.*light|morning/.test(text)){
    plan.push('Suggest: Temp -0.1, Tint +0.05, Contrast -0.1, Saturation -0.1, Vibrance +0.15; add slight blur (0.6px).');
  }
  if (/sepia|faded|old.*photograph|grainy|vintage/.test(text)){
    plan.push('Suggest: Apply Preset "Vintage" or "Sepia", add grain 0.1, Contrast -0.05.');
  }
  if (/cinema|teal|orange|film/.test(text)){
    plan.push('Suggest: Preset "Cinematic", Contrast +0.15, Vibrance +0.2.');
  }
  if (plan.length===0){
    plan.push('No strong keywords detected. You can still use tools: Background, Object Removal, Adjustments, Filters.');
  }
  promptPlan.innerHTML = `<strong>Plan</strong><ul>${plan.map(p=>`<li>${p}</li>`).join('')}</ul><button id="btnApplyPlan" class="primary">Apply suggestions</button>`;
  document.getElementById('btnApplyPlan').addEventListener('click', ()=>{
    // automatically nudge sliders based on plan keywords
    if (plan.join(' ').includes('warm')) sTemp.value = (parseFloat(sTemp.value)+0.3).toFixed(2);
    if (plan.join(' ').includes('vibrance')) sVibrance.value = (parseFloat(sVibrance.value)+0.2).toFixed(2);
    if (plan.join(' ').includes('sepia')) { sSaturation.value = (parseFloat(sSaturation.value)-0.3).toFixed(2); }
    runWorkerAdjustments();
    showToast('Suggestions applied (sliders/preset). For BG/Object tools, open their panels.');
  });
});

// Export
btnSave.addEventListener('click', ()=>{ exportModal.showModal(); });
btnExportCancel.addEventListener('click', ()=>exportModal.close());
expFormat.addEventListener('change', ()=>{
  expQualityRow.style.display = (expFormat.value==='jpeg')?'block':'none';
});
btnDoExport.addEventListener('click', ()=>{
  // compute export
  const mode = expSize.value;
  let targetW = canvas.width/dpr(), targetH = canvas.height/dpr();
  const maxs = { 'fit-1080':1080, 'fit-1440':1440, 'fit-2160':2160 };
  if (mode!=='current'){
    const max = maxs[mode];
    const s = Math.min(max/targetH, max/targetW);
    if (s<1){ targetW = Math.round(targetW*s); targetH = Math.round(targetH*s); }
  }
  const out = document.createElement('canvas'); out.width=targetW; out.height=targetH;
  const c = out.getContext('2d'); c.imageSmoothingEnabled=true; c.imageSmoothingQuality='high';
  c.drawImage(canvas, 0,0, canvas.width/dpr(), canvas.height/dpr(), 0,0, targetW, targetH);
  const fmt = expFormat.value==='png'?'image/png':'image/jpeg';
  const q = parseFloat(expQuality.value)||0.92;
  out.toBlob((blob)=>{
    const a = document.createElement('a');
    const ext = expFormat.value==='png'?'png':'jpg';
    a.download = `lenspoet-${Date.now()}.${ext}`;
    a.href = URL.createObjectURL(blob);
    a.click();
    exportModal.close();
  }, fmt, q);
});

// Fit/Actual
btnFit.addEventListener('click', fitToScreen);
btnActual.addEventListener('click', actualSize);

// Reset/Session
btnResetAll.addEventListener('click', ()=>{
  if (!state.img) return;
  const img = state.img;
  state.history = [];
  resizeCanvases(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img,0,0, canvas.width/dpr(), canvas.height/dpr());
  state.width = img.naturalWidth; state.height = img.naturalHeight;
  pushHistory();
  [sExposure, sContrast, sSaturation, sVibrance, sTemp, sTint].forEach(el=>el.value=0);
  sSharpen.value=0; sBlur.value=0;
  mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
  octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
  showToast('Reset all edits');
});
chkAutosave.addEventListener('change', ()=>{ state.autosave = chkAutosave.checked; if (state.autosave) saveSession(); });

btnSaveSession.addEventListener('click', saveSession);
function saveSession(){
  try{
    const dataURL = canvas.toDataURL('image/png');
    const session = {
      time: Date.now(),
      image: dataURL,
      adjustments: {
        exposure:sExposure.value, contrast:sContrast.value, saturation:sSaturation.value,
        vibrance:sVibrance.value, temperature:sTemp.value, tint:sTint.value
      },
      sharpen: sSharpen.value, blur: sBlur.value
    };
    localStorage.setItem('lenspoet_session', JSON.stringify(session));
    showToast('Session saved locally');
  }catch(e){
    console.warn('Session not saved', e); showToast('Session save failed');
  }
}
function loadSession(){
  const s = localStorage.getItem('lenspoet_session');
  if(!s) return false;
  try{
    const session = JSON.parse(s);
    const img = new Image();
    img.onload = ()=>{
      state.img=img; state.width=img.naturalWidth; state.height=img.naturalHeight;
      actualSize(); pushHistory();
      sExposure.value = session.adjustments.exposure;
      sContrast.value = session.adjustments.contrast;
      sSaturation.value = session.adjustments.saturation;
      sVibrance.value = session.adjustments.vibrance;
      sTemp.value = session.adjustments.temperature;
      sTint.value = session.adjustments.tint;
      sSharpen.value = session.sharpen; sBlur.value = session.blur;
      runWorkerAdjustments();
      showToast('Resumed session');
    };
    img.src = session.image;
    return true;
  }catch(e){return false;}
}

// Keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  if (e.key==='c' || e.key==='C'){ startCrop(); }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase()==='z'){ e.preventDefault(); undo(); }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase()==='z'){ e.preventDefault(); redo(); }
  if (e.key==='Enter'){ if (state.tool==='crop') applyCrop(); }
  if (e.key==='Escape'){ cancelCrop(); }
  if (e.key.toLowerCase()==='s'){ e.preventDefault(); exportModal.showModal(); }
});

btnUndo.addEventListener('click', undo);
btnRedo.addEventListener('click', redo);

// Help modal
btnHelp.addEventListener('click', ()=>helpModal.showModal());
btnHelpClose.addEventListener('click', ()=>helpModal.close());
btnOpenSamples.addEventListener('click', ()=>{ helpModal.close(); loadSample(); });

// Lightweight toggle
toggleLightweight.addEventListener('change', ()=>{
  state.lightweight = toggleLightweight.checked;
  cvStatusEl.textContent = state.lightweight ? 'CV: off' : 'CV: not loaded';
});

// Utility: debounce
function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; }

// On load
window.addEventListener('load', ()=>{
  // initial sizes
  resizeCanvases(960, 540);
  if (!loadSession()){
    loadSample();
  }
});

// Export helpers to global (optional, for debugging)
window.__lenspoet = { state, undo, redo, applyRotate };

// Mouse helpers for overlay (rect selection)
function startRectSelection(kind, onDone){
  // Let user draw rect on overlay
  let start=null;
  overlayCanvas.style.pointerEvents='auto';
  function down(e){ start=getRelPos(e); }
  function move(e){
    if(!start) return;
    const p = getRelPos(e);
    const x = Math.min(start.x, p.x), y = Math.min(start.y, p.y);
    const w = Math.abs(start.x - p.x), h = Math.abs(start.y - p.y);
    octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
    octx.strokeStyle = '#06d6a0'; octx.lineWidth=2; octx.strokeRect(x,y,w,h);
  }
  function up(e){
    const p = getRelPos(e);
    const rect = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(start.x - p.x), h: Math.abs(start.y - p.y) };
    overlayCanvas.removeEventListener('mousedown', down);
    overlayCanvas.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', up);
    octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height);
    overlayCanvas.style.pointerEvents='none';
    onDone(rect);
  }
  overlayCanvas.addEventListener('mousedown', down);
  overlayCanvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
}

// Sample image (tiny dataURI)
const SAMPLE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAEACAYAAABo1m9/AAABtUlEQVR4nO3SQQEAAAjAMM4f9E6QdYwM1e3uYbjsAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8EwLNu4gH8cFbqH3tpJ9w1VJq2v3eP3vP5w8H9kAAMi9gTt8hKc7cP8M0l7g3g8jC8cEAABgk3wKJfL0c49GxC2WzvFq8Xy6qY2zY9+q3w9eYQAAqJ2AqW5Z2GmQ5m7q7lXq6T9c7+H3X8QAAQH7gH7s6b5vGJk2h1Y/5WZVk9nq0cO9T3gQAAqB3AVF2P9xR8oM9h8V2Q8Y8t+N2oQAAaCcgK9r0k3G7qHk1i2m3cJ2oSAAAoG2Bg7bW6k7oP0VZ1T6r9x8f9XAAAwM8Cdl7Pj2S8JX2q4r4u8i/5gAAKDJgKzZ9Z5w9N7Z8b7d6f3b8vQIAAKiHQCtXz6vPq2dJr6+Wf5v2e9EAAKhsQP8z7wAAAPBh3uMKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIz+AKqHfpykE7vTAAAAAElFTkSuQmCC";