// utils.js
function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

async function fetchWithRetry(url, opts = {}, retries = 3, backoff = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch(err) {
      if (i === retries) throw err;
      await sleep(backoff * Math.pow(2, i));
    }
  }
}

// Exponer funciones globalmente
window.utils = { sleep, fetchWithRetry };
