# AI Table - 智能工作台

AI Table 是一个集成了任务管理、内容创作、团队协作和项目管理功能的智能工作台。通过 AI 增强的工具，帮助团队提高工作效率和创造力。

## 功能模块

- **执行模块**：任务管理和执行，包括任务分配、进度跟踪和优先级管理
- **创作模块**：AI 辅助内容创作工具，支持文档、数据、图像、演示文稿等多种内容类型
- **协同模块**：团队协作功能，包括实时编辑、文档共享和会议管理
- **管理模块**：项目和资源管理，包括团队管理、资源分配和进度监控

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
AI_Table/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 图片、样式等资源
│   ├── components/     # 组件
│   │   ├── common/     # 通用组件
│   │   ├── execution/  # 执行模块组件
│   │   ├── creation/   # 创作模块组件
│   │   ├── collaboration/ # 协同模块组件
│   │   └── management/ # 管理模块组件
│   ├── router/         # 路由配置
│   ├── views/          # 页面视图
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 设计风格

项目采用了 Glass Morphism 设计风格，具有以下特点：

- 半透明背景
- 模糊效果
- 细微边框
- 渐变色彩
- 现代化排版

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
