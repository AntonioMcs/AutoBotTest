// config.js - CONFIGURACIÓN CENTRALIZADA
const CONFIG = {
  apiBase: "https://wplace.live",
  paintEndpoint: "https://wplace.live/api/paint",
  checkIntervalMs: 60_000,
  paintCooldownMs: 700,
  maxRetries: 3,
  canvasSelector: "canvas",
  loginButtonSelector: "#login-btn",
  turnstileSelector: ".cf-turnstile",
  palette: [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"
  ],
  jobMaxAttempts: 4,
  targetSize: 180,     // nuevo: tamaño para redimensionar imágenes
  dither: true         // nuevo: aplicar dithering al convertir
};

if (typeof module !== "undefined") module.exports = CONFIG;
if (typeof window !== "undefined") window.autobotConfig = CONFIG;
