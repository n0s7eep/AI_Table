<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Agent } from '@/service/api/agents';

const route = useRoute();
const agent = ref<Agent | null>(null);
const messages = ref<any[]>([]);
const inputMessage = ref('');

const loadChatRoom = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('get-chat-room', route.query.id);
    if (result.success) {
      agent.value = result.room.agent;
      messages.value = result.room.messages;
    } else {
      console.error('获取聊天室信息失败:', result.error);
    }
  } catch (error) {
    console.error('获取聊天室信息失败:', error);
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  try {
    const result = await window.electron.ipcRenderer.invoke('send-message', route.query.id, inputMessage.value);
    if (result.success) {
      messages.value.push({
        role: 'user',
        content: inputMessage.value
      });
      messages.value.push(result.response);
      inputMessage.value = '';
    } else {
      console.error('发送消息失败:', result.error);
    }
  } catch (error) {
    console.error('发送消息失败:', error);
  }
};

onMounted(() => {
  loadChatRoom();
});
</script>

<template>
  <div class="chat-container">
    <NCard :bordered="false" class="chat-card">
      <template #header>
        <div class="chat-header">
          <h2>{{ agent?.name || '未知Agent' }}</h2>
          <p class="description">{{ agent?.description || '暂无描述' }}</p>
        </div>
      </template>
      <div class="chat-content">
        <!-- 这里后续可以添加聊天界面 -->
        <p>聊天ID: {{ route.query.id }}</p>
        <p>Agent类型: {{ agent?.type }}</p>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.chat-container {
  padding: 16px;
  height: 100%;
}

.chat-card {
  height: 100%;
}

.chat-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.chat-content {
  height: calc(100% - 80px);
  overflow-y: auto;
}
</style>
