// utils.js - UTILIDADES COMUNES
const Utils = (function(){
  function delay(ms){ return new Promise(res=>setTimeout(res, ms)); }

  async function fetchWithRetry(url, opts = {}, retries = 3, backoff = 500){
    for (let i = 0; i <= retries; i++){
      try {
        const resp = await fetch(url, opts);
        if (resp.ok) return resp;
      } catch(e){}
      if (i < retries) await delay(backoff * Math.pow(2, i));
    }
    throw new Error(`fetchWithRetry failed: ${url}`);
  }

  function log(...args){ console.log("[AutoBot]", ...args); }

  function hexToRgb(hex){
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function colorDistance(c1, c2){
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;
    return Math.sqrt(dr*dr + dg*dg + db*db);
  }

  function findNearestColor(hex, palette){
    if (!palette || palette.length === 0) return hex;
    let nearest = palette[0];
    let minDist = colorDistance(hex, nearest);
    for (let i = 1; i < palette.length; i++){
      const dist = colorDistance(hex, palette[i]);
      if (dist < minDist){ minDist = dist; nearest = palette[i]; }
    }
    return nearest;
  }

  return { delay, fetchWithRetry, log, hexToRgb, colorDistance, findNearestColor };
})();

if (typeof module !== "undefined") module.exports = Utils;
if (typeof window !== "undefined") window.autobotUtils = Utils;
