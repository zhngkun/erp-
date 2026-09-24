<script setup>
import { nextTick, ref, watch } from 'vue'
import { useTableHeight } from '@/composables/useTableHeight'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  stripe: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50],
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
})

const page = defineModel('page', { type: Number, default: 1 })
const pageSize = defineModel('pageSize', { type: Number, default: 10 })

const emit = defineEmits(['page-change', 'size-change'])

const tableWrapRef = ref(null)
const { tableHeight, updateHeight } = useTableHeight(tableWrapRef)

watch(
  () => props.data,
  async () => {
    await nextTick()
    updateHeight()
  },
)

function onPageChange(val) {
  page.value = val
  emit('page-change', val)
}

function onSizeChange(val) {
  pageSize.value = val
  page.value = 1
  emit('size-change', val)
}

defineExpose({
  updateHeight,
})
</script>

<template>
  <section class="page-table">
    <div
      v-if="title || description || $slots.header || $slots.actions"
      class="page-head"
    >
      <div class="page-head__meta">
        <slot name="header">
          <h2 v-if="title">{{ title }}</h2>
          <p v-if="description">{{ description }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="page-head__actions">
        <slot name="actions" />
      </div>
    </div>

    <div ref="tableWrapRef" class="table-wrap">
      <el-table
        v-loading="loading"
        :data="data"
        :height="tableHeight"
        :stripe="stripe"
        style="width: 100%"
      >
        <slot />
      </el-table>
    </div>

    <div v-if="showPagination" class="pager">
      <el-pagination
        background
        :layout="paginationLayout"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
  </section>
</template>

<style scoped>
.page-table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  padding: 14px 16px;
  overflow: hidden;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.page-head h2 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--soft-text);
}

.page-head p {
  margin: 4px 0 0;
  color: var(--soft-text-muted);
  font-size: 0.75rem;
}

.page-head__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  flex-shrink: 0;
}

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: var(--soft-table-header);
  border-radius: 0.75rem;
}

:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell) {
  padding: 8px 0;
}

:deep(.el-table th.el-table__cell) {
  color: var(--soft-text-secondary);
  font-weight: 600;
}

:deep(.el-pagination.is-background .el-pager li),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
  border-radius: 10px;
  border: 0;
  background: var(--soft-fill);
  color: var(--soft-text-secondary);
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background: var(--soft-primary);
  box-shadow: var(--soft-shadow-primary);
  color: #ffffff;
}

html.dark :deep(.el-pagination.is-background .el-pager li.is-active) {
  color: #0f172a;
}

@media (max-width: 768px) {
  .page-table {
    padding: 12px;
  }

  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
