<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'
import { menuRoutes } from '@/router/menus'
import { useAppStore } from '@/stores/app'
import { getModuleOverviewPath } from '@/config/flowcharts'

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

/** 父级菜单：展开的同时打开模块流程图页 */
function onParentClick(modulePath) {
  const target = getModuleOverviewPath(modulePath)
  if (target && target !== route.path) {
    router.push(target)
  }
}
</script>

<template>
  <div class="sidebar soft-panel" :class="{ 'is-collapsed': collapsed }">
    <div class="brand" @click="router.push('/dashboard')">
      <div class="brand-mark">
        <el-icon :size="18"><component :is="Icons.Box" /></el-icon>
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
          <!-- 有二级 -->
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon @click="onParentClick(item.path)">
                <component :is="resolveIcon(item.meta?.icon)" />
              </el-icon>
              <span class="menu-parent-label" @click="onParentClick(item.path)">
                {{ item.meta?.title }}
              </span>
            </template>

            <template v-for="child in item.children" :key="child.path">
              <!-- 三级：供应商 / 客户 / 存货 -->
              <el-sub-menu v-if="child.children?.length" :index="child.path">
                <template #title>
                  <el-icon><component :is="resolveIcon(child.meta?.icon)" /></el-icon>
                  <span>{{ child.meta?.title }}</span>
                </template>
                <el-menu-item
                  v-for="grand in child.children"
                  :key="grand.path"
                  :index="grand.path"
                >
                  <el-icon><component :is="resolveIcon(grand.meta?.icon)" /></el-icon>
                  <span>{{ grand.meta?.title }}</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item v-else :index="child.path">
                <el-icon><component :is="resolveIcon(child.meta?.icon)" /></el-icon>
                <span>{{ child.meta?.title }}</span>
              </el-menu-item>
            </template>
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
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.is-collapsed {
  margin: 0;
}

.soft-panel {
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
  cursor: pointer;
}

.sidebar.is-collapsed .brand {
  justify-content: center;
  padding: 12px 0 8px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--soft-primary-light);
  color: var(--soft-primary);
  flex-shrink: 0;
}

.brand-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--soft-text);
  line-height: 1.2;
}

.brand-sub {
  margin: 2px 0 0;
  font-size: 0.6875rem;
  color: var(--soft-text-muted);
}

.menu-scroll {
  flex: 1;
  padding-bottom: 8px;
}

.sidebar.is-collapsed .menu-scroll {
  padding-inline: 0;
}

.sidebar.is-collapsed :deep(.el-menu) {
  width: 100%;
}

.menu-parent-label {
  cursor: pointer;
  user-select: none;
}
</style>
