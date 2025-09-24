// content_script.js - detecta elementos de la página y envía jobs al background
(function(){
  console.log('content_script injected');

  function proposePaint(x, y, color){
    chrome.runtime.sendMessage({ type: 'enqueue-pixel', job: { x, y, color, accountId: 'default', token: null } }, resp => {
      console.log('job sent', resp);
    });
  }

  // Observador DOM: placeholder para detectar canvas
  const observer = new MutationObserver((mutations) => {
    // TODO: agregar lógica para leer canvas y decidir pintar
  });
  observer.observe(document.body, {subtree: true, childList: true});
})();
