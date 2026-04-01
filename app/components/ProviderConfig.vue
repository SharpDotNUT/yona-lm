<script setup lang="ts">
const show = defineModel<boolean>();

const provider = defineModel<IProvider>('provider');

const providers = ref(await getAllProviders());
const currentProviderID = ref(providers.value[0]!.id);
const currentProvider = computed(
  () =>
    providers.value.find((provider) => provider.id === currentProviderID.value)!
);

const refresh = async () => {
  providers.value = await getAllProviders();
};

const create = async () => {
  const newProvider = getEmptyProvider();
  setProvider(newProvider.id, newProvider);
  await refresh();
  currentProviderID.value = newProvider.id;
};

const del = async () => {
  deleteProvider(currentProvider.value.id);
  if (!providers.value.length) create();
  currentProviderID.value = providers.value[0]!.id;
  refresh();
};

watch(
  () => currentProvider.value,
  (newValue) => {
    provider.value = newValue;
  },
  {
    immediate: true
  }
);
</script>

<template>
  <Dialog v-model:visible="show" class="w-[60vw]">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 mt-2">
        <VarSelect
          class="flex-1"
          v-model="currentProviderID"
          placeholder="提供方">
          <VarOption
            v-for="provider in providers"
            :key="provider.id"
            :value="provider.id"
            :label="provider.name"></VarOption>
        </VarSelect>
        <VarButton @click="create">创建</VarButton>
      </div>
      <VarDivider />
      <VarInput v-model="currentProvider.name" placeholder="名称" />
      <VarInput v-model="currentProvider.base_url" placeholder="Base URL" />
      <VarInput v-model="currentProvider.api_key" placeholder="API Key" />
      <VarInput v-model="currentProvider.model" placeholder="模型名称" />
      <VarDivider />
      <VarButton @click="del">删除</VarButton>
      <VarButton
        @click="
          setProvider(currentProvider.id, currentProvider);
          provider = currentProvider;
          refresh();
        ">
        保存
      </VarButton>
    </div>
    <template #footer></template>
  </Dialog>
</template>
