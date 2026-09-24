# Soft ERP 管理后台

Vue 3 + JavaScript + Vite + Element Plus 的 ERP 基础骨架，视觉遵循 Soft UI（柔和界面风）。

## 功能

- 登录页（本地 mock，任意账号密码可登录）
- 主布局：侧边栏 / 顶栏 / 面包屑 / Tags 页签
- 示例页面：工作台、用户管理（检索 + 分页）、角色管理
- 统一 `request` + Mock 开关（`src/mock/config.js` 的 `USE_MOCK`）

## 开发

需要 **Node.js >= 20**（推荐 22）。

```bash
nvm use 22
npm install
npm run dev
```

默认地址：http://localhost:5173

演示账号：`admin` / `123456`（任意非空也可）

## 目录

```
src/
  api/                 # 接口定义（与后端路径对齐）
  mock/                # 本地假数据与处理器
  utils/request.js     # axios 封装，USE_MOCK 时走 mock
  components/layout/   # 侧栏、顶栏、面包屑、Tags
  layouts/             # 主布局
  router/              # 路由与菜单
  stores/              # pinia：用户 / Tags / 侧栏
  styles/              # Soft UI + Element 覆盖
  views/               # 页面
```

## 后续扩展

1. 在 `src/router/index.js` 与 `src/router/menus.js` 增加路由/菜单
2. 在 `src/views` 新增业务页面
3. 在 `src/api` + `src/mock` 增加接口；接真后端时设 `USE_MOCK = false` 并配置 `VITE_API_BASE`
