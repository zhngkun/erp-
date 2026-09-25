<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Plus,
  Refresh,
  Search,
  Setting,
} from '@element-plus/icons-vue'
import {
  batchDeleteOpportunity,
  createOpportunity,
  deleteOpportunity,
  getOpportunityList,
  pushOpportunity,
  updateOpportunity,
} from '@/api/customerOpportunity'
import { PageList } from '@/components/page'

const STATUS_OPTIONS = [
  { value: '草稿', label: '草稿', type: 'info' },
  { value: '跟进中', label: '跟进中', type: 'primary' },
  { value: '已报价', label: '已报价', type: 'warning' },
  { value: '谈判中', label: '谈判中', type: 'warning' },
  { value: '赢单', label: '赢单', type: 'success' },
  { value: '输单', label: '输单', type: 'danger' },
]

const DEPT_OPTIONS = ['销售一部', '销售二部', '大客户部', '外贸部', '电商组']

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const query = reactive({
  billCode: '',
  customerName: '',
  status: '',
  creator: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  billCode: '',
  billDate: '',
  customerName: '',
  customerCode: '',
  status: '草稿',
  creator: '当前用户',
  dept: '销售一部',
  amount: 0,
  remark: '',
})

const formRef = ref(null)
const formRules = {
  billDate: [{ required: true, message: '请选择单据日期', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增销售机会' : '编辑销售机会',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function todayStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const data = await getOpportunityList({
      billCode: query.billCode,
      customerName: query.customerName,
      status: query.status,
      creator: query.creator,
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
  query.status = ''
  query.creator = ''
  query.dateRange = []
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.billCode = ''
  form.billDate = todayStr()
  form.customerName = ''
  form.customerCode = ''
  form.status = '草稿'
  form.creator = '当前用户'
  form.dept = '销售一部'
  form.amount = 0
  form.remark = ''
}

function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    billCode: row.billCode,
    billDate: row.billDate,
    customerName: row.customerName,
    customerCode: row.customerCode || '',
    status: row.status,
    creator: row.creator,
    dept: row.dept,
    amount: row.amount ?? 0,
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
      const payload = {
        billDate: form.billDate,
        customerName: form.customerName,
        customerCode: form.customerCode,
        status: form.status,
        creator: form.creator,
        dept: form.dept,
        amount: form.amount,
        remark: form.remark,
      }
      if (dialogMode.value === 'create') {
        await createOpportunity(payload)
        ElMessage.success('新增成功')
      } else {
        await updateOpportunity(form.id, payload)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除单据「${row.billCode}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteOpportunity(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) query.page -= 1
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
  if (command !== 'delete') return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 张单据？`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    await batchDeleteOpportunity(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handlePushCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选单据')
    return
  }
  try {
    await pushOpportunity(selectedIds.value, command)
    ElMessage.success(command === 'eval' ? '已下推机会评估' : '已下推销售订单')
  } catch {
    /* error toasted */
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
        <el-form-item label="创建人">
          <el-input
            v-model="query.creator"
            clearable
            placeholder="请输入创建人"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="opp-toolbar">
          <div class="opp-toolbar__left">
            <el-button type="primary" :icon="Plus" @click="openCreate">
              新增
            </el-button>
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="primary" plain>
                批量
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown trigger="click" @command="handlePushCommand">
              <el-button type="primary" plain>
                下推
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="eval">下推机会评估</el-dropdown-item>
                  <el-dropdown-item command="order">下推销售订单</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="opp-toolbar__right">
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
            <el-tooltip content="高级筛选" placement="top">
              <el-button
                circle
                :icon="Search"
                @click="ElMessage.info('高级筛选待开发')"
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
      />
      <el-table-column prop="billDate" label="单据日期" width="120" />
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" effect="light" :type="statusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建人"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dept"
        label="部门"
        min-width="110"
        show-overflow-tooltip
      />
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
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="560px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="96px"
      >
        <el-form-item v-if="dialogMode === 'edit'" label="单据编号">
          <el-input v-model="form.billCode" disabled />
        </el-form-item>
        <el-form-item label="单据日期" prop="billDate">
          <el-date-picker
            v-model="form.billDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="客户" prop="customerName">
          <el-input
            v-model="form.customerName"
            maxlength="80"
            placeholder="请输入客户名称"
          />
        </el-form-item>
        <el-form-item label="客户编码">
          <el-input
            v-model="form.customerCode"
            maxlength="32"
            placeholder="可选"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option
              v-for="item in STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="form.dept" style="width: 100%">
            <el-option
              v-for="item in DEPT_OPTIONS"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预计金额">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            :step="1000"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="请输入备注"
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

.opp-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.opp-toolbar__left,
.opp-toolbar__right {
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

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
