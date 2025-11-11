// scripts/overlay.js
(function() {
  console.log("[Overlay] Ghost preview + control de tamaño activo");

  const overlayBox = document.createElement("div");
  overlayBox.id = "autobot-overlay-box";
  overlayBox.style.position = "absolute";
  overlayBox.style.border = "2px dashed #00FFAA";
  overlayBox.style.background = "rgba(0, 255, 170, 0.1)";
  overlayBox.style.pointerEvents = "auto";
  overlayBox.style.cursor = "move";
  overlayBox.style.display = "none";
  overlayBox.style.zIndex = "99998";
  overlayBox.style.overflow = "hidden";

  // Imagen fantasma (ghost)
  const ghostImg = document.createElement("img");
  ghostImg.id = "autobot-ghost";
  ghostImg.style.position = "absolute";
  ghostImg.style.top = "0";
  ghostImg.style.left = "0";
  ghostImg.style.width = "100%";
  ghostImg.style.height = "100%";
  ghostImg.style.opacity = "0.4";
  overlayBox.appendChild(ghostImg);

  // Coordenadas
  const coordLabel = document.createElement("div");
  coordLabel.id = "autobot-coord-label";
  coordLabel.style.position = "absolute";
  coordLabel.style.background = "#111";
  coordLabel.style.color = "#0FF";
  coordLabel.style.fontFamily = "monospace";
  coordLabel.style.fontSize = "12px";
  coordLabel.style.padding = "2px 6px";
  coordLabel.style.borderRadius = "6px";
  coordLabel.style.zIndex = "99999";
  coordLabel.style.display = "none";

  // Control de escala (slider + input)
  const scalePanel = document.createElement("div");
  scalePanel.style.position = "fixed";
  scalePanel.style.bottom = "80px";
  scalePanel.style.left = "20px";
  scalePanel.style.background = "#111";
  scalePanel.style.color = "#0FF";
  scalePanel.style.fontFamily = "monospace";
  scalePanel.style.padding = "10px";
  scalePanel.style.borderRadius = "8px";
  scalePanel.style.zIndex = "100000";
  scalePanel.style.display = "none";
  scalePanel.innerHTML = `
    <label for="scaleSlider">📏 Tamaño (px): </label>
    <input type="range" id="scaleSlider" min="50" max="400" value="180" step="1" style="width:150px;">
    <input type="number" id="scaleInput" value="180" min="50" max="400" step="1" style="width:60px; margin-left:5px;">
  `;
  document.body.appendChild(scalePanel);

  const scaleSlider = scalePanel.querySelector("#scaleSlider");
  const scaleInput = scalePanel.querySelector("#scaleInput");

  // Botones
  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "✅ Confirmar posición";
  confirmBtn.style.position = "fixed";
  confirmBtn.style.bottom = "20px";
  confirmBtn.style.left = "20px";
  confirmBtn.style.padding = "10px 16px";
  confirmBtn.style.background = "#00b894";
  confirmBtn.style.color = "#fff";
  confirmBtn.style.border = "none";
  confirmBtn.style.borderRadius = "8px";
  confirmBtn.style.fontWeight = "bold";
  confirmBtn.style.cursor = "pointer";
  confirmBtn.style.zIndex = "100000";
  confirmBtn.style.display = "none";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "❌ Cancelar";
  cancelBtn.style.position = "fixed";
  cancelBtn.style.bottom = "20px";
  cancelBtn.style.left = "200px";
  cancelBtn.style.padding = "10px 16px";
  cancelBtn.style.background = "#d63031";
  cancelBtn.style.color = "#fff";
  cancelBtn.style.border = "none";
  cancelBtn.style.borderRadius = "8px";
  cancelBtn.style.fontWeight = "bold";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.zIndex = "100000";
  cancelBtn.style.display = "none";

  document.body.appendChild(overlayBox);
  document.body.appendChild(coordLabel);
  document.body.appendChild(confirmBtn);
  document.body.appendChild(cancelBtn);

  let currentX = 0, currentY = 0, width = 0, height = 0;
  let dragging = false, offsetX = 0, offsetY = 0;
  let ratio = 1;
  let confirmCallback = null, cancelCallback = null;

  // =============== FUNCIONES PRINCIPALES ===============

  window.showOverlayBox = function(x, y, w, h, imgSrc, onConfirm, onCancel) {
    currentX = x; currentY = y; width = w; height = h;
    ratio = w / h;
    confirmCallback = onConfirm;
    cancelCallback = onCancel;

    ghostImg.src = imgSrc || "";
    updateOverlayPosition();

    overlayBox.style.display = "block";
    coordLabel.style.display = "block";
    confirmBtn.style.display = "block";
    cancelBtn.style.display = "block";
    scalePanel.style.display = "block";

    // Inicializa valores del control
    scaleSlider.value = w;
    scaleInput.value = w;
  };

  window.hideOverlayBox = function() {
    overlayBox.style.display = "none";
    coordLabel.style.display = "none";
    confirmBtn.style.display = "none";
    cancelBtn.style.display = "none";
    scalePanel.style.display = "none";
  };

  function updateOverlayPosition() {
    overlayBox.style.left = currentX + "px";
    overlayBox.style.top = currentY + "px";
    overlayBox.style.width = width + "px";
    overlayBox.style.height = height + "px";
    coordLabel.textContent = `📍 X:${Math.round(currentX)} | Y:${Math.round(currentY)} | ${Math.round(width)}x${Math.round(height)}px`;
    coordLabel.style.left = currentX + 5 + "px";
    coordLabel.style.top = (currentY - 25) + "px";
  }

  // =============== ARRASTRE ===============

  overlayBox.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - currentX;
    offsetY = e.clientY - currentY;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    currentX = e.clientX - offsetX;
    currentY = e.clientY - offsetY;
    updateOverlayPosition();
  });

  document.addEventListener("mouseup", () => {
    if (dragging) dragging = false;
  });

  // =============== AJUSTE DE ESCALA ===============

  function setScale(px) {
    width = px;
    height = Math.round(px / ratio);
    updateOverlayPosition();
  }

  scaleSlider.addEventListener("input", () => {
    const px = parseInt(scaleSlider.value);
    scaleInput.value = px;
    setScale(px);
  });

  scaleInput.addEventListener("input", () => {
    const px = parseInt(scaleInput.value);
    if (isNaN(px)) return;
    scaleSlider.value = px;
    setScale(px);
  });

  // =============== BOTONES ===============

  confirmBtn.addEventListener("click", () => {
    hideOverlayBox();
    if (typeof confirmCallback === "function") confirmCallback(currentX, currentY, width, height);
    alert(`✅ Posición confirmada en X:${Math.round(currentX)}, Y:${Math.round(currentY)} (${Math.round(width)}x${Math.round(height)}px)`);
  });

  cancelBtn.addEventListener("click", () => {
    hideOverlayBox();
    if (typeof cancelCallback === "function") cancelCallback();
    alert("❌ Reubicación cancelada");
  });
})();
