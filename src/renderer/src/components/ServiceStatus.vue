<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const statusColor = computed(() => {
  return appStore.serviceStatus === 'healthy' ? '#18a058' : '#d03050'
})

const statusText = computed(() => {
  return appStore.serviceStatus === 'healthy' ? '服务正常' : '服务异常'
})
</script>

<template>
  <div class="status-indicator">
    <div class="dot" :style="{ backgroundColor: statusColor }"></div>
    <span class="text">{{ statusText }}</span>
  </div>
</template>

<style scoped>
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.text {
  font-size: 12px;
  color: #666;
}
</style>
