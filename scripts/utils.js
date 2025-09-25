// utils.js - utilidades comunes
// Ruta: AutoBotTest/autobot/scripts/utils.js

const Utils = (function(){
  function delay(ms){ return new Promise(res=>setTimeout(res, ms)); }

  async function fetchWithRetry(url, opts = {}, retries = 3, backoff = 500){
    for (let i = 0; i <= retries; i++){
      try {
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
      } catch (err) {
        if (i === retries) throw err;
        await delay(backoff * Math.pow(2, i));
      }
    }
  }

  function log(...args){ console.log("[AutoBot]", ...args); }

  // distancia color euclidiana simple en RGB (asume hex input "#rrggbb")
  function hexToRgb(hex){
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c=>c+c).join("");
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  function colorDistance(c1, c2){
    const dR = c1.r - c2.r, dG = c1.g - c2.g, dB = c1.b - c2.b;
    return Math.sqrt(dR*dR + dG*dG + dB*dB);
  }
  function findNearestColor(hex, palette){
    const rgb = hexToRgb(hex);
    let best = null, bestDist = Infinity;
    for (const p of palette){
      const prgb = hexToRgb(p);
      const dist = colorDistance(rgb, prgb);
      if (dist < bestDist){ bestDist = dist; best = p; }
    }
    return best;
  }

  return { delay, fetchWithRetry, log, hexToRgb, findNearestColor };
})();

if (typeof module !== "undefined") module.exports = Utils;
if (typeof window !== "undefined") window.autobotUtils = Utils;
