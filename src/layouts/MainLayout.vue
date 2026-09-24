<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useTagsStore } from '@/stores/tags'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppTags from '@/components/layout/AppTags.vue'

const route = useRoute()
const appStore = useAppStore()
const tagsStore = useTagsStore()

const collapsed = computed(() => appStore.sidebarCollapsed)

watch(
  () => route.fullPath,
  () => {
    tagsStore.addView(route)
  },
  { immediate: true },
)
</script>

<template>
  <div class="main-layout" :class="{ 'is-collapsed': collapsed }">
    <aside class="layout-aside">
      <AppSidebar />
    </aside>

    <section class="layout-main">
      <div class="layout-chrome">
        <AppHeader />
        <div class="chrome-divider" role="separator" />
        <AppTags />
      </div>
      <main class="layout-content">
        <div class="layout-page">
          <router-view v-slot="{ Component, route: currentRoute }">
            <transition name="fade-soft" mode="out-in">
              <keep-alive>
                <component :is="Component" :key="currentRoute.path" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--soft-bg);
}

.layout-aside {
  width: 220px;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
  padding: 8px 0 8px 8px;
  transition: width 0.3s ease-in-out;
}

.main-layout.is-collapsed .layout-aside {
  width: 76px;
  padding: 8px;
}

.layout-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-chrome {
  flex-shrink: 0;
  margin: 8px 12px 0;
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  overflow: hidden;
}

.chrome-divider {
  height: 1px;
  margin: 0 12px;
  background: var(--soft-divider);
}

.layout-content {
  flex: 1;
  min-height: 0;
  padding: 16px 12px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.layout-page {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.layout-page > * {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.fade-soft-enter-active,
.fade-soft-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}

.fade-soft-enter-from,
.fade-soft-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 768px) {
  .layout-aside {
    position: fixed;
    z-index: 40;
    height: 100%;
  }

  .main-layout.is-collapsed .layout-aside {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .layout-chrome {
    margin: 8px 8px 0;
  }

  .layout-content {
    padding: 8px;
  }
}
</style>
