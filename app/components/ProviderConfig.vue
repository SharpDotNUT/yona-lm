<script setup lang="ts">
const show = defineModel<boolean>();

const provider = defineModel<IProvider>('provider');

const providers = ref(await getAllProviders());
const currentProvider = ref(providers.value[0]!);

const refresh = async () => {
  providers.value = await getAllProviders();
};

const create = async () => {
  const newProvider = getEmptyProvider();
  setProvider(newProvider.id, newProvider);
  await refresh();
  currentProvider.value = newProvider;
};

const del = async () => {
  deleteProvider(currentProvider.value.id);
  if (!providers.value.length) create();
  currentProvider.value = providers.value[0]!;
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
      <div class="flex gap-2">
        <IftaLabel class="flex-1">
          <Select
            fluid
            :options="providers"
            v-model="currentProvider"
            optionLabel="name" />
          <label>选择提供方</label>
        </IftaLabel>
        <Button @click="create">创建</Button>
      </div>
      <Divider />
      <IftaLabel>
        <InputText fluid v-model="currentProvider.name" />
        <label>名称</label>
      </IftaLabel>
      <IftaLabel>
        <InputText fluid v-model="currentProvider.base_url" />
        <label>Base URL</label>
      </IftaLabel>
      <IftaLabel>
        <InputText fluid v-model="currentProvider.api_key" />
        <label>API Key</label>
      </IftaLabel>
      <IftaLabel>
        <InputText fluid v-model="currentProvider.model" />
        <label>模型名称</label>
      </IftaLabel>
      <Button
        @click="
          setProvider(currentProvider.id, currentProvider);
          provider = currentProvider;
          refresh();
        ">
        保存
      </Button>
      <Button @click="del">删除</Button>
    </div>
    <template #footer></template>
  </Dialog>
</template>
