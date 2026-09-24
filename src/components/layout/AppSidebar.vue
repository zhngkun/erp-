<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'
import { menuRoutes } from '@/router/menus'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const collapsed = computed(() => appStore.sidebarCollapsed)
const activeMenu = computed(() => route.path)

function resolveIcon(name) {
  return Icons[name] || Icons.Menu
}

function onSelect(path) {
  if (path && path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="sidebar soft-panel" :class="{ 'is-collapsed': collapsed }">
    <div class="brand" @click="router.push('/dashboard')">
      <div class="brand-mark">
        <el-icon :size="20"><component :is="Icons.Box" /></el-icon>
      </div>
      <div v-show="!collapsed" class="brand-text">
        <p class="brand-name">Soft ERP</p>
        <p class="brand-sub">管理后台</p>
      </div>
    </div>

    <el-scrollbar class="menu-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="false"
        @select="onSelect"
      >
        <template v-for="item in menuRoutes" :key="item.path">
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon><component :is="resolveIcon(item.meta?.icon)" /></el-icon>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="resolveIcon(child.meta?.icon)" /></el-icon>
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="resolveIcon(item.meta?.icon)" /></el-icon>
            <span>{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  margin: 16px 0 16px 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.is-collapsed {
  margin: 16px 12px;
}

.soft-panel {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 16px;
  cursor: pointer;
}

.sidebar.is-collapsed .brand {
  justify-content: center;
  padding: 20px 0 12px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #4f46e5;
  flex-shrink: 0;
}

.brand-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.brand-sub {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.menu-scroll {
  flex: 1;
  padding-bottom: 16px;
}

.sidebar.is-collapsed .menu-scroll {
  padding-inline: 0;
}

.sidebar.is-collapsed :deep(.el-menu) {
  width: 100%;
}
</style>
