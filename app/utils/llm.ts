import dayjs from 'dayjs';
import ky from 'ky';

export const message = async (messages: Ref<Message[]>, provider: Provider) => {
  // 使用 fetch API 来处理 SSE 流
  const response = await fetch(`${provider.base_url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.api_key}`
    },
    body: JSON.stringify({
      model: provider.model,
      messages: messages.value,
      stream: true // 启用流式输出
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`请求失败: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  let currentStreamingMessage = '';
  messages.value.push({
    role: 'assistant',
    content: currentStreamingMessage,
    time: new Date().getTime()
  });
  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices.length > 0) {
              const choice = parsed.choices[0];
              if (choice.delta && choice.delta.content) {
                currentStreamingMessage += choice.delta.content;
                const updatedMessage: Message = {
                  role: 'assistant',
                  content: currentStreamingMessage,
                  time: new Date().getTime()
                };
                messages.value[messages.value.length - 1] = updatedMessage;
              }
            }
          } catch (e) {
            console.warn('无法解析JSON数据:', data);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
