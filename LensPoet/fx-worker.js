/* Web Worker for color adjustments and filters
   Implements exposure/contrast/saturation/vibrance/temp/tint + blur + unsharp
*/

self.onmessage = (e)=>{
  const { type } = e.data;
  if (type==='adjust'){
    const { imageData, params } = e.data;
    const out = adjustPipeline(imageData, params);
    postMessage({ type:'imageData', imageData: out }, [out.data.buffer]);
  } else if (type==='unsharp'){
    const { imageData, amount=0.6, radius=1.0 } = e.data;
    const out = unsharpMask(imageData, amount, radius);
    postMessage({ type:'imageData', imageData: out }, [out.data.buffer]);
  }
};

function adjustPipeline(img, p){
  const data = img.data;
  const exposure = +p.exposure||0;
  const contrast = +p.contrast||0;
  const saturation = +p.saturation||0;
  const vibrance = +p.vibrance||0;
  const temperature = +p.temperature||0;
  const tint = +p.tint||0;
  const blur = +p.blur||0;
  const sharpen = +p.sharpen||0;

  // copy to work buffer
  let w = img.width, h = img.height;

  // exposure/contrast/saturation/vibrance/temp/tint
  for(let i=0;i<data.length;i+=4){
    let r=data[i], g=data[i+1], b=data[i+2];
    // exposure
    const expMul = Math.pow(2, exposure);
    r*=expMul; g*=expMul; b*=expMul;
    // temperature/tint
    r *= (1 + temperature*0.5 + tint*0.2);
    g *= (1 - tint*0.2);
    b *= (1 - temperature*0.5 + tint*0.2);
    // vibrance + saturation
    const avg = (r+g+b)/3;
    const mx = Math.max(r,g,b);
    const amt = (1 - (mx/255)) * (vibrance*0.8 + saturation);
    r += (r-avg)*amt; g += (g-avg)*amt; b += (b-avg)*amt;
    // contrast
    const c = (1+contrast);
    r = (r-128)*c + 128;
    g = (g-128)*c + 128;
    b = (b-128)*c + 128;
    data[i]=clamp8(r); data[i+1]=clamp8(g); data[i+2]=clamp8(b);
  }

  // blur (approx Gaussian via separable box or Canvas-like blur)
  if (blur>0.01){
    boxBlur(data, w, h, Math.max(1, Math.floor(blur)));
  }

  if (sharpen>0.01){
    // unsharp like: original*(1+amount) - blurred*amount
    unsharpInline(data, w, h, sharpen, 1);
  }

  return img;
}

function clamp8(v){ return v<0?0:(v>255?255:v)|0; }

function boxBlur(data, w, h, r){
  // simple separable box blur
  const tmp = new Uint8ClampedArray(data.length);
  // horizontal
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let rs=0, gs=0, bs=0, as=0, count=0;
      for(let k=-r;k<=r;k++){
        const nx = x+k; if(nx<0||nx>=w) continue;
        const i = (y*w+nx)*4;
        rs+=data[i]; gs+=data[i+1]; bs+=data[i+2]; as+=data[i+3]; count++;
      }
      const o = (y*w+x)*4;
      tmp[o] = (rs/count)|0; tmp[o+1]=(gs/count)|0; tmp[o+2]=(bs/count)|0; tmp[o+3]=(as/count)|0;
    }
  }
  // vertical
  for(let x=0;x<w;x++){
    for(let y=0;y<h;y++){
      let rs=0, gs=0, bs=0, as=0, count=0;
      for(let k=-r;k<=r;k++){
        const ny = y+k; if(ny<0||ny>=h) continue;
        const i = (ny*w+x)*4;
        rs+=tmp[i]; gs+=tmp[i+1]; bs+=tmp[i+2]; as+=tmp[i+3]; count++;
      }
      const o = (y*w+x)*4;
      data[o] = (rs/count)|0; data[o+1]=(gs/count)|0; data[o+2]=(bs/count)|0; data[o+3]=(as/count)|0;
    }
  }
}

function unsharpInline(data, w, h, amount, radius){
  const copy = new Uint8ClampedArray(data);
  boxBlur(copy, w, h, Math.max(1, Math.floor(radius)));
  for(let i=0;i<data.length;i+=4){
    data[i] = clamp8(data[i]*(1+amount) - copy[i]*amount);
    data[i+1] = clamp8(data[i+1]*(1+amount) - copy[i+1]*amount);
    data[i+2] = clamp8(data[i+2]*(1+amount) - copy[i+2]*amount);
  }
}

function unsharpMask(imgData, amount=0.6, radius=1.0){
  const out = new ImageData(new Uint8ClampedArray(imgData.data), imgData.width, imgData.height);
  unsharpInline(out.data, imgData.width, imgData.height, amount, radius);
  return out;
}