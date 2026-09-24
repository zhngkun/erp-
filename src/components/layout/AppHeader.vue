<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Fold, Expand, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTagsStore } from '@/stores/tags'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsStore = useTagsStore()

const collapsed = computed(() => appStore.sidebarCollapsed)
const isDark = computed(() => appStore.isDark)
const nickname = computed(() => userStore.userInfo?.nickname || '用户')

async function handleCommand(command) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出当前账号？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      })
      userStore.logout()
      tagsStore.reset()
      router.replace('/login')
    } catch {
      /* cancel */
    }
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button
        class="icon-btn"
        type="button"
        aria-label="切换侧边栏"
        @click="appStore.toggleSidebar()"
      >
        <el-icon :size="18">
          <component :is="collapsed ? Expand : Fold" />
        </el-icon>
      </button>
      <AppBreadcrumb />
    </div>

    <div class="header-right">
      <button
        class="icon-btn"
        type="button"
        :aria-label="isDark ? '切换日间模式' : '切换夜间模式'"
        :title="isDark ? '日间模式' : '夜间模式'"
        @click="appStore.toggleTheme()"
      >
        <el-icon :size="18">
          <component :is="isDark ? Sunny : Moon" />
        </el-icon>
      </button>

      <el-dropdown trigger="click" @command="handleCommand">
        <button class="user-trigger" type="button">
          <span class="avatar">{{ nickname.slice(0, 1).toUpperCase() }}</span>
          <span class="name">{{ nickname }}</span>
          <el-icon><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  padding: 8px 12px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.icon-btn,
.user-trigger {
  border: 0;
  background: var(--soft-fill);
  cursor: pointer;
  font: inherit;
  color: var(--soft-text-secondary);
  transition: all 0.2s ease-in-out;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
}

.icon-btn:hover,
.user-trigger:hover {
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow-primary);
  color: var(--soft-primary);
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--soft-primary-light);
  color: var(--soft-primary);
  font-weight: 700;
  font-size: 0.8125rem;
}

.name {
  font-weight: 600;
  color: var(--soft-text);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .app-header {
    padding: 8px 10px;
  }

  .name {
    display: none;
  }
}
</style>
