// art_extractor.js - Extrae y copia obras de arte desde el lienzo
(function() {
  console.log('Art Extractor Loaded');

  // Función para copiar el lienzo actual
  function copyCanvas() {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('No se encontró el lienzo');
      return;
    }
    const dataUrl = canvas.toDataURL();
    console.log('Lienzo copiado:', dataUrl);
    // Aquí puedes agregar lógica para guardar o procesar el dataUrl
  }

  // Agregar un botón al DOM para activar la extracción
  const button = document.createElement('button');
  button.textContent = 'Copiar Lienzo';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '1000';
  button.addEventListener('click', copyCanvas);
  document.body.appendChild(button);
})();
