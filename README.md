# 私域内容智能检索与对话服务

本项目旨在为顶层业务提供一个基于私域内容的智能检索与对话服务平台。利用先进的 RAG（检索增强生成）和 AI Agent 技术，我们为业务层客户提供了一个强大的工具，可以将任何私域内容（包括互联网内容）转换成一个Open API。

### 主要特点

- 支持多种文档格式（PDF、PPT、Word、Excel、图片等）的上传、存储和管理
- 文档版本控制，支持检索特定版本的内容
- 基于向量数据库的高效文档检索
- 利用大型语言模型（LLMs）生成智能回复
- 安全的 API 访问控制，支持第三方集成

## 技术栈

- **后端框架**：Next.js
- **数据库**：Supabase PostgreSQL
- **ORM**：Drizzle ORM
- **AI 集成**：Vercel AI SDK
- **身份验证**：自定义 Token 验证
- **部署平台**：Vercel/Docker

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 9+

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/MonkeyInWind/nest-rag.git
```

2. 安装依赖：

```bash
pnpm install
```

3. 配置环境变量：

创建 `.env.local` 文件，并添加以下内容：

```bash
DATABASE_URL=your_database_url
```

4. 如果更新数据库`schema`，则需要运行迁移：

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

第一个命令生成迁移文件，第二个命令执行迁移。

5. 启动开发服务器：

```bash
pnpm start
```

### 使用方法

1. 访问 `http://localhost:3000/api/docs` 查看 API 文档
2. 使用 API 文档中的接口进行文档上传、检索和对话

## 贡献

我们欢迎所有贡献者为这个项目做出贡献。请先阅读我们的贡献指南，然后提交一个 Pull Request。

## 许可证

本项目采用 MIT 许可证。
