<!-- app.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import '../utils/llm';
import { Divider } from 'primevue';

const primevue = usePrimeVue();

const provider = ref<Provider>({
  name: 'test',
  base_url: 'https://api.siliconflow.cn/v1/chat/completions',
  api_key: localStorage.getItem('test_api_key') || '',
  model: 'deepseek-ai/DeepSeek-V3.2'
});

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
  <div class="min-h-screen from-gray-50 to-gray-100 flex flex-col">
    <main
      class="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6 md:px-6 flex-grow">
      <div
        class="chat-container rounded-lg shadow-md flex-1 overflow-y-auto mb-4 p-4 max-h-[calc(100vh-220px)]"
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
            <Card>
              <template #content>
                <pre class="text-wrap">{{ msg.content }}</pre>
                <Divider />
                <div class="flex justify-between items-center">
                  <p class="text-xs">
                    {{ timeFormat(msg.time) }}
                  </p>
                  <Button
                    @click="copyMessage(index)"
                    label="复制"
                    severity="secondary"
                    size="small" />
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- 加载指示器 -->
        <div v-if="isLoading" class="flex items-start mb-4">
          <Avatar
            label="AI"
            shape="circle"
            class="bg-purple-500 text-white mr-3 mt-1"
            size="small" />
          <div class="bg-gray-100 rounded-lg px-4 py-3">
            <ProgressSpinner
              style="width: 24px; height: 24px"
              strokeWidth="4"
              fill="var(--surface-ground)"
              class="mr-2" />
          </div>
        </div>
      </div>
      <div>
        <Divider />
        <div class="flex items-end gap-2">
          <Textarea
            v-model="inputMessage"
            placeholder="输入您的消息..."
            rows="3"
            filled
            :maxlength="1000"
            class="flex-1 scroll-auto" />
          <div class="flex flex-col gap-1">
            <Button
              label="配置"
              @click="dialogVisible = true"
              class="whitespace-nowrap" />
            <Button
              label="发送"
              @click="sendMessage"
              class="whitespace-nowrap" />
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-right">
          {{ inputMessage.length }}/1000
        </p>
      </div>
    </main>
    <Dialog v-model:visible="dialogVisible" class="w-[60vw]">
      <div class="flex flex-col gap-1">
        <InputText v-model="provider.base_url" placeholder="请输入 Base URL" />
        <InputText v-model="provider.api_key" placeholder="请输入 API Key" />
        <InputText v-model="provider.model" placeholder="请输入模型名称" />
      </div>
    </Dialog>
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
