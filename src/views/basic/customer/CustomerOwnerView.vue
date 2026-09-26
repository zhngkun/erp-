<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Refresh, Setting } from '@element-plus/icons-vue'
import {
  batchDeleteCustomerOwner,
  batchUpdateCustomerOwner,
  deleteCustomerOwner,
  getCustomerOwnerList,
  updateCustomerOwner,
} from '@/api/customerOwner'
import { PageList } from '@/components/page'

const STATUS_OPTIONS = [
  { value: '已保存', label: '已保存', type: 'info' },
  { value: '已审核', label: '已审核', type: 'success' },
]

const SOURCE_OPTIONS = [
  { value: '系统添加', label: '系统添加' },
  { value: '邀请注册', label: '邀请注册' },
]

const SEX_OPTIONS = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
]

const BOOL_OPTIONS = [
  { value: 1, label: '是' },
  { value: 0, label: '否' },
]

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)

const query = reactive({
  customerName: '',
  leader: '',
  phone: '',
  status: '',
  sourceType: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  customerName: '',
  customerCode: '',
  leader: '',
  phone: '',
  email: '',
  sex: '男',
  status: '已保存',
  sourceType: '系统添加',
  enabled: 1,
  isSeeGeneralLedger: 0,
  isCommissionManage: 0,
  isMySubordinate: 0,
  isCustomerAccount: 0,
  isCheckCompanyOrder: 0,
  deptName: '',
  adminName: '',
  remark: '',
})

