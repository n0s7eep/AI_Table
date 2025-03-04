<template>
  <header class="header">
    <div class="header-left">
      <div class="search-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="搜索..." 
          v-model="searchQuery"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="header-right">
      <div class="notification-icon" @click="toggleNotifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <div v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</div>
      </div>
      
      <div class="settings-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
      
      <div v-if="showNotifications" class="notifications-panel">
        <div class="notifications-header">
          <h3>通知</h3>
          <button class="mark-all-read" @click="markAllAsRead">全部标记为已读</button>
        </div>
        <div class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id" 
            class="notification-item"
            :class="{ 'unread': !notification.read }"
          >
            <div class="notification-icon" :class="notification.type">
              <svg v-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <svg v-else-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.time) }}</div>
            </div>
          </div>
          <div v-if="notifications.length === 0" class="no-notifications">
            暂无通知
          </div>
        </div>
        <div class="notifications-footer">
          <button class="view-all">查看全部</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const isSearchFocused = ref(false);
const showNotifications = ref(false);

// Mock notifications data
const notifications = ref([
  {
    id: '1',
    title: '任务已完成',
    message: '您的任务"市场分析报告"已完成',
    type: 'success',
    read: false,
    time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    title: '新任务分配',
    message: '您有一个新的任务"产品设计评审"',
    type: 'info',
    read: false,
    time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    title: '系统更新',
    message: '系统将在今晚22:00进行维护更新',
    type: 'warning',
    read: true,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
]);

const unreadNotifications = computed(() => {
  return notifications.value.filter(notification => !notification.read).length;
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  
  // More than a day
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  return `${days}天前`;
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 var(--spacing-lg);
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: var(--blur-card);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: var(--z-index-sticky);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: var(--blur-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) var(--spacing-xl);
  font-size: var(--font-size-sm);
  transition: var(--transition-normal);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 8px rgba(42, 63, 251, 0.4);
  outline: none;
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.notification-icon, .settings-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.notification-icon:hover, .settings-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  background: var(--color-error);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
}

.notifications-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: var(--color-bg-medium);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
  margin-top: var(--spacing-sm);
  z-index: var(--z-index-dropdown);
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.notifications-header h3 {
  margin: 0;
  font-size: var(--font-size-md);
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.notifications-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition-normal);
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(42, 63, 251, 0.05);
}

.notification-icon {
  margin-right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon.success {
  color: var(--color-success);
}

.notification-icon.warning {
  color: var(--color-warning);
}

.notification-icon.info {
  color: var(--color-primary);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.notification-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.notification-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.notifications-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.view-all {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.no-notifications {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .header {
    left: 60px;
  }
  
  .search-container {
    width: 200px;
  }
}
</style> 