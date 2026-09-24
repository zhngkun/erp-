<script setup>
import { useSlots } from 'vue'
import PageSearch from './PageSearch.vue'
import PageTable from './PageTable.vue'

defineProps({
  /** 检索表单 model，传给 PageSearch */
  query: {
    type: Object,
    default: () => ({}),
  },
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
})

const page = defineModel('page', { type: Number, default: 1 })
const pageSize = defineModel('pageSize', { type: Number, default: 10 })

const emit = defineEmits(['search', 'reset', 'page-change', 'size-change'])

const slots = useSlots()
const hasSearch = !!slots.search
</script>

<template>
  <div class="page-list" :class="{ 'is-plain': !hasSearch }">
    <PageSearch
      v-if="hasSearch"
      :model="query"
      @search="emit('search')"
      @reset="emit('reset')"
    >
      <slot name="search" />
    </PageSearch>

    <PageTable
      v-model:page="page"
      v-model:page-size="pageSize"
      :title="title"
      :description="description"
      :loading="loading"
      :data="data"
      :total="total"
      :stripe="stripe"
      :show-pagination="showPagination"
      :page-sizes="pageSizes"
      @page-change="emit('page-change', $event)"
      @size-change="emit('size-change', $event)"
    >
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
      <slot />
    </PageTable>
  </div>
</template>

<style scoped>
.page-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.page-list.is-plain {
  gap: 0;
}
</style>