const formRef = ref(null)
const formRules = {
  customerName: [{ required: true, message: '请输入客户', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
}

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function yesNo(val) {
  return Number(val) === 1 ? '是' : '否'
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
    const data = await getCustomerOwnerList({ ...query })
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
  query.leader = ''
  query.phone = ''
  query.status = ''
  query.sourceType = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.customerName = ''
  form.customerCode = ''
  form.leader = ''
  form.phone = ''
  form.email = ''
  form.sex = '男'
  form.status = '已保存'
  form.sourceType = '系统添加'
  form.enabled = 1
  form.isSeeGeneralLedger = 0
  form.isCommissionManage = 0
  form.isMySubordinate = 0
  form.isCustomerAccount = 0
  form.isCheckCompanyOrder = 0
  form.deptName = ''
  form.adminName = ''
  form.remark = ''
}

function openEdit(row) {
  Object.assign(form, {
    id: row.id,
    customerName: row.customerName,
    customerCode: row.customerCode || '',
    leader: row.leader,
    phone: row.phone,
    email: row.email || '',
    sex: row.sex || '男',
    status: row.status,
    sourceType: row.sourceType,
    enabled: row.enabled,
    isSeeGeneralLedger: row.isSeeGeneralLedger ?? 0,
    isCommissionManage: row.isCommissionManage ?? 0,
    isMySubordinate: row.isMySubordinate ?? 0,
    isCustomerAccount: row.isCustomerAccount ?? 0,
    isCheckCompanyOrder: row.isCheckCompanyOrder ?? 0,
    deptName: row.deptName || '',
    adminName: row.adminName || '',
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const { id, ...payload } = form
      await updateCustomerOwner(id, payload)
      ElMessage.success('更新成功')
      dialogVisible.value = false
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleToggleEnabled(row, value) {
  const next = value ? 1 : 0
  const prev = row.enabled
  row.enabled = next
  try {
    await updateCustomerOwner(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确认删除负责人「${row.leader}」（${row.customerName}）？`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    await deleteCustomerOwner(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleAudit(row) {
  if (row.status !== '已保存') {
    ElMessage.warning('仅已保存状态可审核')
    return
  }
  try {
    await ElMessageBox.confirm(`确认审核负责人「${row.leader}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '审核',
      cancelButtonText: '取消',
    })
    await updateCustomerOwner(row.id, { status: '已审核' })
    ElMessage.success('审核成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleResetPwd(row) {
  try {
    await ElMessageBox.confirm(
      `确认重置「${row.leader}」的登录密码？`,
      '提示',
      { type: 'warning', confirmButtonText: '重置', cancelButtonText: '取消' },
    )
    ElMessage.success('密码已重置（演示）')
  } catch {
    /* cancel */
  }
}

function handleInviteRelation(row) {
  ElMessage.info(`邀请关系：${row.leader} 待开发`)
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选记录')
    return
  }
  try {
    if (command === 'audit') {
      await batchUpdateCustomerOwner(selectedIds.value, { status: '已审核' })
      ElMessage.success('批量审核成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条记录？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCustomerOwner(selectedIds.value)
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
  else if (command === 'resetPwd') handleResetPwd(row)
  else if (command === 'invite') handleInviteRelation(row)
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
            v-model="query.leader"
            clearable
            placeholder="请输入负责人名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="query.phone"
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
        <el-form-item label="来源">
          <el-select
            v-model="query.sourceType"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="item in SOURCE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="owner-toolbar">
          <div class="owner-toolbar__left">
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
          <div class="owner-toolbar__right">
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
      <el-table-column prop="enabled" label="是否启用" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enabled === 1"
            @change="(val) => handleToggleEnabled(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="sex" label="性别" width="70" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sourceType" label="来源" width="110" align="center">
        <template #default="{ row }">
          <el-tag
            size="small"
            effect="light"
            :type="row.sourceType === '邀请注册' ? 'success' : 'primary'"
          >
            {{ row.sourceType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="查看总账" width="100" align="center">
        <template #default="{ row }">
          {{ yesNo(row.isSeeGeneralLedger) }}
        </template>
      </el-table-column>
      <el-table-column label="查看佣金管理" width="120" align="center">
        <template #default="{ row }">
          {{ yesNo(row.isCommissionManage) }}
        </template>
      </el-table-column>
      <el-table-column label="查看我的下级" width="120" align="center">
        <template #default="{ row }">
          {{ yesNo(row.isMySubordinate) }}
        </template>
      </el-table-column>
      <el-table-column label="查看客户账单" width="120" align="center">
        <template #default="{ row }">
          {{ yesNo(row.isCustomerAccount) }}
        </template>
      </el-table-column>
      <el-table-column label="查看公司订单" width="120" align="center">
        <template #default="{ row }">
          {{ yesNo(row.isCheckCompanyOrder) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="所属部门"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="adminName"
        label="所属员工"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="commissionAvailable"
        label="可用佣金"
        min-width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.commissionAvailable) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commissionWithdrawing"
        label="提现中佣金"
        min-width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.commissionWithdrawing) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commissionWithdrawn"
        label="已提现佣金"
        min-width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.commissionWithdrawn) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commissionTotal"
        label="总佣金"
        min-width="110"
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
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
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
                    v-if="row.status === '已保存'"
                    command="audit"
                  >
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item command="resetPwd">重置密码</el-dropdown-item>
                  <el-dropdown-item command="invite">邀请关系</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
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
      v-model="dialogVisible"
      title="编辑客户负责人"
      width="640px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="客户" prop="customerName">
          <el-input v-model="form.customerName" />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="form.customerCode" disabled />
        </el-form-item>
        <el-form-item label="负责人名称" prop="leader">
          <el-input v-model="form.leader" maxlength="40" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" maxlength="32" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" maxlength="80" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" style="width: 100%">
            <el-option
              v-for="item in SEX_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :model-value="form.enabled === 1"
            @change="(val) => (form.enabled = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item label="查看总账">
          <el-select v-model="form.isSeeGeneralLedger" style="width: 100%">
            <el-option
              v-for="item in BOOL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查看佣金管理">
          <el-select v-model="form.isCommissionManage" style="width: 100%">
            <el-option
              v-for="item in BOOL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查看我的下级">
          <el-select v-model="form.isMySubordinate" style="width: 100%">
            <el-option
              v-for="item in BOOL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查看客户账单">
          <el-select v-model="form.isCustomerAccount" style="width: 100%">
            <el-option
              v-for="item in BOOL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查看公司订单">
          <el-select v-model="form.isCheckCompanyOrder" style="width: 100%">
            <el-option
              v-for="item in BOOL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="form.deptName" />
        </el-form-item>
        <el-form-item label="所属员工">
          <el-input v-model="form.adminName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          确定
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

.owner-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.owner-toolbar__left,
.owner-toolbar__right {
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
