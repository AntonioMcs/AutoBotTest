// content.js - inyectado en la página wplace
// Ruta: AutoBotTest/autobot/scripts/content.js

const Cfg = (typeof autobotConfig !== "undefined") ? autobotConfig : { canvasSelector: "canvas", palette: ["#000000","#FFFFFF"] };
const Utils = (typeof autobotUtils !== "undefined") ? autobotUtils : { log: (...a)=>console.log(...a), delay: ms => new Promise(r=>setTimeout(r,ms)), findNearestColor: (c,p)=>p[0] };

console.log("[AutoBot content] injected");

function getCanvas() {
  const c = document.querySelector(Cfg.canvasSelector);
  return c;
}

// lee color del pixel (x,y) del canvas y retorna hex
function getPixelHex(canvas, x, y){
  try {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + [data[0], data[1], data[2]].map(v => v.toString(16).padStart(2, "0")).join("");
    return hex.toUpperCase();
  } catch (e) {
    console.error("[AutoBot] getPixel error", e);
    return null;
  }
}

// propuesta simple: obtiene primer pixel que difiere de objetivo y envía job
function proposePaintIfNeeded(targetX, targetY, targetColorHex){
  const canvas = getCanvas();
  if (!canvas) { console.warn("[AutoBot] canvas not found"); return; }
  const currentHex = getPixelHex(canvas, targetX, targetY);
  if (!currentHex) return;
  if (currentHex !== targetColorHex){
    // mapear color al mas cercano de la paleta
    const nearest = Utils.findNearestColor(targetColorHex, Cfg.palette);
    // enviar job al background
    chrome.runtime.sendMessage({ type: "enqueue-pixel", job: { x: targetX, y: targetY, color: nearest } }, resp => {
      console.log("[AutoBot] job enqueue resp", resp);
    });
  } else {
    console.log("[AutoBot] pixel already correct");
  }
}

// Observador opcional para detectar cambios importantes en el DOM (ejemplo)
const observer = new MutationObserver((mutations) => {
  // placeholder: podrías detectar cuando aparece un nuevo canvas o se actualiza la UI
});
observer.observe(document.body, { childList: true, subtree: true });

// Exponer función para ser llamada desde consola o UI
window.autobot = window.autobot || {};
window.autobot.proposePaintIfNeeded = proposePaintIfNeeded;
