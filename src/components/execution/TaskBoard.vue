<template>
  <div class="task-board">
    <div class="task-board-header">
      <div class="filter-section">
        <div class="filter-group">
          <div class="filter-label">优先级</div>
          <div class="filter-buttons">
            <button 
              class="filter-button" 
              :class="{ active: priorityFilter === 'all' }"
              @click="priorityFilter = 'all'"
            >
              全部
            </button>
            <button 
              class="filter-button" 
              :class="{ active: priorityFilter === 'high' }"
              @click="priorityFilter = 'high'"
            >
              高
            </button>
            <button 
              class="filter-button" 
              :class="{ active: priorityFilter === 'medium' }"
              @click="priorityFilter = 'medium'"
            >
              中
            </button>
            <button 
              class="filter-button" 
              :class="{ active: priorityFilter === 'low' }"
              @click="priorityFilter = 'low'"
            >
              低
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <div class="filter-label">状态</div>
          <div class="filter-buttons">
            <button 
              class="filter-button" 
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              全部
            </button>
            <button 
              class="filter-button" 
              :class="{ active: statusFilter === 'pending' }"
              @click="statusFilter = 'pending'"
            >
              待处理
            </button>
            <button 
              class="filter-button" 
              :class="{ active: statusFilter === 'in-progress' }"
              @click="statusFilter = 'in-progress'"
            >
              进行中
            </button>
            <button 
              class="filter-button" 
              :class="{ active: statusFilter === 'completed' }"
              @click="statusFilter = 'completed'"
            >
              已完成
            </button>
          </div>
        </div>
      </div>
      
      <div class="control-section">
        <div class="sort-control">
          <label for="sort-select">排序</label>
          <select id="sort-select" v-model="sortBy">
            <option value="deadline">截止日期</option>
            <option value="priority">优先级</option>
            <option value="progress">进度</option>
          </select>
        </div>
        
        <div class="view-toggle">
          <button 
            class="view-button" 
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            class="view-button" 
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="task-board-content" :class="viewMode">
      <div v-if="filteredTasks.length === 0" class="no-tasks">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <p>暂无任务</p>
      </div>
      
      <TaskCard 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task"
        @click="openTaskDetails(task)"
      />
    </div>
    
    <div v-if="selectedTask" class="task-details-modal">
      <div class="modal-backdrop" @click="selectedTask = null"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedTask.title }}</h2>
          <button class="close-button" @click="selectedTask = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="task-description">
            {{ selectedTask.description }}
          </div>
          
          <div class="task-metadata">
            <div class="metadata-item">
              <div class="metadata-label">优先级</div>
              <div class="metadata-value" :class="`priority-${selectedTask.priority}`">
                {{ priorityLabels[selectedTask.priority] }}
              </div>
            </div>
            
            <div class="metadata-item">
              <div class="metadata-label">状态</div>
              <div class="metadata-value" :class="`status-${selectedTask.status}`">
                {{ statusLabels[selectedTask.status] }}
              </div>
            </div>
            
            <div class="metadata-item">
              <div class="metadata-label">截止日期</div>
              <div class="metadata-value">
                {{ formatDate(selectedTask.deadline) }}
              </div>
            </div>
            
            <div class="metadata-item">
              <div class="metadata-label">负责人</div>
              <div class="metadata-value assignee">
                <div class="avatar" :style="{ backgroundImage: `url(${selectedTask.assignee.avatar})` }"></div>
                <span>{{ selectedTask.assignee.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="task-progress-section">
            <div class="progress-header">
              <div class="progress-label">进度</div>
              <div class="progress-percentage">{{ selectedTask.progress }}%</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${selectedTask.progress}%` }"></div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="button variant-secondary" @click="selectedTask = null">关闭</button>
          <button class="button variant-primary">编辑任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TaskCard from './TaskCard.vue';

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

// Filter and sort states
const priorityFilter = ref<string>('all');
const statusFilter = ref<string>('all');
const sortBy = ref<string>('deadline');
const viewMode = ref<string>('grid');
const selectedTask = ref<Task | null>(null);

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

// Mock tasks data
const tasks = ref<Task[]>([
  {
    id: '1',
    title: '市场调研报告',
    description: '针对新产品进行市场调研，分析竞品情况和目标用户需求，形成调研报告。',
    priority: 'high',
    status: 'in-progress',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    assignee: {
      id: 'user1',
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    progress: 65
  },
  {
    id: '2',
    title: '产品原型设计',
    description: '根据需求文档设计产品原型，包括用户界面和交互流程。',
    priority: 'medium',
    status: 'pending',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    assignee: {
      id: 'user2',
      name: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    progress: 0
  },
  {
    id: '3',
    title: '前端开发任务',
    description: '实现产品原型中的用户界面和交互功能，确保代码质量和性能。',
    priority: 'high',
    status: 'pending',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    assignee: {
      id: 'user3',
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    progress: 0
  },
  {
    id: '4',
    title: '用户测试',
    description: '组织用户测试，收集用户反馈，分析用户行为数据。',
    priority: 'low',
    status: 'pending',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
    assignee: {
      id: 'user4',
      name: '赵六',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
    },
    progress: 0
  },
  {
    id: '5',
    title: '产品发布准备',
    description: '准备产品发布所需的材料，包括产品文档、营销材料和发布计划。',
    priority: 'medium',
    status: 'pending',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
    assignee: {
      id: 'user5',
      name: '钱七',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    progress: 0
  },
  {
    id: '6',
    title: 'Bug修复',
    description: '修复测试中发现的Bug，确保产品质量。',
    priority: 'high',
    status: 'completed',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    assignee: {
      id: 'user3',
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    progress: 100
  }
]);

// Computed filtered tasks
const filteredTasks = computed(() => {
  return tasks.value
    .filter(task => {
      // Filter by priority
      if (priorityFilter.value !== 'all' && task.priority !== priorityFilter.value) {
        return false;
      }
      
      // Filter by status
      if (statusFilter.value !== 'all' && task.status !== statusFilter.value) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy.value === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy.value === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy.value === 'progress') {
        return b.progress - a.progress;
      }
      return 0;
    });
});

// Open task details
const openTaskDetails = (task: Task) => {
  selectedTask.value = task;
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
  
  // Otherwise, return the date in a short format
  return taskDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.task-board {
  width: 100%;
}

.task-board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-section {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.filter-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.filter-button.active {
  background: rgba(42, 63, 251, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.control-section {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sort-control label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.sort-control select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.sort-control select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
}

.view-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.view-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.view-button.active {
  background: rgba(42, 63, 251, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.task-board-content {
  display: grid;
  gap: var(--spacing-md);
}

.task-board-content.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.task-board-content.list {
  grid-template-columns: 1fr;
}

.no-tasks {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) 0;
  color: var(--color-text-secondary);
}

.no-tasks svg {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.task-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
}

.close-button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-normal);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.task-description {
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.task-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.metadata-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.metadata-value {
  font-weight: var(--font-weight-medium);
}

.metadata-value.priority-high {
  color: var(--color-error);
}

.metadata-value.priority-medium {
  color: var(--color-warning);
}

.metadata-value.priority-low {
  color: var(--color-success);
}

.metadata-value.status-pending {
  color: var(--color-text-secondary);
}

.metadata-value.status-in-progress {
  color: var(--color-primary);
}

.metadata-value.status-completed {
  color: var(--color-success);
}

.metadata-value.status-rejected {
  color: var(--color-error);
}

.metadata-value.assignee {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid var(--color-border);
}

.task-progress-section {
  margin-top: var(--spacing-lg);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.progress-percentage {
  font-weight: var(--font-weight-medium);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-small);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  border: none;
}

.variant-primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  color: var(--color-text-primary);
}

.variant-primary:hover {
  box-shadow: var(--shadow-button-hover);
  transform: translateY(-2px);
}

.variant-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-input);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.variant-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .task-board-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .task-board-content.grid {
    grid-template-columns: 1fr;
  }
  
  .task-metadata {
    grid-template-columns: 1fr;
  }
}
</style> 