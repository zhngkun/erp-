<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { getStockFlowList } from '@/api/stock'
import { PageList } from '@/components/page'

const CHANGE_TYPES = ['入库', '出库', '盘盈', '盘亏', '锁定', '释放']

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  materialName: '',
  billCode: '',
  changeType: '',
  stockName: '',
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

async function fetchList() {
  loading.value = true
  try {
    const data = await getStockFlowList({ ...query })
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
  query.materialName = ''
  query.billCode = ''
  query.changeType = ''
  query.stockName = ''
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
        <el-form-item label="存货名称">
          <el-input
            v-model="query.materialName"
            clearable
            placeholder="请输入存货名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input
            v-model="query.billCode"
            clearable
            placeholder="请输入单据编号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="仓库">
          <el-input
            v-model="query.stockName"
            clearable
            placeholder="请输入仓库"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="变动类型">
          <el-select
            v-model="query.changeType"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in CHANGE_TYPES"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div />
          <div class="order-toolbar__right">
            <el-tooltip content="导出" placement="top">
              <el-button circle @click="ElMessage.info('导出待开发')">
                导
              </el-button>
            </el-tooltip>
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
      <el-table-column prop="stockName" label="仓库" min-width="100" />
      <el-table-column prop="locationName" label="货位" width="100" />
      <el-table-column prop="billType" label="单据类型" width="110" />
      <el-table-column
        prop="billCode"
        label="单据编号"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column prop="personName" label="经办人" width="90" />
      <el-table-column
        prop="personCode"
        label="经办人编码"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column prop="billOperateType" label="单据操作" width="100" />
      <el-table-column prop="changeType" label="变动类型" width="90" align="center">
        <template #default="{ row }">
          <el-tag
            size="small"
            effect="light"
            :type="
              ['入库', '盘盈', '释放'].includes(row.changeType)
                ? 'success'
                : 'warning'
            "
          >
            {{ row.changeType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="beforeNumber"
        label="变动前"
        width="90"
        align="right"
      />
      <el-table-column prop="number" label="变动数量" width="90" align="right" />
      <el-table-column
        prop="afterNumber"
        label="变动后"
        width="90"
        align="right"
      />
      <el-table-column prop="unitName" label="单位" width="70" />
      <el-table-column
        prop="beforePrice"
        label="变动前单价"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.beforePrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="afterPrice"
        label="变动后单价"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.afterPrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="beforePriceTotal"
        label="变动前金额"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.beforePriceTotal) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="afterPriceTotal"
        label="变动后金额"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.afterPriceTotal) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="序列号"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="batchNumber"
        label="批次号"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createAdminName"
        label="创建人"
        width="90"
      />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        show-overflow-tooltip
      />
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
  width: 100%;
}

.order-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
