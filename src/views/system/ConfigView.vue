<script setup>
import { computed, ref, watch } from 'vue'
import SystemListView from './SystemListView.vue'

/** 对齐线上 system 设置多 Tab（Service/Printer/Audit/Email…） */
const TABS = [
  { name: '服务配置', label: '服务' },
  { name: '打印机配置', label: '打印机' },
  { name: '考勤机配置', label: '考勤机' },
  { name: '审核配置', label: '审核' },
  { name: '会审配置', label: '会审' },
  { name: '词库配置', label: '词库' },
  { name: '单据编码规则', label: '单据规则' },
  { name: '序列号规则', label: '序列号' },
  { name: '整单佣金规则', label: '佣金规则' },
  { name: '邮箱配置', label: '邮箱' },
  { name: '数据推送', label: '数据推送' },
  { name: '关于我们', label: '关于我们' },
]

const activeModule = ref(TABS[0].name)
const listKey = ref(0)
const extraFilters = computed(() => ({ module: activeModule.value }))

watch(activeModule, () => {
  listKey.value += 1
})
</script>

<template>
  <div class="config-page">
    <div class="config-tabs card">
      <el-tabs v-model="activeModule">
        <el-tab-pane
          v-for="tab in TABS"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </div>
    <SystemListView
      :key="listKey"
      record-key="config"
      :extra-filters="extraFilters"
    />
  </div>
</template>

<style scoped>
.config-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.config-tabs {
  padding: 4px 16px 0;
  border-radius: var(--soft-radius, 12px);
  background: var(--soft-surface, #fff);
  box-shadow: var(--soft-shadow-lg);
}

.config-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.config-page :deep(.page-list),
.config-page :deep(.page-root) {
  flex: 1;
  min-height: 0;
}
</style>
