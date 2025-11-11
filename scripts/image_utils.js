// scripts/image_utils.js
export async function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function resizeImageTo(img, targetSize) {
  const ratio = img.width / img.height;
  let w, h;
  if (img.width >= img.height) {
    w = targetSize;
    h = Math.round(targetSize / ratio);
  } else {
    h = targetSize;
    w = Math.round(targetSize * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

export function getImageDataFromCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
