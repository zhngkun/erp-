<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => route.meta?.title || '功能页面')
</script>

<template>
  <section class="placeholder soft-card">
    <h2 class="placeholder-title">{{ title }}</h2>
    <p class="placeholder-desc">菜单已接入，业务功能待开发。</p>
  </section>
</template>

<style scoped>
.placeholder {
  padding: 24px;
}

.placeholder-title {
  margin: 0 0 8px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--soft-text);
}

.placeholder-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--soft-text-muted);
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
}
</style>
