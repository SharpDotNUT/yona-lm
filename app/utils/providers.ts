import { createStore, del, get, set, values } from 'idb-keyval';

const providerDB = createStore('yona-lm', 'providers');

export async function getProvider(id: string) {
  return await get(id, providerDB);
}

export async function setProvider(id: string, provider: IProvider) {
  return await set(id, toRaw(provider), providerDB);
}

export async function deleteProvider(id: string) {
  return await del(id, providerDB);
}

export const getEmptyProvider: () => IProvider = () => {
  return {
    id: crypto.randomUUID(),
    name: 'New Provider',
    base_url: 'https://',
    api_key: '',
    model: ''
  };
};

export async function getAllProviders(): Promise<IProvider[]> {
  const res = (await values(providerDB)) as IProvider[];
  if (!res.length) {
    const newProvider: IProvider = {
      id: crypto.randomUUID(),
      name: 'Default(SiliconFlow)',
      base_url: 'https://api.siliconflow.cn/v1/chat/completions',
      api_key: '',
      model: 'Qwen/Qwen3-8B'
    };
    await setProvider(newProvider.id, newProvider);
    return [newProvider];
  } else {
    return res.sort((a, b) => a.name.localeCompare(b.name));
  }
}
