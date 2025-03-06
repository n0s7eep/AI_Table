<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import ServiceStatus from '@/components/ServiceStatus.vue';
import { getAgents } from '@/service/api/agents';
import type { Agent } from '@/service/api/agents';

const appStore = useAppStore();
const agents = ref<Agent[]>([]);

const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async () => {
  try {
    agents.value = await getAgents();
  } catch (error) {
    console.error('获取agent列表失败:', error);
  }
});
</script>

<template>
  <NSpace vertical :size="16">
    <div class="status-wrapper">
      <ServiceStatus />
    </div>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi v-for="agent in agents" :key="agent.type" span="24 s:24 m:8">
        <NCard :bordered="false" class="card-wrapper">
          <template #header>
            <div class="card-header">
              <h3>{{ agent.name }}</h3>
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
</style>
