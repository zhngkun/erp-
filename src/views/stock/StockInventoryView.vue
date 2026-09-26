<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { getStockInventoryList } from '@/api/stock'
import { PageList } from '@/components/page'

const TABS = [
  { name: 'total', label: '总仓库存' },
  { name: 'stock', label: '分仓库存' },
  { name: 'location', label: '货位库存' },
  { name: 'order', label: '订单库存' },
]

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const activeTab = ref('total')
const detailVisible = ref(false)
const detailRow = ref(null)

/** 货位库存 / 订单库存：按仓+货位维度展示 */
const isLocationLike = computed(
  () => activeTab.value === 'location' || activeTab.value === 'order',
)

const query = reactive({
  materialName: '',
  code: '',
  stockName: '',
  locationName: '',
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
    const data = await getStockInventoryList({
      tab: activeTab.value,
      materialName: query.materialName,
      code: query.code,
      stockName: query.stockName,
      locationName: query.locationName,
      page: query.page,
      pageSize: query.pageSize,
      ...(activeTab.value === 'order'
        ? { affiliatedOrganization: 'SaleOrder' }
        : {}),
    })
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
  query.code = ''
  query.stockName = ''
  query.locationName = ''
  query.page = 1
  fetchList()
}

function openDetail(row) {
  detailRow.value = { ...row }
  detailVisible.value = true
}

watch(activeTab, () => {
  query.page = 1
  fetchList()
})

onMounted(fetchList)
</script>

<template>
  <div class="page-root">
    <div class="inv-tabs card">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="tab in TABS"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
    </div>

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
        <el-form-item label="存货编码">
          <el-input
            v-model="query.code"
            clearable
            placeholder="请输入编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item v-if="activeTab !== 'total'" label="仓库">
          <el-input
            v-model="query.stockName"
            clearable
            placeholder="请输入仓库"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item v-if="isLocationLike" label="货位">
          <el-input
            v-model="query.locationName"
            clearable
            placeholder="请输入货位"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div class="order-toolbar__left" />
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
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="spec"
        label="规格"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column prop="cover" label="封面" width="80" align="center">
        <template #default>
          <span class="cover-placeholder">—</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="存货编码"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column prop="categoryName" label="分类" width="100" />
      <el-table-column prop="brandName" label="品牌" width="90" />
      <el-table-column
        prop="recommendSupplierName"
        label="推荐供应商"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="activeTab !== 'total'"
        prop="stockName"
        label="仓库"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isLocationLike"
        prop="locationName"
        label="货位"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="activeTab === 'order'"
        prop="ownerType"
        label="归属类型"
        width="110"
      />
      <el-table-column
        v-if="activeTab === 'order'"
        prop="ownerName"
        label="归属"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="numberTotal"
        label="主单位库存"
        width="110"
        align="right"
      />
      <el-table-column
        prop="showNumberTotal"
        label="库存量"
        width="100"
        align="right"
      />
      <el-table-column
        v-if="!isLocationLike"
        prop="inTransitNumber"
        label="在途数量"
        width="100"
        align="right"
      />
      <el-table-column
        prop="purchasePrice"
        label="采购单价"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.purchasePrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="averagePrice"
        label="库存单价"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.averagePrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="costPriceTotal"
        label="库存总价"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.costPriceTotal) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastInstockPrice"
        label="最近入库单价"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.lastInstockPrice) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="isLocationLike"
        prop="lastInstockPriceTotal"
        label="最近入库总价"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.lastInstockPriceTotal) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isLocationLike"
        prop="lastOutstockTime"
        label="最近出库时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button
              v-if="activeTab !== 'order'"
              link
              type="primary"
              @click="openDetail(row)"
            >
              详情
            </el-button>
            <el-button
              link
              type="primary"
              @click="ElMessage.info('序列号待开发')"
            >
              序列号
            </el-button>
            <el-button
              link
              type="primary"
              @click="ElMessage.info('批次待开发')"
            >
              批次
            </el-button>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-drawer
      v-model="detailVisible"
      title="库存详情"
      size="480px"
      destroy-on-close
    >
      <el-descriptions v-if="detailRow" :column="1" border>
        <el-descriptions-item label="存货名称">
          {{ detailRow.materialName }}
        </el-descriptions-item>
        <el-descriptions-item label="规格">
          {{ detailRow.spec }}
        </el-descriptions-item>
        <el-descriptions-item label="编码">
          {{ detailRow.code }}
        </el-descriptions-item>
        <el-descriptions-item label="分类">
          {{ detailRow.categoryName }}
        </el-descriptions-item>
        <el-descriptions-item label="品牌">
          {{ detailRow.brandName }}
        </el-descriptions-item>
        <el-descriptions-item label="推荐供应商">
          {{ detailRow.recommendSupplierName || '—' }}
        </el-descriptions-item>
        <el-descriptions-item v-if="detailRow.stockName" label="仓库">
          {{ detailRow.stockName }}
        </el-descriptions-item>
        <el-descriptions-item v-if="detailRow.locationName" label="货位">
          {{ detailRow.locationName }}
        </el-descriptions-item>
        <el-descriptions-item v-if="detailRow.ownerType" label="归属类型">
          {{ detailRow.ownerType }}
        </el-descriptions-item>
        <el-descriptions-item v-if="detailRow.ownerName" label="归属">
          {{ detailRow.ownerName }}
        </el-descriptions-item>
        <el-descriptions-item label="主单位库存">
          {{ detailRow.numberTotal }}
        </el-descriptions-item>
        <el-descriptions-item label="库存量">
          {{ detailRow.showNumberTotal }}
        </el-descriptions-item>
        <el-descriptions-item label="库存单价">
          {{ formatAmount(detailRow.averagePrice) }}
        </el-descriptions-item>
        <el-descriptions-item label="库存总价">
          {{ formatAmount(detailRow.costPriceTotal) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          {{ detailRow.remark || '—' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<style scoped>
.page-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 12px;
}

.inv-tabs {
  flex-shrink: 0;
  padding: 0 16px;
  border-radius: 16px;
  background: var(--soft-surface);
  box-shadow: var(--soft-shadow-lg);
}

.inv-tabs :deep(.el-tabs__header) {
  margin: 0;
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

.table-actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.cover-placeholder {
  color: var(--el-text-color-placeholder);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
