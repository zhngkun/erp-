<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
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
  gap: 16px;
  margin: 16px 24px 0;
  padding: 14px 20px;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.icon-btn,
.user-trigger {
  border: 0;
  background: #f8fafc;
  cursor: pointer;
  font: inherit;
  color: #4b5563;
  transition: all 0.2s ease-in-out;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
}

.icon-btn:hover,
.user-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgb(79 70 229 / 0.2);
  color: #4f46e5;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 700;
}

.name {
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 640px) {
  .app-header {
    margin: 12px 12px 0;
    padding: 12px 14px;
  }

  .name {
    display: none;
  }
}
</style>
