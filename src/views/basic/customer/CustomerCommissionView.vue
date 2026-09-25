<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Refresh, Setting } from '@element-plus/icons-vue'
import {
  getCustomerCommissionCustomerDetails,
  getCustomerCommissionSaleDetails,
  getCustomerCommissionSummary,
  getCustomerCommissionWithdrawDetails,
} from '@/api/customerCommission'
import { PageList } from '@/components/page'

const METRIC_COLUMNS = [
  {
    prop: 'commissionOne',
    label: '一级销售佣金',
    dialogType: 'sale',
  },
  {
    prop: 'commissionTwo',
    label: '二级销售佣金',
    dialogType: 'sale',
  },
  {
    prop: 'commissionTotal',
    label: '销售总佣金',
    dialogType: 'sale',
  },
  {
    prop: 'commissionAvailable',
    label: '客户可用佣金',
    dialogType: 'customer',
  },
  {
    prop: 'commissionWithdrawing',
    label: '客户提现中佣金',
    dialogType: 'customer',
  },
  {
    prop: 'commissionWithdrawn',
    label: '客户已提现佣金',
    dialogType: 'customer',
  },
  {
    prop: 'commissionTotalCustomer',
    label: '客户总佣金',
    dialogType: 'customer',
  },
  {
    prop: 'applyTotal',
    label: '总提现金额',
    dialogType: 'withdraw',
  },
  {
    prop: 'payTotal',
    label: '已支付金额',
    dialogType: 'withdraw',
  },
  {
    prop: 'unpayTotal',
    label: '未支付金额',
    dialogType: 'withdraw',
  },
  {
    prop: 'applyCancelTotal',
    label: '提现取消金额',
    dialogType: 'withdraw',
  },
  {
    prop: 'applyPassTotal',
    label: '申请通过金额',
    dialogType: 'withdraw',
  },
  {
    prop: 'applyRefuseTotal',
    label: '申请拒绝金额',
    dialogType: 'withdraw',
  },
]

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  dateRange: [],
  page: 1,
  pageSize: 10,
})

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailType = ref('sale')
const detailMetric = ref('')
const detailList = ref([])
const detailTotal = ref(0)
const detailQuery = reactive({
  billCode: '',
  customerName: '',
  leaderName: '',
  leader: '',
  status: '',
  payStatus: '',
  page: 1,
  pageSize: 10,
})

const detailTitle = computed(() => '明细')

function formatAmount(val) {
  if (val == null || val === '') return '0'
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function defaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 38)
  const p = (n) => String(n).padStart(2, '0')
  const fmt = (d) =>
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  return [fmt(start), fmt(end)]
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const data = await getCustomerCommissionSummary({
      startDate: startDate || '',
      endDate: endDate || '',
    })
    tableData.value = [data]
    total.value = 1
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchList()
}

function handleReset() {
  query.dateRange = defaultDateRange()
  fetchList()
}

function resetDetailQuery() {
  detailQuery.billCode = ''
  detailQuery.customerName = ''
  detailQuery.leaderName = ''
  detailQuery.leader = ''
  detailQuery.status = ''
  detailQuery.payStatus = ''
  detailQuery.page = 1
  detailQuery.pageSize = 10
}

async function fetchDetailList() {
  detailLoading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const base = {
      startDate: startDate || '',
      endDate: endDate || '',
      page: detailQuery.page,
      pageSize: detailQuery.pageSize,
    }
    let data
    if (detailType.value === 'sale') {
      data = await getCustomerCommissionSaleDetails({
        ...base,
        billCode: detailQuery.billCode,
        customerName: detailQuery.customerName,
        status: detailQuery.status,
      })
    } else if (detailType.value === 'customer') {
      data = await getCustomerCommissionCustomerDetails({
        ...base,
        customerName: detailQuery.customerName,
        leader: detailQuery.leader,
      })
    } else {
      data = await getCustomerCommissionWithdrawDetails({
        ...base,
        metric: detailMetric.value,
        customerName: detailQuery.customerName,
        leaderName: detailQuery.leaderName,
        status: detailQuery.status,
        payStatus: detailQuery.payStatus,
      })
    }
    detailList.value = data.list
    detailTotal.value = data.total
  } finally {
    detailLoading.value = false
  }
}

function openMetricDetail(col) {
  detailType.value = col.dialogType
  detailMetric.value = col.prop
  resetDetailQuery()
  detailVisible.value = true
  fetchDetailList()
}

function handleDetailSearch() {
  detailQuery.page = 1
  fetchDetailList()
}

function handleDetailReset() {
  resetDetailQuery()
  fetchDetailList()
}

