// scripts/auto_image.js
import { CONFIG } from './config.js';
import { loadImageFromUrl, resizeImageTo, getImageDataFromCanvas } from './image_utils.js';
import { mapToPalette } from './quantize.js';
import Utils from './utils.js';

export async function processImage(url, offsetX = 0, offsetY = 0) {
  const img = await loadImageFromUrl(url);

  // Detectar automáticamente tamaño del lienzo
  const canvasTarget = document.querySelector(CONFIG.canvasSelector);
  if (!canvasTarget) {
    alert("❌ No se encontró el lienzo de destino en wplace.live");
    return;
  }

  const { width: canvasW, height: canvasH } = canvasTarget;
  Utils.log(`Lienzo detectado: ${canvasW}x${canvasH}`);

  // Escalar imagen proporcionalmente al tamaño del lienzo
  const targetSize = Math.min(canvasW, canvasH, CONFIG.targetSize);
  const resizedCanvas = resizeImageTo(img, targetSize);
  const imageData = getImageDataFromCanvas(resizedCanvas);
  const pixelMap = mapToPalette(imageData, CONFIG.palette);

  Utils.log(`🖼️ Procesados ${pixelMap.length} píxeles (${resizedCanvas.width}x${resizedCanvas.height})`);

  // Enviar trabajos de pintura a background.js
  for (const px of pixelMap) {
    chrome.runtime.sendMessage({
      type: "enqueue-pixel",
      job: {
        x: px.x + offsetX,
        y: px.y + offsetY,
        color: px.color
      }
    });
    await Utils.delay(CONFIG.paintCooldownMs);
  }

  Utils.log("✅ Pintado completo.");
}
