<template>
  <Layout>
    <div class="management-view">
      <div class="header">
        <h1 class="title">管理模块</h1>
        <p class="description">管理项目、资源和团队成员，监控工作进度</p>
      </div>
      
      <div class="content">
        <div class="placeholder glass-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <h2>管理模块正在开发中</h2>
          <p>此模块将提供项目管理、资源分配、团队管理等功能</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/common/Layout.vue';
</script>

<style scoped>
.management-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.header {
  margin-bottom: var(--spacing-xl);
}

.title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
}

.content {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  padding: var(--spacing-2xl);
  text-align: center;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.placeholder svg {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.placeholder h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
}

.placeholder p {
  color: var(--color-text-secondary);
}
</style> 