<!-- app.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import '../utils/llm';
import { Divider } from 'primevue';
import ProviderConfig from '~/components/ProviderConfig.vue';

const primevue = usePrimeVue();

const provider = ref<IProvider>();

const copyMessage = (messageIndex: number) => {
  const message = messages.value[messageIndex]!.content;
  navigator.clipboard.writeText(message);
};

const messages = ref<Message[]>([
  {
    id: 1,
    content: '你好！我是AI助手，有什么可以帮助你的吗？',
    role: 'assistant',
    time: new Date().getTime()
  }
]);
const dialogVisible = ref(false);
const inputMessage = ref('');
const isLoading = ref(false);

// 发送消息功能
const sendMessage = async () => {
  if (!provider.value) {
    return;
  }
  scrollToBottom();
  messages.value.push({
    content: inputMessage.value,
    role: 'user',
    time: new Date().getTime()
  });
  const res = ref(await message(messages, provider.value));
};

// 自动滚动到底部
const scrollToBottom = () => {
  const container = document.querySelector('.chat-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};
</script>

<template>
  <div class="from-gray-50 to-gray-100 flex flex-col h-full">
    <main
      class="flex-1 flex flex-col max-w-4xl w-full h-full mx-auto px-4 py-6">
      <div
        class="chat-container flex-1 overflow-y-auto mb-4 p-4 max-h-[calc(100vh-220px)]"
        style="height: 100%">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="mb-4 flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="items-start max-w-[85%]">
            <div
              class="flex"
              :class="
                msg.role === 'user'
                  ? ' justify-items-end'
                  : 'justify-items-start'
              "></div>
            <div>
              <pre class="text-wrap">{{ msg.content }}</pre>
              <Divider />
              <div class="flex justify-between items-center gap-2">
                <p class="text-xs">
                  {{ timeFormat(msg.time) }}
                </p>
                <VarButton
                  @click="copyMessage(index)"
                  severity="secondary"
                  size="small">
                  复制
                </VarButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VarDivider />
      <div class="flex items-center gap-2 pt-4 pb-4">
        <VarInput
          textarea
          v-model="inputMessage"
          placeholder="输入您的消息..."
          rows="3"
          filled
          :maxlength="1000"
          class="flex-1 scroll-auto" />
        <div class="flex flex-col gap-1">
          <VarButton @click="dialogVisible = true" class="whitespace-nowrap">
            配置
          </VarButton>
          <VarButton
            @click="sendMessage"
            :disabled="!provider"
            class="whitespace-nowrap">
            发送
          </VarButton>
        </div>
      </div>
    </main>
    <ProviderConfig v-model="dialogVisible" v-model:provider="provider" />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex-direction: column;
}
</style>
