// scripts/ui_image_loader.js
import { processImage } from './auto_image.js';

(function() {
  const panel = document.createElement('div');
  panel.style.position = "fixed";
  panel.style.top = "10px";
  panel.style.right = "10px";
  panel.style.background = "#222";
  panel.style.color = "#fff";
  panel.style.padding = "10px";
  panel.style.borderRadius = "10px";
  panel.style.zIndex = "99999";
  panel.style.fontFamily = "monospace";
  panel.innerHTML = `
    <strong>AutoBOT Image Loader</strong><br>
    <button id="loadUrl">📎 Cargar desde URL</button>
    <button id="loadFile">📁 Cargar archivo local</button>
  `;
  document.body.appendChild(panel);

  async function askCoordinates() {
    const x = parseInt(prompt("Coordenada X inicial:", "0"));
    const y = parseInt(prompt("Coordenada Y inicial:", "0"));
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
  }

  async function showPreview(imgUrl, x, y) {
    const img = new Image();
    img.src = imgUrl;
    await new Promise(r => img.onload = r);

    const ratio = img.width / img.height;
    const w = ratio >= 1 ? 180 : Math.round(180 * ratio);
    const h = ratio >= 1 ? Math.round(180 / ratio) : 180;

    return new Promise((resolve) => {
      if (window.showOverlayBox) {
        window.showOverlayBox(
          x, y, w, h, imgUrl,
          (newX, newY, newW, newH) => resolve({ confirmed: true, x: newX, y: newY, w: newW, h: newH }),
          () => resolve({ confirmed: false })
        );
      } else {
        resolve({ confirmed: true, x, y, w, h });
      }
    });
  }

  // 📎 Cargar desde URL
  document.getElementById("loadUrl").addEventListener("click", async () => {
    const url = prompt("Introduce la URL de la imagen (ej: https://...):");
    if (!url) return;
    const { x, y } = await askCoordinates();
    const result = await showPreview(url, x, y);
    if (result.confirmed) await processImage(url, result.x, result.y, result.w, result.h);
  });

  // 📁 Cargar imagen local
  document.getElementById("loadFile").addEventListener("click", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target.result;
        const { x, y } = await askCoordinates();
        const result = await showPreview(dataUrl, x, y);
        if (result.confirmed) await processImage(dataUrl, result.x, result.y, result.w, result.h);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
})();
