<!--
	README for my_clock
	简洁说明：此文件采用中文，覆盖技术栈、架构概览、快速上手与开发说明
-->

# my_clock

一个基于 Next.js 的单页时间管理工具，整合了“当前时间显示”、“倒计时”和“待办事项（带本地持久化）”。使用现代 React + TypeScript + Tailwind CSS 构建，支持暗色/亮色主题切换与响应式布局。

---

## 快速概览

- 当前时间：实时更新（每秒），格式化日期/时间显示。
- 倒计时：支持时/分/秒设定，开始/暂停/继续/重置功能，精度适中（100ms 更新间隔）。
- 待办事项：增删改查，并通过内置的 API 路由持久化到 `storage/todos.json`。
- 主题切换：支持明/暗主题并持久化到 `localStorage`。

---

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Tailwind CSS 4 + PostCSS
- Node.js（文件系统作为本地存储）
- ESLint（静态分析）

---

## 架构概览

主要位于 `app/` 目录：

- `app/page.tsx`：主页面，负责布局和将各组件组合到页面中。
- `app/components/CurrentTime.tsx`：当前时间组件（客户端组件，`useEffect` 每秒更新）。
- `app/components/Countdown.tsx`：倒计时组件，支持输入/增减、开始/暂停/恢复/重置等交互（客户端组件）。
- `app/components/TodoList.tsx`：待办事项列表（客户端组件），通过内置 API 路由与 `storage/todos.json` 持久化。
- `app/components/ThemeToggle.tsx`：主题切换按钮，存储于 `localStorage` 并通过 `document.documentElement.classList` 应用暗色类。

服务端 API：

- `app/api/todos/route.ts`：REST 风格 API 路由，实现对 `storage/todos.json` 的 CRUD（文件读写）。

数据持久化：

- `storage/todos.json`：本地 JSON 文件作为简易“数据库”，仅供开发/演示用途，非生产级别数据存储方案。

---

## 项目文件结构（重点）

```
app/
 ├─ api/todos/route.ts        # CRUD API，使用文件系统持久化
 ├─ components/
 │   ├─ CurrentTime.tsx
 │   ├─ Countdown.tsx
 │   ├─ TodoList.tsx
 │   └─ ThemeToggle.tsx
 ├─ globals.css
 ├─ layout.tsx
 └─ page.tsx
storage/
 └─ todos.json                # 测试/示例数据文件
package.json
README.md
```

---

## 本地运行（快速上手）

> [!tip]
> 推荐 Node.js 18 或更高版本，或者您也可以使用 `bun`。以下命令在 Windows PowerShell 中可复制粘贴使用。

1. 安装依赖

```pwsh
npm install
# 或者 (若使用 bun)
bun install
```

2. 开发模式启动（默认端口 3000）

```pwsh
npm run dev
# 或 bun run dev
```

3. 在浏览器打开

```text
http://localhost:3000
```

4. 构建 / 生产运行

```pwsh
npm run build
npm run start
```

---

## API（示例）

所有 API 均位于 `/api/todos`，并使用 `storage/todos.json` 作为持久化目标。

- GET /api/todos
  - 返回所有 TODO 项（array）

- POST /api/todos
  - 添加新 TODO
  - 请求体： `{ "title": "任务标题" }`
  - 返回新建条目（201）

- PUT /api/todos
  - 更新 TODO（切换 completed）
  - 请求体： `{ "id": "xxx", "completed": true }`

- DELETE /api/todos?id={id}
  - 删除指定 ID 的 TODO

示例（curl）:

```bash
curl -X GET http://localhost:3000/api/todos
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title": "示例任务"}'
curl -X PUT http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"id": "1764859666117-xo7dhng","completed": true}'
curl -X DELETE "http://localhost:3000/api/todos?id=1764859666117-xo7dhng"
```

---

## 注意事项

> [!warning]
> 目前 `storage/todos.json` 只是用于本地开发演示，若部署到多实例或云端，需要替换为生产级数据存储（数据库、云存储或托管服务）。

> [!note]
> 在 Windows 环境（如 PowerShell）中运行时，确保 `storage` 目录对运行用户可写，且 `node` 进程具备读写权限。

---

## 开发指南（简要）

- 新增组件：在 `app/components` 下添加 `.tsx` 文件，若依赖服务端行为则放置为 server component，否则用 `'use client'` 标记。保持组件单一职责。
- API 扩展：在 `app/api` 下新增路由，使用 Next.js App Router 的 Route Handlers（`GET`, `POST`, `PUT`, `DELETE`）模式实现。
- 样式：使用 Tailwind CSS utility-first 样式，暗色模式通过 `document.documentElement` 上添加 `dark` 类控制。

---

## 部署建议

- 最简单的部署是使用 Vercel（Next.js 官方平台），将仓库连接到 Vercel 后直推即可。
- 若部署在其他容器或云提供商，注意替换持久化方案，并设置 Node.js 环境版本为 18+。
