// accounts.js
const ACCOUNTS_KEY = 'autobot_accounts';

async function getAccounts(){
  return new Promise(res => chrome.storage.local.get([ACCOUNTS_KEY], obj => res(obj[ACCOUNTS_KEY] || [])));
}

async function saveAccounts(accounts){
  return new Promise(res => chrome.storage.local.set({[ACCOUNTS_KEY]: accounts}, () => res(true)));
}

window.accountsStore = { getAccounts, saveAccounts };
