<template>
  <Layout>
    <div class="execution-view">
      <div class="page-header">
        <h1>执行模块</h1>
        <p class="page-description">管理和执行任务，查看任务进度和结果</p>
      </div>
      
      <div class="page-content">
        <TaskBoard />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/common/Layout.vue';
import TaskBoard from '@/components/execution/TaskBoard.vue';
</script>

<style scoped>
.execution-view {
  width: 100%;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  max-width: 600px;
}

.page-content {
  width: 100%;
}
</style> 