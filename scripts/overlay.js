// overlay.js - Proporciona una superposición visual en el lienzo
(function() {
  console.log('Overlay Loaded');

  // Crear un contenedor para la superposición
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'none';
  document.body.appendChild(overlay);

  // Función para mostrar la superposición
  function showOverlay() {
    overlay.style.display = 'block';
  }

  // Función para ocultar la superposición
  function hideOverlay() {
    overlay.style.display = 'none';
  }

  // Agregar botones para controlar la superposición
  const showButton = document.createElement('button');
  showButton.textContent = 'Mostrar Overlay';
  showButton.addEventListener('click', showOverlay);
  document.body.appendChild(showButton);

  const hideButton = document.createElement('button');
  hideButton.textContent = 'Ocultar Overlay';
  hideButton.addEventListener('click', hideOverlay);
  document.body.appendChild(hideButton);
})();
