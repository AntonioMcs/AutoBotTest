// scripts/quantize.js
import { hexToRgb } from './utils.js';

export function nearestColor(rgb, palette) {
  let minDist = Infinity;
  let nearest = palette[0];
  for (const hex of palette) {
    const c = hexToRgb(hex);
    const d = (rgb.r - c.r)**2 + (rgb.g - c.g)**2 + (rgb.b - c.b)**2;
    if (d < minDist) { minDist = d; nearest = hex; }
  }
  return nearest;
}

export function mapToPalette(imageData, palette) {
  const { data, width, height } = imageData;
  const mapped = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const rgb = { r: data[i], g: data[i+1], b: data[i+2] };
      const nearest = nearestColor(rgb, palette);
      mapped.push({x, y, color: nearest});
    }
  }
  return mapped;
}
