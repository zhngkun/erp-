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
      <AppHeader />
      <AppTags />
      <main class="layout-content">
        <router-view v-slot="{ Component, route: currentRoute }">
          <transition name="fade-soft" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="currentRoute.path" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </section>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: var(--soft-bg);
}

.layout-aside {
  width: 248px;
  flex-shrink: 0;
  transition: width 0.3s ease-in-out;
}

.main-layout.is-collapsed .layout-aside {
  width: 96px;
}

.layout-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.fade-soft-enter-active,
.fade-soft-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}

.fade-soft-enter-from,
.fade-soft-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 768px) {
  .layout-aside {
    position: fixed;
    z-index: 40;
    height: 100vh;
  }

  .main-layout.is-collapsed .layout-aside {
    width: 0;
    overflow: hidden;
  }

  .layout-content {
    padding: 16px;
  }
}
</style>
