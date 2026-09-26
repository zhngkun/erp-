<script setup>
import { ref, watch } from 'vue'
import AccountingListView from './AccountingListView.vue'

const TABS = [
  { name: 'subjectBalance', label: '科目余额' },
  { name: 'generalLedger', label: '总账' },
]

const activeTab = ref('subjectBalance')
const listKey = ref(0)

watch(activeTab, () => {
  listKey.value += 1
})
</script>

<template>
  <div class="ledger-page">
    <div class="ledger-tabs card">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="tab in TABS"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </div>
    <AccountingListView :key="listKey" :record-key="activeTab" />
  </div>
</template>

<style scoped>
.ledger-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.ledger-tabs {
  padding: 4px 16px 0;
  border-radius: var(--soft-radius, 12px);
  background: var(--soft-surface, #fff);
  box-shadow: var(--soft-shadow-lg);
}

.ledger-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.ledger-page :deep(.page-list),
.ledger-page :deep(.page-root) {
  flex: 1;
  min-height: 0;
}
</style>
