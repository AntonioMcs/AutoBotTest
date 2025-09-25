// auto_farm.js - acciones de 'farm' automatizadas en la página
// Ruta: AutoBotTest/autobot/scripts/auto_farm.js

(function(){
  function collectDrops(){
    // Implementación de ejemplo por DOM, ajustar selectores reales
    const dropButtons = document.querySelectorAll(".drop-collect");
    dropButtons.forEach(btn => {
      try { btn.click(); } catch(e){}
    });
    console.log("[AutoBot auto_farm] collectDrops triggered");
  }

  // Exponer para que background lo invoque via message (si prefieres)
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "autofarm-collect") {
      collectDrops();
      sendResponse({ ok: true });
    }
    return true;
  });

  window.autobot = window.autobot || {};
  window.autobot.collectDrops = collectDrops;
})();
