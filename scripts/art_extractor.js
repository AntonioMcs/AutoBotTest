// art_extractor.js - extrae y exporta arte desde canvas
// Ruta: AutoBotTest/autobot/scripts/art_extractor.js

(function(){
  const Cfg = (typeof autobotConfig !== "undefined") ? autobotConfig : { canvasSelector: "canvas" };

  function exportCanvasRegion(x, y, w, h){
    const canvas = document.querySelector(Cfg.canvasSelector);
    if (!canvas){ console.error("canvas not found"); return null; }
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(x, y, w, h);
    const pixels = [];
    for (let j=0;j<h;j++){
      const row = [];
      for (let i=0;i<w;i++){
        const offset = (j * w + i) * 4;
        const r = imgData.data[offset], g = imgData.data[offset+1], b = imgData.data[offset+2];
        const hex = "#" + [r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
        row.push(hex.toUpperCase());
      }
      pixels.push(row);
    }
    return { x, y, w, h, pixels };
  }

  // Exponer en ventana
  window.autobot = window.autobot || {};
  window.autobot.exportCanvasRegion = exportCanvasRegion;
})();
