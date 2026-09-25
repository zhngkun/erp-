<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Refresh, Setting } from '@element-plus/icons-vue'
import {
  batchDeleteCustomerOrder,
  batchUpdateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrderList,
  updateCustomerOrder,
} from '@/api/customerOrder'
import { PageList } from '@/components/page'

const STATUS_OPTIONS = [
  { value: '已保存', label: '已保存', type: 'info' },
  { value: '待审核', label: '待审核', type: 'warning' },
  { value: '已审核', label: '已审核', type: 'success' },
  { value: '审核拒绝', label: '审核拒绝', type: 'danger' },
  { value: '已取消', label: '已取消', type: 'info' },
]

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const detailVisible = ref(false)
const detailRow = ref(null)

const query = reactive({
  billCode: '',
  customerName: '',
  leaderName: '',
  status: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
})

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

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
    const [startDate, endDate] = query.dateRange || []
    const data = await getCustomerOrderList({
      billCode: query.billCode,
      customerName: query.customerName,
      leaderName: query.leaderName,
      status: query.status,
      startDate: startDate || '',
      endDate: endDate || '',
      page: query.page,
      pageSize: query.pageSize,
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
  query.billCode = ''
  query.customerName = ''
  query.leaderName = ''
  query.status = ''
  query.dateRange = []
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function openDetail(row) {
  detailRow.value = { ...row }
  detailVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除单据「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteCustomerOrder(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAudit(row) {
  if (row.status !== '待审核' && row.status !== '已保存') {
    ElMessage.warning('当前状态不可审核')
    return
  }
  try {
    await ElMessageBox.confirm(`确认审核通过「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '审核',
      cancelButtonText: '取消',
    })
    await updateCustomerOrder(row.id, { status: '已审核' })
    ElMessage.success('审核成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选单据')
    return
  }
  try {
    if (command === 'audit') {
      await batchUpdateCustomerOrder(selectedIds.value, { status: '已审核' })
      ElMessage.success('批量审核成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 张单据？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCustomerOrder(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'audit') handleAudit(row)
  else if (command === 'delete') handleDelete(row)
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
      @selection-change="selectedRows = $event"
    >
      <template #search>
        <el-form-item label="单据日期">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
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
        <el-form-item label="客户">
          <el-input
            v-model="query.customerName"
            clearable
            placeholder="请输入客户"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input
            v-model="query.leaderName"
            clearable
            placeholder="请输入负责人"
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
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="audit">批量审核</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    批量删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

      <el-table-column type="selection" width="48" />
      <el-table-column
        prop="billCode"
        label="单据编号"
        min-width="150"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">
            {{ row.billCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" width="120" />
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="leaderName"
        label="负责人"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column prop="qty" label="数量" width="80" align="right" />
      <el-table-column prop="amount" label="订单金额" width="120" align="right">
        <template #default="{ row }">
          {{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" type="primary" effect="light">
            {{ row.source }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openDetail(row)">
              详情
            </el-button>
            <el-dropdown
              trigger="click"
              @command="(cmd) => handleMoreCommand(cmd, row)"
            >
              <el-button link type="primary">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="row.status === '待审核' || row.status === '已保存'"
                    command="audit"
                  >
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="['已保存', '待审核', '审核拒绝'].includes(row.status)"
                    command="delete"
                    divided
                  >
                    <span class="danger-text">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="detailVisible"
      title="客户订单详情"
      width="560px"
      destroy-on-close
    >
      <el-descriptions v-if="detailRow" :column="2" border>
        <el-descriptions-item label="单据编号">
          {{ detailRow.billCode }}
        </el-descriptions-item>
        <el-descriptions-item label="单据日期">
          {{ detailRow.billDate }}
        </el-descriptions-item>
        <el-descriptions-item label="客户">
          {{ detailRow.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户编号">
          {{ detailRow.customerCode }}
        </el-descriptions-item>
        <el-descriptions-item label="负责人">
          {{ detailRow.leaderName }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detailRow.status }}
        </el-descriptions-item>
        <el-descriptions-item label="数量">
          {{ detailRow.qty }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">
          {{ formatAmount(detailRow.amount) }}
        </el-descriptions-item>
        <el-descriptions-item label="来源">
          {{ detailRow.source }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailRow.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ detailRow.remark || '—' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
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
  flex-wrap: wrap;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  white-space: nowrap;
}

.danger-text {
  color: var(--el-color-danger);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
