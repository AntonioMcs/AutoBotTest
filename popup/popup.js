document.getElementById('toggleAuto').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'toggle-auto' }, resp => console.log('toggle response', resp));
});

document.getElementById('addAccount').addEventListener('click', async () => {
  const token = prompt('Pega token de cuenta:');
  if (!token) return;
  const key = `account_default`;
  const obj = {};
  obj[key] = { token, created: Date.now() };
  chrome.storage.local.set(obj, () => alert('Cuenta guardada'));
});
