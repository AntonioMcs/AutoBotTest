// accounts.js - manejo de cuentas y rotación
// Ruta: AutoBotTest/autobot/scripts/accounts.js

const AccountsStore = (function(){
  const KEY = "autobot_accounts_v1";

  async function getAll(){
    return new Promise(res => chrome.storage.local.get([KEY], obj => res(obj[KEY] || [])));
  }
  async function saveAll(list){
    return new Promise(res => chrome.storage.local.set({ [KEY]: list }, () => res(true)));
  }
  async function add(account){
    const list = await getAll();
    list.push(Object.assign({
      id: `acct_${Date.now()}`,
      label: account.label || "account",
      token: account.token || null,
      lastUsed: 0,
      lockedUntil: 0
    }, account));
    await saveAll(list);
    return list;
  }
  async function remove(accountId){
    const list = (await getAll()).filter(a => a.id !== accountId);
    await saveAll(list);
    return list;
  }
  async function rotateAvailable(minCooldownMs=0){
    const list = await getAll();
    const now = Date.now();
    // elegir cuenta con lockedUntil <= now y lastUsed más antiguo
    const avail = list.filter(a => (a.lockedUntil || 0) <= now);
    if (!avail.length) return null;
    avail.sort((a,b) => (a.lastUsed || 0) - (b.lastUsed || 0));
    return avail[0];
  }
  async function touch(accountId){
    const list = await getAll();
    const now = Date.now();
    for (let a of list){ if (a.id === accountId){ a.lastUsed = now; } }
    await saveAll(list);
  }
  async function lock(accountId, ms){
    const list = await getAll();
    const until = Date.now() + ms;
    for (let a of list){ if (a.id === accountId) a.lockedUntil = until; }
    await saveAll(list);
  }

  return { getAll, saveAll, add, remove, rotateAvailable, touch, lock };
})();

if (typeof module !== "undefined") module.exports = AccountsStore;
if (typeof window !== "undefined") window.autobotAccounts = AccountsStore;
