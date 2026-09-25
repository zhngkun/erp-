<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Refresh, Search, Setting } from '@element-plus/icons-vue'
import {
  batchDeleteOpportunityEval,
  deleteOpportunityEval,
  getOpportunityEvalList,
  updateOpportunityEval,
} from '@/api/customerOpportunityEval'
import { PageList } from '@/components/page'

const STATUS_OPTIONS = [
  { value: '待评估', label: '待评估', type: 'info' },
  { value: '技术评估中', label: '技术评估中', type: 'warning' },
  { value: '工期评估中', label: '工期评估中', type: 'warning' },
  { value: '评估完成', label: '评估完成', type: 'success' },
]

const DEPT_OPTIONS = ['销售一部', '销售二部', '大客户部', '外贸部', '电商组']

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('detail')

const query = reactive({
  billCode: '',
  customerName: '',
  status: '',
  creator: '',
  remark: '',
  dateRange: [],
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  billCode: '',
  billDate: '',
  sourceBillType: '',
  sourceBillCode: '',
  customerName: '',
  customerCode: '',
  status: '待评估',
  creator: '',
  dept: '销售一部',
  remark: '',
})

const formRef = ref(null)
const formRules = {
  billDate: [{ required: true, message: '请选择单据日期', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'edit' ? '编辑机会评估' : '机会评估详情',
)

const isReadonly = computed(() => dialogMode.value === 'detail')

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

function statusType(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.type || 'info'
}

function canEdit(row) {
  return row.status !== '评估完成'
}

async function fetchList() {
  loading.value = true
  try {
    const [startDate, endDate] = query.dateRange || []
    const data = await getOpportunityEvalList({
      billCode: query.billCode,
      customerName: query.customerName,
      status: query.status,
      creator: query.creator,
      remark: query.remark,
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
  query.remark = ''
  query.dateRange = []
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.billCode = ''
  form.billDate = ''
  form.sourceBillType = ''
  form.sourceBillCode = ''
  form.customerName = ''
  form.customerCode = ''
  form.status = '待评估'
  form.creator = ''
  form.dept = '销售一部'
  form.remark = ''
}

function fillForm(row) {
  Object.assign(form, {
    id: row.id,
    billCode: row.billCode,
    billDate: row.billDate,
    sourceBillType: row.sourceBillType,
    sourceBillCode: row.sourceBillCode,
    customerName: row.customerName,
    customerCode: row.customerCode || '',
    status: row.status,
    creator: row.creator,
    dept: row.dept,
    remark: row.remark || '',
  })
}

function openDetail(row) {
  dialogMode.value = 'detail'
  fillForm(row)
  dialogVisible.value = true
}

function openEdit(row) {
  if (!canEdit(row)) {
    ElMessage.warning('评估完成的单据不可编辑')
    return
  }
  dialogMode.value = 'edit'
  fillForm(row)
  dialogVisible.value = true
}

async function submitForm() {
  if (isReadonly.value) {
    dialogVisible.value = false
    return
  }
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await updateOpportunityEval(form.id, {
        billDate: form.billDate,
        customerName: form.customerName,
        customerCode: form.customerCode,
        status: form.status,
        dept: form.dept,
        remark: form.remark,
      })
      ElMessage.success('更新成功')
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
    await deleteOpportunityEval(row.id)
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
    await batchDeleteOpportunityEval(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleAssocQuery(row) {
  ElMessage.info(
    `单据关联查询：${row.billCode}（来源 ${row.sourceBillCode || '--'}）待开发`,
  )
}

function handleSourceClick(row) {
  if (!row.sourceBillCode) return
  ElMessage.info(`查看来源单据 ${row.sourceBillCode} 待开发`)
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
            style="width: 140px"
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
        <el-form-item label="备注">
          <el-input
            v-model="query.remark"
            clearable
            placeholder="请输入备注"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>

      <template #header>
        <div class="eval-toolbar">
          <div class="eval-toolbar__left">
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
          </div>
          <div class="eval-toolbar__right">
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
      >
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">
            {{ row.billCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" width="120" />
      <el-table-column
        prop="sourceBillType"
        label="来源单据类型"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="sourceBillCode"
        label="来源单据"
        min-width="150"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button
            v-if="row.sourceBillCode"
            link
            type="primary"
            @click="handleSourceClick(row)"
          >
            {{ row.sourceBillCode }}
          </el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="status" label="状态" width="120" align="center">
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
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="canEdit(row)"
              link
              type="primary"
              @click="openEdit(row)"
            >
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
            <el-button link type="primary" @click="handleAssocQuery(row)">
              关联查询
            </el-button>
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
        :rules="isReadonly ? {} : formRules"
        label-width="110px"
      >
        <el-form-item label="单据编号">
          <el-input v-model="form.billCode" disabled />
        </el-form-item>
        <el-form-item label="单据日期" prop="billDate">
          <el-date-picker
            v-model="form.billDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            :disabled="isReadonly"
          />
        </el-form-item>
        <el-form-item label="来源单据类型">
          <el-input v-model="form.sourceBillType" disabled />
        </el-form-item>
        <el-form-item label="来源单据">
          <el-input v-model="form.sourceBillCode" disabled />
        </el-form-item>
        <el-form-item label="客户" prop="customerName">
          <el-input
            v-model="form.customerName"
            maxlength="80"
            placeholder="请输入客户名称"
            :disabled="isReadonly"
          />
        </el-form-item>
        <el-form-item label="客户编码">
          <el-input
            v-model="form.customerCode"
            maxlength="32"
            placeholder="可选"
            :disabled="isReadonly"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            style="width: 100%"
            :disabled="isReadonly"
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
          <el-input v-model="form.creator" disabled />
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="form.dept"
            style="width: 100%"
            :disabled="isReadonly"
          >
            <el-option
              v-for="item in DEPT_OPTIONS"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="请输入备注"
            :disabled="isReadonly"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ isReadonly ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="!isReadonly"
          type="primary"
          :loading="submitting"
          @click="submitForm"
        >
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

.eval-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.eval-toolbar__left,
.eval-toolbar__right {
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
