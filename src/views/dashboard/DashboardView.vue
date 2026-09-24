<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Odometer, User, Setting, Document } from '@element-plus/icons-vue'

const userStore = useUserStore()
const nickname = computed(() => userStore.userInfo?.nickname || '用户')

const stats = [
  { title: '今日待办', value: '12', icon: Document, tone: 'indigo' },
  { title: '系统用户', value: '86', icon: User, tone: 'emerald' },
  { title: '角色配置', value: '8', icon: Setting, tone: 'pink' },
  { title: '运行状态', value: '正常', icon: Odometer, tone: 'indigo' },
]
</script>

<template>
  <div class="dashboard">
    <section class="welcome soft-card">
      <div>
        <h2>你好，{{ nickname }}</h2>
        <p>这是 Soft UI 风格的 ERP 基础骨架，后续可在此扩展业务模块。</p>
      </div>
      <div class="welcome-badge">
        <el-icon :size="22"><Odometer /></el-icon>
      </div>
    </section>

    <section class="stat-grid">
      <article
        v-for="item in stats"
        :key="item.title"
        class="stat-card soft-card"
      >
        <div class="stat-icon" :data-tone="item.tone">
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
        </div>
        <div>
          <p class="stat-label">{{ item.title }}</p>
          <p class="stat-value">{{ item.value }}</p>
        </div>
      </article>
    </section>

    <section class="guide soft-card">
      <h3>后续扩展建议</h3>
      <ul>
        <li>在 <code>src/router</code> 增加业务路由与菜单</li>
        <li>在 <code>src/views</code> 按模块新建页面</li>
        <li>接入真实登录接口，替换 <code>stores/user.js</code> 中的 mock</li>
        <li>按需补充权限、字典、请求封装等基础设施</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  padding: 14px 16px;
  transition: all 0.3s ease-in-out;
}

.soft-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--soft-shadow-lg);
}

.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.welcome h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--soft-text);
}

.welcome p {
  margin: 4px 0 0;
  color: var(--soft-text-secondary);
  max-width: 42rem;
  font-size: 0.875rem;
}

.welcome-badge {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--soft-primary-light);
  color: var(--soft-primary);
  flex-shrink: 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-icon[data-tone='indigo'] {
  background: var(--soft-primary-light);
  color: var(--soft-primary);
}

.stat-icon[data-tone='emerald'] {
  background: var(--soft-status-on-bg);
  color: var(--soft-status-on-text);
}

.stat-icon[data-tone='pink'] {
  background: #fdf2f8;
  color: #db2777;
}

html.dark .stat-icon[data-tone='pink'] {
  background: #4a1942;
  color: #f9a8d4;
}

.stat-label {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--soft-text-muted);
}

.stat-value {
  margin: 2px 0 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--soft-text);
}

.guide h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  color: var(--soft-text);
}

.guide ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--soft-text-secondary);
  line-height: 1.6;
  font-size: 0.875rem;
}

.guide code {
  background: var(--soft-fill);
  border-radius: 0.5rem;
  padding: 2px 6px;
  color: var(--soft-primary);
}

@media (max-width: 1100px) {
  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .soft-card {
    padding: 12px;
  }
}
</style>
