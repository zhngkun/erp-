<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Picture, Refresh, Setting } from '@element-plus/icons-vue'
import {
  batchUpdateCustomerWithdraw,
  getCustomerWithdrawList,
  updateCustomerWithdraw,
} from '@/api/customerWithdraw'
import { PageList } from '@/components/page'

const STATUS_OPTIONS = [
  { value: '申请中', label: '申请中', type: 'warning' },
  { value: '审核通过', label: '审核通过', type: 'success' },
  { value: '审核拒绝', label: '审核拒绝', type: 'danger' },
  { value: '已取消', label: '已取消', type: 'info' },
]

const TYPE_OPTIONS = [
  { value: '银行卡', label: '银行卡' },
  { value: '微信', label: '微信' },
  { value: '支付宝', label: '支付宝' },
]

const PAY_STATUS_OPTIONS = [
  { value: '未打款', label: '未打款', type: 'warning' },
  { value: '已打款', label: '已打款', type: 'success' },
]

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const payVisible = ref(false)

const query = reactive({
  customerName: '',
  leaderName: '',
  leaderPhone: '',
  status: '',
  withdrawType: '',
  payStatus: '',
  page: 1,
  pageSize: 10,
})

const payForm = reactive({
  id: null,
  payRemark: '',
  payImgs: '',
})

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function payStatusType(status) {
  return PAY_STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
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
    const data = await getCustomerWithdrawList({ ...query })
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
  query.customerName = ''
  query.leaderName = ''
  query.leaderPhone = ''
  query.status = ''
  query.withdrawType = ''
  query.payStatus = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

async function handleAudit(row) {
  if (row.status !== '申请中') {
    ElMessage.warning('仅申请中可审核')
    return
  }
  try {
    const { value } = await ElMessageBox.prompt('请输入审核备注（可选）', '审核通过', {
      confirmButtonText: '通过',
      cancelButtonText: '取消',
      inputPlaceholder: '审核备注',
    })
    await updateCustomerWithdraw(row.id, {
      status: '审核通过',
      verifyRemark: value || '',
    })
    ElMessage.success('审核成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleRefuse(row) {
  if (row.status !== '申请中') return
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '审核拒绝', {
      confirmButtonText: '拒绝',
      cancelButtonText: '取消',
      inputPlaceholder: '审核备注',
      inputValidator: (v) => !!String(v || '').trim() || '请填写拒绝原因',
    })
    await updateCustomerWithdraw(row.id, {
      status: '审核拒绝',
      verifyRemark: value,
    })
    ElMessage.success('已拒绝')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAbandon(row) {
  if (row.status !== '审核通过' || row.payStatus === '已打款') {
    ElMessage.warning('仅审核通过且未打款可弃审')
    return
  }
  try {
    await ElMessageBox.confirm('确认弃审该提现申请？', '提示', {
      type: 'warning',
      confirmButtonText: '弃审',
      cancelButtonText: '取消',
    })
    await updateCustomerWithdraw(row.id, {
      status: '申请中',
      verifyTime: '',
      verifyRemark: '',
    })
    ElMessage.success('弃审成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

function openPay(row) {
  if (row.status !== '审核通过' || row.payStatus === '已打款') {
    ElMessage.warning('仅审核通过且未打款可打款')
    return
  }
  payForm.id = row.id
  payForm.payRemark = ''
  payForm.payImgs = row.paymentCode || ''
  payVisible.value = true
}

async function submitPay() {
  submitting.value = true
  try {
    await updateCustomerWithdraw(payForm.id, {
      payStatus: '已打款',
      payRemark: payForm.payRemark,
      payImgs: payForm.payImgs,
    })
    ElMessage.success('打款成功')
    payVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

function handleMoreCommand(command, row) {
  if (command === 'audit') handleAudit(row)
  else if (command === 'refuse') handleRefuse(row)
  else if (command === 'abandon') handleAbandon(row)
  else if (command === 'pay') openPay(row)
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选记录')
    return
  }
  try {
    if (command === 'audit') {
      await batchUpdateCustomerWithdraw(selectedIds.value, { status: '审核通过' })
      ElMessage.success('批量审核成功')
    }
    fetchList()
  } catch {
    /* cancel */
  }
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
        <el-form-item label="客户">
          <el-input
            v-model="query.customerName"
            clearable
            placeholder="请输入客户"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="负责人名称">
          <el-input
            v-model="query.leaderName"
            clearable
            placeholder="请输入负责人"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="query.leaderPhone"
            clearable
            placeholder="请输入联系电话"
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
        <el-form-item label="提现类型">
          <el-select
            v-model="query.withdrawType"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="打款状态">
          <el-select
            v-model="query.payStatus"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in PAY_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="wd-toolbar">
          <div class="wd-toolbar__left">
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="audit">批量审核</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="wd-toolbar__right">
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
        prop="customerName"
        label="客户"
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
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="提现金额" width="110" align="right">
        <template #default="{ row }">
          {{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawType"
        label="提现类型"
        width="100"
        align="center"
      />
      <el-table-column
        prop="bankName"
        label="银行卡"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column label="收款码" width="90" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.paymentCode"
            :src="row.paymentCode"
            fit="cover"
            class="pay-code"
            :preview-src-list="[row.paymentCode]"
          />
          <el-icon v-else class="pay-code-empty"><Picture /></el-icon>
        </template>
      </el-table-column>
      <el-table-column
        prop="verifyTime"
        label="审核时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="verifyRemark"
        label="审核备注"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="payStatus" label="打款状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="payStatusType(row.payStatus)">
            {{ row.payStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="打款时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-dropdown
              trigger="click"
              @command="(cmd) => handleMoreCommand(cmd, row)"
            >
              <el-button link type="primary">
                操作
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="row.status === '申请中'"
                    command="audit"
                  >
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === '申请中'"
                    command="refuse"
                  >
                    拒绝
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === '审核通过' && row.payStatus !== '已打款'"
                    command="abandon"
                  >
                    弃审
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === '审核通过' && row.payStatus !== '已打款'"
                    command="pay"
                  >
                    打款
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="payVisible"
      title="提现打款"
      width="480px"
      destroy-on-close
    >
      <el-form label-width="96px">
        <el-form-item label="打款凭证">
          <el-input
            v-model="payForm.payImgs"
            placeholder="凭证图片 URL（演示）"
          />
        </el-form-item>
        <el-form-item label="打款备注">
          <el-input
            v-model="payForm.payRemark"
            type="textarea"
            :rows="2"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="payVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitPay">
          确认打款
        </el-button>
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

.wd-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.wd-toolbar__left,
.wd-toolbar__right {
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

.pay-code {
  width: 36px;
  height: 36px;
  border-radius: 6px;
}

.pay-code-empty {
  font-size: 20px;
  color: var(--soft-text-muted);
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
