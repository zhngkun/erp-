<script setup>
import { computed, ref, watch } from 'vue'
import OaListView from './OaListView.vue'

const SCOPE_TABS = [
  { name: 'messageSystem', label: '系统消息' },
  { name: 'messagePersonal', label: '个人消息' },
]

const DIRECTION_OPTIONS = [
  { value: 'received', label: '已接收' },
  { value: 'sent', label: '已发送' },
]

const activeScope = ref('messageSystem')
const direction = ref('received')
const listKey = ref(0)

const extraFilters = computed(() => ({ direction: direction.value }))

watch([activeScope, direction], () => {
  listKey.value += 1
})
</script>

<template>
  <div class="message-page">
    <div class="message-toolbar card">
      <el-tabs v-model="activeScope" class="scope-tabs">
        <el-tab-pane
          v-for="tab in SCOPE_TABS"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
      <el-radio-group v-model="direction" size="small">
        <el-radio-button
          v-for="opt in DIRECTION_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <OaListView
      :key="listKey"
      :record-key="activeScope"
      :extra-filters="extraFilters"
    />
  </div>
</template>

<style scoped>
.message-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.message-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 16px;
  border-radius: var(--soft-radius, 12px);
  background: var(--soft-surface, #fff);
  box-shadow: var(--soft-shadow-lg);
}

.scope-tabs {
  flex: 1;
  min-width: 0;
}

.scope-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.message-page :deep(.page-list),
.message-page :deep(.page-root) {
  flex: 1;
  min-height: 0;
}
</style>
