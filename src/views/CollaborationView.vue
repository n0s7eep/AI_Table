<template>
  <Layout>
    <div class="collaboration-view">
      <div class="header">
        <h1 class="title">协同模块</h1>
        <p class="description">与团队成员实时协作，共享资源和知识</p>
      </div>
      
      <div class="content">
        <div class="placeholder glass-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h2>协同模块正在开发中</h2>
          <p>此模块将提供团队协作、实时编辑、文档共享等功能</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/common/Layout.vue';
</script>

<style scoped>
.collaboration-view {
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