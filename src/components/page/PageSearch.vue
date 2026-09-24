<script setup>
import { Search, RefreshRight } from '@element-plus/icons-vue'

defineProps({
  /** 绑定检索表单 model */
  model: {
    type: Object,
    default: () => ({}),
  },
  searchText: {
    type: String,
    default: '查询',
  },
  resetText: {
    type: String,
    default: '重置',
  },
})

const emit = defineEmits(['search', 'reset'])

function onSearch() {
  emit('search')
}

function onReset() {
  emit('reset')
}
</script>

<template>
  <section class="page-search">
    <el-form :model="model" class="search-form" @submit.prevent="onSearch">
      <slot />
      <el-form-item class="search-actions">
        <slot name="actions">
          <el-button type="primary" :icon="Search" @click="onSearch">
            {{ searchText }}
          </el-button>
          <el-button :icon="RefreshRight" @click="onReset">
            {{ resetText }}
          </el-button>
        </slot>
      </el-form-item>
    </el-form>
  </section>
</template>

<style scoped>
.page-search {
  flex-shrink: 0;
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  padding: 14px 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  align-items: flex-end;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  color: var(--soft-text-secondary);
  font-weight: 500;
}

.search-actions :deep(.el-form-item__content) {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .page-search {
    padding: 12px;
  }
}
</style>
