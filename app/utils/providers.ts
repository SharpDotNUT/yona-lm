import { createStore, del, entries, get, set } from 'idb-keyval';

const providerDB = createStore('yona-lm', 'providers');

export async function getProvider(id: string) {
  return await get(id, providerDB);
}

export async function setProvider(id: string, provider: any) {
  return await set(id, provider, providerDB);
}

export async function deleteProvider(id: string) {
  return await del(id, providerDB);
}

export async function getAllProviders() {
  return Object.fromEntries(await entries(providerDB));
}
