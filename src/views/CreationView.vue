<template>
  <Layout>
    <div class="creation-view">
      <div class="page-header">
        <h1>创作模块</h1>
        <p class="page-description">使用AI增强的工具创建和编辑内容</p>
      </div>
      
      <div class="page-content">
        <div class="tools-grid">
          <div 
            v-for="tool in tools" 
            :key="tool.id" 
            class="tool-card"
            :class="tool.category"
            @click="selectTool(tool.id)"
          >
            <div class="tool-icon">
              <component :is="tool.icon" />
            </div>
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Layout from '@/components/common/Layout.vue';

// Tool icons as components
const DocumentIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `
};

const DataIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  `
};

const ImageIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `
};

const PresentationIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3h18v18H3z"></path>
      <path d="M3 9h18"></path>
      <path d="M15 3v18"></path>
    </svg>
  `
};

const WorkflowIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
      <line x1="10" y1="7" x2="14" y2="7"></line>
      <line x1="7" y1="10" x2="7" y2="14"></line>
      <line x1="14" y1="17" x2="10" y2="17"></line>
      <line x1="17" y1="10" x2="17" y2="14"></line>
    </svg>
  `
};

const CodeIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  `
};

// Mock tools data
const tools = ref([
  {
    id: 'doc-writer',
    name: '智能文档助手',
    description: '使用AI辅助撰写各类文档，包括报告、文章和提案。',
    category: 'document',
    icon: DocumentIcon
  },
  {
    id: 'data-analyzer',
    name: '数据分析工具',
    description: '分析和可视化数据，自动生成洞察和报告。',
    category: 'data',
    icon: DataIcon
  },
  {
    id: 'image-creator',
    name: '图像生成器',
    description: '根据文本描述生成高质量图像和插图。',
    category: 'image',
    icon: ImageIcon
  },
  {
    id: 'presentation-maker',
    name: '演示文稿制作',
    description: '快速创建专业的演示文稿，自动排版和设计。',
    category: 'presentation',
    icon: PresentationIcon
  },
  {
    id: 'workflow-designer',
    name: '工作流设计器',
    description: '设计和优化业务流程，自动化重复任务。',
    category: 'workflow',
    icon: WorkflowIcon
  },
  {
    id: 'code-generator',
    name: '代码生成器',
    description: '根据需求描述生成代码，提高开发效率。',
    category: 'code',
    icon: CodeIcon
  }
]);

// Tool selection
const selectTool = (toolId) => {
  console.log('Selected tool:', toolId);
  // Here you would navigate to the tool's page or open a modal
};
</script>

<style scoped>
.creation-view {
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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.tool-card {
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  padding: var(--spacing-lg);
  transition: var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--color-border-glow);
}

.tool-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.tool-card.document .tool-icon {
  color: var(--color-primary);
  background: rgba(42, 63, 251, 0.1);
}

.tool-card.data .tool-icon {
  color: var(--color-secondary);
  background: rgba(22, 214, 251, 0.1);
}

.tool-card.image .tool-icon {
  color: var(--color-secondary-alt);
  background: rgba(140, 20, 252, 0.1);
}

.tool-card.presentation .tool-icon {
  color: var(--color-warning);
  background: rgba(251, 191, 36, 0.1);
}

.tool-card.workflow .tool-icon {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.tool-card.code .tool-icon {
  color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.tool-name {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-sm);
}

.tool-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style> 