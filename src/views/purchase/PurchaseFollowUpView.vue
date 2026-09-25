<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { getPurchaseFollowUpList } from '@/api/purchase'
import { PageList } from '@/components/page'
import { STATUS_OPTIONS } from './billConfigs'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  billCode: '',
  materialName: '',
  supplierName: '',
  status: '',
  page: 1,
  pageSize: 10,
})

function formatAmount(val) {
  if (val == null || val === '') return '—'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function statusType(status) {
  return STATUS_OPTIONS.find((i) => i.value === status)?.type || 'info'
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getPurchaseFollowUpList({ ...query })
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
  query.billCode = ''
  query.materialName = ''
  query.supplierName = ''
  query.status = ''
  query.page = 1
  fetchList()
}

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
        <el-form-item label="订单编号">
          <el-input
            v-model="query.billCode"
            clearable
            placeholder="请输入订单编号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="存货名称">
          <el-input
            v-model="query.materialName"
            clearable
            placeholder="请输入存货名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="query.supplierName"
            clearable
            placeholder="请输入供应商"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
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
      </template>

      <template #header>
        <div class="order-toolbar">
          <div class="order-toolbar__left">
            <el-button type="primary" plain @click="ElMessage.info('催货待开发')">
              催货
            </el-button>
            <el-button plain @click="ElMessage.info('导出待开发')">导出</el-button>
          </div>
          <div class="order-toolbar__right">
            <el-tooltip content="刷新" placement="top">
              <el-button circle :icon="Refresh" @click="fetchList" />
            </el-tooltip>
            <el-tooltip content="列设置" placement="top">
              <el-button
                circle
                :icon="Setting"
                @click="ElMessage.info('列设置待开发')"
              />
            </el-tooltip>
          </div>
        </div>
      </template>

      <el-table-column
        prop="billCode"
        label="订单编号"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column prop="billDate" label="单据日期" width="120" />
      <el-table-column
        prop="materialName"
        label="存货名称"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="spec"
        label="规格"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="code"
        label="编码"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="unitName" label="单位" width="70" />
      <el-table-column prop="number" label="订购数量" width="100" align="right" />
      <el-table-column
        prop="instockNumber"
        label="已入库"
        width="90"
        align="right"
      />
      <el-table-column
        prop="inTransitNumber"
        label="在途数量"
        width="100"
        align="right"
      />
      <el-table-column
        prop="taxCostPrice"
        label="含税单价"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.taxCostPrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="taxCostPriceTotal"
        label="价税合计"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.taxCostPriceTotal) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column prop="arrivalDate" label="约定到货" width="120" />
      <el-table-column prop="overdueDays" label="超期天数" width="100" align="right">
        <template #default="{ row }">
          <span :class="{ overdue: row.overdueDays > 0 }">
            {{ row.overdueDays }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createAdminName"
        label="创建人"
        width="90"
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button
              link
              type="primary"
              @click="ElMessage.info(`催货「${row.billCode}」待开发`)"
            >
              催货
            </el-button>
          </div>
        </template>
      </el-table-column>
    </PageList>
  </div>
</template>

<style scoped>
.page-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.order-toolbar__left,
.order-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-actions {
  display: inline-flex;
  align-items: center;
}

.overdue {
  color: var(--el-color-danger);
  font-weight: 600;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
