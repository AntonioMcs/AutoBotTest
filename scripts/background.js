// background.js - SERVICIO DE FONDO
const CONFIG_BG = (typeof autobotConfig !== "undefined") ? autobotConfig : {
  apiBase: "https://wplace.live",
  paintEndpoint: "https://wplace.live/api/paint",
  paintCooldownMs: 700,
  palette: ["#000000","#FFFFFF"],
  jobMaxAttempts: 4
};

const Utils_BG = (typeof autobotUtils !== "undefined") ? autobotUtils : {
  delay: ms => new Promise(r=>setTimeout(r,ms)),
  fetchWithRetry: async (u,o,r=3,b=500)=> {
    for (let i = 0; i <= r; i++){
      try {
        const resp = await fetch(u, o);
        if (resp.ok) return resp;
      } catch(e){}
      if (i < r) await Utils_BG.delay(b * Math.pow(2, i));
    }
    throw new Error(`fetchWithRetry failed: ${u}`);
  },
  log: (...a)=>console.log("[AutoBot]",...a)
};

const jobQueue = [];
let lastPaintTime = 0;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "enqueue-pixel"){
    jobQueue.push({...msg.job, attempts: 0});
    sendResponse({ok: true, queueLen: jobQueue.length});
    processQueue();
  }
  return true;
});

async function processQueue(){
  const now = Date.now();
  if (now - lastPaintTime < CONFIG_BG.paintCooldownMs) return;
  if (jobQueue.length === 0) return;

  const job = jobQueue.shift();
  try {
    const payload = {x: job.x, y: job.y, color: job.color, token: job.token};
    const resp = await Utils_BG.fetchWithRetry(CONFIG_BG.paintEndpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    if (resp.ok){
      Utils_BG.log("painted", job.x, job.y, job.color);
      lastPaintTime = Date.now();
    } else {
      retry(job);
    }
  } catch(e){
    Utils_BG.log("paint error", e);
    retry(job);
  }
}

function retry(job){
  job.attempts++;
  if (job.attempts < CONFIG_BG.jobMaxAttempts) jobQueue.push(job);
}

setInterval(processQueue, 200);
