<template>
  <div class="task-card" :class="[`priority-${task.priority}`, `status-${task.status}`]">
    <div class="task-header">
      <div class="task-priority" :class="task.priority">
        {{ priorityLabels[task.priority] }}
      </div>
      <div class="task-status" :class="task.status">
        {{ statusLabels[task.status] }}
      </div>
    </div>
    
    <h3 class="task-title">{{ task.title }}</h3>
    <p class="task-description">{{ task.description }}</p>
    
    <div class="task-meta">
      <div class="task-deadline">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{{ formatDate(task.deadline) }}</span>
      </div>
      
      <div class="task-assignee">
        <div class="avatar" :style="{ backgroundImage: `url(${task.assignee.avatar})` }"></div>
        <span>{{ task.assignee.name }}</span>
      </div>
    </div>
    
    <div class="task-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${task.progress}%` }"></div>
      </div>
      <div class="progress-text">{{ task.progress }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  deadline: Date;
  assignee: Assignee;
  progress: number;
}

const props = defineProps<{
  task: Task
}>();

// Labels for display
const priorityLabels: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低'
};

const statusLabels: Record<string, string> = {
  pending: '待处理',
  'in-progress': '进行中',
  completed: '已完成',
  rejected: '已拒绝'
};

// Format date for display
const formatDate = (date: Date): string => {
  const taskDate = new Date(date);
  const now = new Date();
  
  // Check if the date is today
  if (taskDate.toDateString() === now.toDateString()) {
    return '今天';
  }
  
  // Check if the date is tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (taskDate.toDateString() === tomorrow.toDateString()) {
    return '明天';
  }
  
  // Check if the date is within the next 7 days
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  if (taskDate < nextWeek) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[taskDate.getDay()];
  }
  
  // Otherwise, return the date in a short format
  return taskDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.task-card {
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border-radius: var(--radius-medium);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.task-card.priority-high::before {
  background: var(--color-error);
}

.task-card.priority-medium::before {
  background: var(--color-warning);
}

.task-card.priority-low::before {
  background: var(--color-success);
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--color-border-glow);
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.task-priority, .task-status {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-small);
  font-weight: var(--font-weight-medium);
}

.task-priority.high {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.task-priority.medium {
  background: rgba(251, 191, 36, 0.1);
  color: var(--color-warning);
}

.task-priority.low {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.task-status.pending {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
}

.task-status.in-progress {
  background: rgba(42, 63, 251, 0.1);
  color: var(--color-primary);
}

.task-status.completed {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.task-status.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.task-title {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.task-deadline, .task-assignee {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 1px solid var(--color-border);
}

.task-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  min-width: 30px;
  text-align: right;
}

@media (max-width: 768px) {
  .task-card {
    padding: var(--spacing-md);
  }
}
</style> 