<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getWarningList } from '@/api/warning'
import { PageList } from '@/components/page'
import { exportRowsToCsv } from '@/utils/listToolkit'
import { WARNING_CONFIGS } from './listConfigs'

const route = useRoute()
const warningKey = computed(
  () => route.meta.warningKey || route.path.split('/').pop() || 'stock',
)
const config = computed(() => WARNING_CONFIGS[warningKey.value] || WARNING_CONFIGS.stock)

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 10,
})

function levelType(level) {
  if (level === '高') return 'danger'
  if (level === '中') return 'warning'
  return 'info'
}

function formatAmount(val) {
  if (val == null || val === '') return '—'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function cellValue(row, col) {
  const val = row[col.prop]
  if (col.format === 'amount') return formatAmount(val)
  if (val == null || val === '') return '—'
  return val
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getWarningList(warningKey.value, { ...query })
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  fetchList()
}

function handleReset() {
  query.keyword = ''
  query.page = 1
  fetchList()
}

function handleExport() {
  exportRowsToCsv(config.value.columns, tableData.value, `${config.value.title}-${Date.now()}`, cellValue)
  ElMessage.success('已导出当前页')
}

watch(warningKey, () => {
  handleReset()
})

onMounted(fetchList)
</script>

<template>
  <div class="page-root">
    <PageList
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
      search-text="搜索"
      :query="query"
      :loading="loading"
      :data="tableData"
      :total="total"
      @search="handleSearch"
      @reset="handleReset"
      @page-change="fetchList"
      @size-change="fetchList"
    >
      <template #search>
        <el-form-item label="关键字">
          <el-input
            v-model="query.keyword"
            clearable
            placeholder="物料/单号/单位"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div class="order-toolbar__left">
            <span class="page-title">{{ config.title }}</span>
          </div>
          <div class="order-toolbar__right">
            <el-button type="primary" plain @click="handleExport">导出</el-button>
            <el-button circle :icon="Refresh" @click="fetchList" />
          </div>
        </div>
      </template>

      <el-table-column
        v-for="col in config.columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
        :width="col.width"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag
            v-if="col.prop === 'level'"
            size="small"
            effect="light"
            :type="levelType(row.level)"
          >
            {{ row.level }}
          </el-tag>
          <span v-else>{{ cellValue(row, col) }}</span>
        </template>
      </el-table-column>
    </PageList>
  </div>
</template>

<style scoped>
.page-root {
  height: 100%;
  min-height: 0;
}
.order-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.page-title {
  font-weight: 600;
}
</style>
