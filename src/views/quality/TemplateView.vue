<script setup>
import { computed, ref, watch } from 'vue'
import QualityListView from './QualityListView.vue'

/** 线上独立页：首次/来料/巡检/出货报告模板 → 本地用 Tab 合并 */
const TABS = [
  { name: 'first', label: '首次报告模板' },
  { name: 'incoming', label: '来料报告模板' },
  { name: 'routing', label: '巡检报告模板' },
  { name: 'shipment', label: '出货报告模板' },
]

const activeTab = ref('first')
const listKey = ref(0)
const extraFilters = computed(() => ({ templateType: activeTab.value }))

watch(activeTab, () => {
  listKey.value += 1
})
</script>

<template>
  <div class="template-page">
    <div class="template-tabs card">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="tab in TABS"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </div>
    <QualityListView
      :key="listKey"
      record-key="template"
      :extra-filters="extraFilters"
    />
  </div>
</template>

<style scoped>
.template-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.template-tabs {
  padding: 4px 16px 0;
  border-radius: var(--soft-radius, 12px);
  background: var(--soft-surface, #fff);
  box-shadow: var(--soft-shadow-lg);
}

.template-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.template-page :deep(.page-list),
.template-page :deep(.page-root) {
  flex: 1;
  min-height: 0;
}
</style>
