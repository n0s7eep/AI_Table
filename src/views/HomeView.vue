<script setup lang="ts">
import Layout from '@/components/common/Layout.vue'
</script>

<template>
  <Layout>
    <div class="home-view">
      <div class="welcome-section">
        <h1>欢迎使用 <span class="text-gradient">AI Table</span></h1>
        <p class="welcome-description">
          AI Table 是一个智能化的工作平台，集成了执行、创作、协同和管理功能，帮助您提高工作效率。
        </p>
        
        <div class="module-cards">
          <router-link to="/execution" class="module-card">
            <div class="module-icon execution">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2>执行模块</h2>
            <p>管理和执行任务，查看任务进度和结果</p>
          </router-link>
          
          <router-link to="/creation" class="module-card">
            <div class="module-icon creation">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h2>创作模块</h2>
            <p>使用AI增强的工具创建和编辑内容</p>
          </router-link>
          
          <router-link to="/collaboration" class="module-card">
            <div class="module-icon collaboration">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2>协同模块</h2>
            <p>与团队成员和AI助手协作，提高工作效率</p>
          </router-link>
          
          <router-link to="/management" class="module-card">
            <div class="module-icon management">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <h2>管理模块</h2>
            <p>管理项目、团队和资源，监控整体进度</p>
          </router-link>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>快速操作</h2>
        <div class="actions-grid">
          <button class="action-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            创建任务
          </button>
          <button class="action-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            新建文档
          </button>
          <button class="action-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            发起会议
          </button>
          <button class="action-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            帮助中心
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.home-view {
  width: 100%;
}

.welcome-section {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.welcome-section h1 {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
}

.welcome-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
}

.module-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.module-card {
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  padding: var(--spacing-lg);
  text-align: center;
  transition: var(--transition-normal);
  text-decoration: none;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--color-border-glow);
}

.module-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.module-icon.execution {
  color: var(--color-primary);
  background: rgba(42, 63, 251, 0.1);
}

.module-icon.creation {
  color: var(--color-secondary);
  background: rgba(22, 214, 251, 0.1);
}

.module-icon.collaboration {
  color: var(--color-secondary-alt);
  background: rgba(140, 20, 252, 0.1);
}

.module-icon.management {
  color: var(--color-warning);
  background: rgba(251, 191, 36, 0.1);
}

.module-card h2 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.module-card p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.quick-actions {
  margin-top: var(--spacing-xxl);
}

.quick-actions h2 {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.action-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.action-button svg {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .module-cards {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
