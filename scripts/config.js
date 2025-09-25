// config.js - configuración centralizada del AutoBot
// Ruta: AutoBotTest/autobot/scripts/config.js

const CONFIG = {
  // REEMPLAZA con el endpoint real si tu bot hace requests directos
  apiBase: "https://wplace.live", // <- ajustar si usas proxy/API propio
  // Cuando contactes el endpoint para pintar (si es necesario)
  paintEndpoint: "https://wplace.live/api/paint", // <<< REEMPLAZAR según el endpoint real
  // Intervalos y límites
  checkIntervalMs: 60_000,   // ciclo principal (background)
  paintCooldownMs: 700,      // cooldown entre paints (ajusta)
  maxRetries: 3,
  // Parámetros del overlay / canvas
  canvasSelector: "canvas",  // selector del canvas en wplace (ajusta si diferente)
  // Selectores de elementos en la web (ajustar según DOM real)
  loginButtonSelector: "#login-btn",
  turnstileSelector: ".cf-turnstile", // si la web usa Turnstile
  // Color palette: lista de colores disponibles (hex)
  palette: [
    "#000000","#FFFFFF","#FF0000","#00FF00","#0000FF",
    // ... añade paleta completa si la conoces
  ],
  // Límite de reintentos por job
  jobMaxAttempts: 4
};

if (typeof module !== "undefined") module.exports = CONFIG;
if (typeof window !== "undefined") window.autobotConfig = CONFIG;
