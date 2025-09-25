// background.js (MV3 service worker)
// Ruta: AutoBotTest/autobot/scripts/background.js

// NOTE: este archivo está autocontenido y no hace import; usa window.autobotConfig/autobotUtils/autobotAccounts
// Asegúrate de que config.js, utils.js y accounts.js estén también presentes y cargados en el extension (o duplicar funciones si no).

// Simple fallback si no están definidos (esto permite pegar este archivo sin modificar)
const CONFIG = (typeof autobotConfig !== "undefined") ? autobotConfig : {
  apiBase: "https://wplace.live",
  paintEndpoint: "https://wplace.live/api/paint",
  checkIntervalMs: 60000,
  paintCooldownMs: 700,
  palette: ["#000000","#FFFFFF"],
  jobMaxAttempts: 4
};
const Utils = (typeof autobotUtils !== "undefined") ? autobotUtils : {
  delay: ms => new Promise(r=>setTimeout(r,ms)),
  fetchWithRetry: async (u,o,r=3,b=500)=> { const resp = await fetch(u,o); return resp; },
  log: (...a)=>console.log("[AutoBot]",...a),
  findNearestColor: (c,p)=>p[0]
};
const Accounts = (typeof autobotAccounts !== "undefined") ? autobotAccounts : {
  getAll: async ()=>[], add: async ()=>[], rotateAvailable: async ()=>null, touch: async ()=>{}, lock: async ()=>{}
};

let queue = [];
let processing = false;
let botEnabled = false;

// Initialize
chrome.runtime.onInstalled.addListener(() => {
  Utils.log("Autobot background installed");
  chrome.alarms.create("autofarmTick", { periodInMinutes: Math.max(1, CONFIG.checkIntervalMs/60000) });
});

// messages from popup/content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "enqueue-pixel"){
    enqueueJob(msg.job);
    sendResponse({ ok: true });
  } else if (msg?.type === "toggle-bot"){
    botEnabled = !botEnabled;
    if (botEnabled) startProcessing();
    sendResponse({ ok: true, enabled: botEnabled });
  } else if (msg?.type === "add-account"){
    Accounts.add(msg.account).then(list => sendResponse({ ok: true, accounts: list }));
    return true; // async
  } else if (msg?.type === "list-accounts"){
    Accounts.getAll().then(list => sendResponse({ ok: true, accounts: list }));
    return true;
  } else if (msg?.type === "export-accounts"){
    Accounts.getAll().then(list => sendResponse({ ok: true, export: JSON.stringify(list) }));
    return true;
  }
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autofarmTick") {
    if (botEnabled) startProcessing();
  }
});

function enqueueJob(job){
  job.attempts = job.attempts || 0;
  queue.push(job);
  processQueue();
}

async function startProcessing(){
  if (!processing) processQueue();
}

async function processQueue(){
  if (processing) return;
  processing = true;
  while (queue.length){
    const job = queue.shift();
    job.attempts = (job.attempts || 0) + 1;
    try {
      Utils.log("Processing job", job);

      // pick an account available
      const acct = await Accounts.rotateAvailable();
      if (!acct) {
        Utils.log("No account available, requeueing and waiting");
        // requeue at end and wait
        queue.push(job);
        await Utils.delay(5000);
        continue;
      }

      // Example: build payload
      const payload = { x: job.x, y: job.y, color: job.color };

      // If token is required:
      const headers = { "Content-Type": "application/json" };
      if (acct.token) headers["Authorization"] = `Bearer ${acct.token}`;

      // *** AQUI VA LA LLAMADA AL SERVIDOR QUE PINTA ***
      // Reemplaza paintEndpoint si usas otro endpoint o proxy
      const resp = await Utils.fetchWithRetry(CONFIG.paintEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      }, 2, 400);

      if (!resp.ok) {
        Utils.log("Paint failed status", resp.status);
        if (resp.status === 429) {
          // too many requests: lock account por un periodo y requeue
          await Accounts.lock(acct.id, 60_000); // bloquea por 60s
          queue.push(job);
        } else {
          if (job.attempts < CONFIG.jobMaxAttempts) queue.push(job);
          else Utils.log("Job failed permanently:", job);
        }
      } else {
        const data = await resp.json().catch(()=>null);
        Utils.log("Paint success", data);
        await Accounts.touch(acct.id);
      }

      // cooldown between paints
      await Utils.delay(CONFIG.paintCooldownMs);
    } catch (err) {
      Utils.log("Error processing job:", err);
      if (job.attempts < CONFIG.jobMaxAttempts) queue.push(job);
      await Utils.delay(2000);
    }
  }
  processing = false;
}