onMounted(() => {
  query.dateRange = defaultDateRange()
  fetchList()
})
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
      :show-pagination="false"
      @search="handleSearch"
      @reset="handleReset"
      @page-change="fetchList"
      @size-change="fetchList"
    >
      <template #search>
        <el-form-item label="单据日期">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="comm-toolbar">
          <div class="comm-toolbar__left" />
          <div class="comm-toolbar__right">
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
        v-for="col in METRIC_COLUMNS"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        min-width="130"
        align="right"
      >
        <template #default="{ row }">
          <button
            type="button"
            class="metric-cell"
            @click="openMetricDetail(col)"
          >
            <span>{{ formatAmount(row[col.prop]) }}</span>
            <el-icon class="metric-cell__icon"><ArrowDown /></el-icon>
          </button>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="detailVisible"
      :title="detailTitle"
      width="85vw"
      top="5vh"
      destroy-on-close
      class="comm-detail-dialog"
      @closed="detailList = []"
    >
      <div class="detail-body">
        <PageList
          v-model:page="detailQuery.page"
          v-model:page-size="detailQuery.pageSize"
          search-text="搜索"
          :query="detailQuery"
          :loading="detailLoading"
          :data="detailList"
          :total="detailTotal"
          @search="handleDetailSearch"
          @reset="handleDetailReset"
          @page-change="fetchDetailList"
          @size-change="fetchDetailList"
        >
          <template #search>
            <template v-if="detailType === 'sale'">
              <el-form-item label="单据编号">
                <el-input
                  v-model="detailQuery.billCode"
                  clearable
                  placeholder="请输入单据编号"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
              <el-form-item label="客户">
                <el-input
                  v-model="detailQuery.customerName"
                  clearable
                  placeholder="请输入客户"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
            </template>
            <template v-else-if="detailType === 'customer'">
              <el-form-item label="客户">
                <el-input
                  v-model="detailQuery.customerName"
                  clearable
                  placeholder="请输入客户"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
              <el-form-item label="负责人">
                <el-input
                  v-model="detailQuery.leader"
                  clearable
                  placeholder="请输入负责人"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="客户">
                <el-input
                  v-model="detailQuery.customerName"
                  clearable
                  placeholder="请输入客户"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
              <el-form-item label="负责人">
                <el-input
                  v-model="detailQuery.leaderName"
                  clearable
                  placeholder="请输入负责人"
                  @keyup.enter="handleDetailSearch"
                />
              </el-form-item>
            </template>
          </template>

          <template #header>
            <div class="detail-toolbar">
              <el-tooltip content="刷新" placement="top">
                <el-button circle :icon="Refresh" @click="fetchDetailList" />
              </el-tooltip>
              <el-tooltip content="列设置" placement="top">
                <el-button
                  circle
                  :icon="Setting"
                  @click="ElMessage.info('列设置待开发')"
                />
              </el-tooltip>
            </div>
          </template>

          <!-- 销售佣金明细 -->
          <template v-if="detailType === 'sale'">
            <el-table-column
              prop="billCode"
              label="单据编号"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column prop="billDate" label="单据日期" width="120" />
            <el-table-column
              prop="customerName"
              label="客户"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column
              prop="leaderName"
              label="负责人"
              min-width="100"
              show-overflow-tooltip
            />
            <el-table-column
              prop="leaderPhone"
              label="联系电话"
              min-width="130"
              show-overflow-tooltip
            />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag
                  size="small"
                  effect="light"
                  :type="row.status === '已审核' ? 'success' : 'warning'"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionOne"
              label="一级销售佣金"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionOne) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionOneLeaderName"
              label="一级负责人"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="commissionTwo"
              label="二级销售佣金"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionTwo) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionTwoLeaderName"
              label="二级负责人"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="commissionTotal"
              label="销售总佣金"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionTotal) }}
              </template>
            </el-table-column>
          </template>

          <!-- 客户佣金明细 -->
          <template v-else-if="detailType === 'customer'">
            <el-table-column
              prop="customerName"
              label="客户名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="leader"
              label="负责人名称"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="phone"
              label="联系电话"
              min-width="130"
              show-overflow-tooltip
            />
            <el-table-column
              prop="deptName"
              label="所属部门"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="adminName"
              label="所属员工"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="commissionAvailable"
              label="客户可用佣金"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionAvailable) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionWithdrawing"
              label="客户提现中佣金"
              width="130"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionWithdrawing) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionWithdrawn"
              label="客户已提现佣金"
              width="130"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionWithdrawn) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commissionTotal"
              label="客户总佣金"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.commissionTotal) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              min-width="120"
              show-overflow-tooltip
            />
          </template>

          <!-- 提现佣金明细 -->
          <template v-else>
            <el-table-column
              prop="customerName"
              label="客户名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="leaderName"
              label="负责人名称"
              min-width="110"
              show-overflow-tooltip
            />
            <el-table-column
              prop="leaderPhone"
              label="联系电话"
              min-width="130"
              show-overflow-tooltip
            />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="提现金额"
              width="110"
              align="right"
            >
              <template #default="{ row }">
                {{ formatAmount(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="payStatus"
              label="打款状态"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  size="small"
                  effect="light"
                  :type="row.payStatus === '已打款' ? 'success' : 'warning'"
                >
                  {{ row.payStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdAt"
              label="创建时间"
              min-width="170"
              show-overflow-tooltip
            />
          </template>
        </PageList>
      </div>
    </el-dialog>
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

.comm-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.comm-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.metric-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--soft-primary);
  cursor: pointer;
  font: inherit;
}

.metric-cell:hover {
  opacity: 0.85;
}

.metric-cell__icon {
  font-size: 14px;
}

.detail-body {
  height: min(70vh, 720px);
  min-height: 420px;
}

.detail-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
