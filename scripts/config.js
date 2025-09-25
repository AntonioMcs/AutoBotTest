// CONFIGURACIÓN GLOBAL DEL AUTOBOT
export const CONFIG = {
  // URL base de tu API o servidor
  apiBase: "https://wplace.live/api",
  // Intervalo en milisegundos para revisar nuevas tareas
  checkInterval: 60000,
  // Número máximo de reintentos en caso de error
  maxRetries: 3,
  // Otros parámetros de personalización
  taskSelector: ".task-item",
  loginSelector: "#btn-login"
};
