// background.js - service worker principal
let queue = [];
let processing = false;

// Evento instalación
chrome.runtime.onInstalled.addListener(() => {
  console.log('Autobot - background installed');
});

// Recibe mensajes desde popup o content_script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'enqueue-pixel') {
    queue.push(msg.job);
    processQueue();
    sendResponse({ok: true});
  } else if (msg?.type === 'toggle-auto') {
    // TODO: lógica toggle ON/OFF desde popup
    sendResponse({ok: true});
  }
  return true;
});

// Procesa la cola de tareas
async function processQueue(){
  if (processing) return;
  processing = true;
  while (queue.length) {
    const job = queue.shift();
    try {
      // --- AQUI VA LA LLAMADA A LA URL DEL SERVIDOR ---
      // Ejemplo: reemplaza con endpoint real
      const endpoint = 'https://wplace.live/api/paint';
      const body = { x: job.x, y: job.y, color: job.color };

      const headers = { 'Content-Type': 'application/json' };
      // Si la cuenta tiene token:
      if (job.token) headers['Authorization'] = `Bearer ${job.token}`;

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        console.warn('Paint failed', resp.status);
      } else {
        console.log('Paint OK', await resp.json());
      }

      // Cooldown entre acciones
      await sleep(700);
    } catch (err) {
      console.error('Error procesando job', err);
    }
  }
  processing = false;
}

// Función sleep
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
