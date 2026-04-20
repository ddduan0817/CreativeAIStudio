# CreativeAI Studio

沉浸式创意写作工作台，支持小说、剧本、种草文案、知识科普等多场景 AI 辅助创作。

**在线体验：[https://creative-ai-studio-five.vercel.app/](https://creative-ai-studio-five.vercel.app/)**

## Features

- 多场景创作：小说、剧本、种草带货、知识科普、通用写作
- AI 实时对话：集成 Gemini 2.0 Flash，流式输出创作建议
- 富文本编辑器：基于 TipTap，支持格式化写作
- 智能降级：API 不可用时自动切换为 Mock 数据，保证体验流畅

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TipTap Editor
- Zustand
- Gemini API (streaming)

## Getting Started

```bash
npm install
npm run dev
```

在 `.env.local` 中配置：

```
GEMINI_API_KEY=your_api_key_here
```

## Deployment

已部署至 Vercel：[https://creative-ai-studio-five.vercel.app/](https://creative-ai-studio-five.vercel.app/)
