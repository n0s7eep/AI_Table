<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useAppStore } from '@/store/modules/app/index';
import ServiceStatus from '@/components/ServiceStatus.vue';
import { getAgents } from '@/service/api/agents';
import type { Agent } from '@/service/api/agents';
import { useMessage } from 'naive-ui';

const { routerPushByKey } = useRouterPush();
const appStore = useAppStore();
const message = useMessage();
const agents = ref<Agent[]>([]);
const loading = ref(false);

const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async () => {
  try {
    agents.value = await getAgents();
  } catch (error) {
    console.error('获取agent列表失败:', error);
    message.error('获取agent列表失败');
  }
});

const handleAgentClick = async (agent: Agent) => {
  if (loading.value) return;

  loading.value = true;
  try {
    const result = await window.electron.ipcRenderer.invoke('create-chat-room', agent.type);
    if (result.success) {
      routerPushByKey("creation_chat", {
        query: { id: result.roomId }, params:{id:result.roomId}
      });
    } else {
      message.error(result.error || '创建聊天室失败');
    }
  } catch (error) {
    console.error('创建聊天室失败:', error);
    message.error('创建聊天室失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <NSpace vertical :size="16">
    <div class="status-wrapper">
      <ServiceStatus />
    </div>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi v-for="agent in agents" :key="agent.type" span="24 s:24 m:8">
        <NCard
          :bordered="false"
          class="card-wrapper"
          hoverable
          :class="{ 'card-loading': loading }"
          @click="handleAgentClick(agent)"
        >
          <template #header>
            <div class="card-header">
              <h3>{{ agent.name }}</h3>
              <NSpin v-if="loading" size="small" />
            </div>
          </template>
          <div class="card-content">
            <p>{{ agent.description }}</p>
          </div>
        </NCard>
      </NGi>
    </NGrid>
    <!-- <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid> -->
  </NSpace>
</template>

<style scoped>
.status-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.card-content {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.card-wrapper {
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.card-loading:hover {
  transform: none;
  box-shadow: none;
}
</style>
