<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { createReportApi } from '@/api/report'
import { PageList } from '@/components/page'
import { LIST_CONFIGS, STATUS_OPTIONS } from './listConfigs'

const props = defineProps({
  recordKey: { type: String, required: true },
})

const config = computed(() => LIST_CONFIGS[props.recordKey])
const api = computed(() => createReportApi(props.recordKey))

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])

const query = reactive({
  billCode: '',
  status: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
  name: '',
  code: '',
  materialName: '',
  stockName: '',
  customerName: '',
  supplierName: '',
  productionOrderCode: '',
  procedureName: '',
  boardType: '',
  period: '',
  ownerName: '',
  metricName: '',
  completeStatus: '',
})

function statusType(status) {
  return STATUS_OPTIONS.find((i) => i.value === status)?.type || 'info'
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
    const [startDate, endDate] = query.dateRange || []
    const params = {
      billCode: query.billCode,
      status: query.status || query.completeStatus || '',
      startDate: startDate || '',
      endDate: endDate || '',
      page: query.page,
      pageSize: query.pageSize,
    }
    for (const key of config.value.searchKeys || []) {
      if (key !== 'billCode' && key !== 'status' && key !== 'completeStatus') {
        params[key] = query[key] || ''
      }
    }
    if ((config.value.searchKeys || []).includes('completeStatus')) {
      params.completeStatus = query.completeStatus || ''
    }
    const data = await api.value.getList(params)
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
  Object.keys(query).forEach((k) => {
    if (k === 'page') query.page = 1
    else if (k === 'pageSize') query.pageSize = 10
    else if (k === 'dateRange') query.dateRange = []
    else query[k] = ''
  })
  fetchList()
}

function pending(label) {
  ElMessage.info(`${label}待开发`)
}

function searchLabel(key) {
  const map = {
    billCode: '单据编号',
    name: '名称',
    code: '物料编码',
    materialName: '物料',
    stockName: '仓库',
    customerName: '客户',
    supplierName: '供应商',
    productionOrderCode: '生产订单',
    procedureName: '工序名称',
    boardType: '看板类型',
    period: '期间',
    ownerName: '负责人',
    metricName: '指标名称',
    status: '状态',
    completeStatus: '完工状态',
  }
  return map[key] || key
}

watch(
  () => props.recordKey,
  () => handleReset(),
)

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
      @selection-change="selectedRows = $event"
    >
      <template #search>
        <el-form-item v-if="config.dateSearch" label="单据日期">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item
          v-for="key in (config.searchKeys || []).filter(
            (k) => !['status', 'completeStatus'].includes(k),
          )"
          :key="key"
          :label="searchLabel(key)"
        >
          <el-input
            v-model="query[key]"
            clearable
            :placeholder="`请输入${searchLabel(key)}`"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item
          v-if="(config.searchKeys || []).includes('status')"
          label="状态"
        >
          <el-select
            v-model="query.status"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="(config.searchKeys || []).includes('completeStatus')"
          label="完工状态"
        >
          <el-select
            v-model="query.completeStatus"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option label="未完工" value="未完工" />
            <el-option label="已完工" value="已完工" />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="rpt-toolbar">
          <div class="rpt-toolbar__left">
            <span class="rpt-title">{{ config.title }}</span>
          </div>
          <div class="rpt-toolbar__right">
            <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
            <el-button :icon="Setting" @click="pending('列设置')">
              列设置
            </el-button>
            <el-button @click="pending('导出')">导出</el-button>
          </div>
        </div>
      </template>

      <el-table-column type="selection" width="48" fixed="left" />
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
            v-if="col.format === 'status'"
            :type="statusType(row[col.prop] || row.status)"
            effect="light"
            round
          >
            {{ row[col.prop] || row.status || '—' }}
          </el-tag>
          <span v-else>{{ cellValue(row, col) }}</span>
        </template>
      </el-table-column>
    </PageList>
  </div>
</template>

<style scoped>
.rpt-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.rpt-toolbar__left,
.rpt-toolbar__right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.rpt-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--soft-text, #1e293b);
}
</style>
