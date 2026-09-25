<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Setting } from '@element-plus/icons-vue'
import {
  batchDeleteCashPaymentMethod,
  batchUpdateCashPaymentMethod,
  createCashPaymentMethod,
  deleteCashPaymentMethod,
  getCashPaymentMethodList,
  updateCashPaymentMethod,
} from '@/api/cash'
import { PageList } from '@/components/page'

const TYPE_OPTIONS = [
  { value: '现金', label: '现金' },
  { value: '银行', label: '银行' },
  { value: '第三方', label: '第三方' },
]

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)

const query = reactive({
  name: '',
  code: '',
  enable: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  code: '',
  paytypeType: '银行',
  subjectName: '',
  currencyName: '人民币',
  startBalance: 0,
  priority: 10,
  enable: 1,
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增支付方式' : '编辑支付方式',
)
const selectedIds = computed(() => selectedRows.value.map((r) => r.id))

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
    const data = await getCashPaymentMethodList({ ...query })
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
  query.name = ''
  query.code = ''
  query.enable = ''
  query.page = 1
  fetchList()
}

function openCreate() {
  dialogMode.value = 'create'
  Object.assign(form, {
    id: null,
    name: '',
    code: '',
    paytypeType: '银行',
    subjectName: '',
    currencyName: '人民币',
    startBalance: 0,
    priority: 10,
    enable: 1,
    remark: '',
  })
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value?.validate?.()
  submitting.value = true
  try {
    if (dialogMode.value === 'create') {
      await createCashPaymentMethod({ ...form })
      ElMessage.success('新增成功')
    } else {
      await updateCashPaymentMethod(form.id, { ...form })
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteCashPaymentMethod(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleEnableChange(row, val) {
  const prev = row.enable
  row.enable = val
  try {
    await updateCashPaymentMethod(row.id, { enable: val })
    ElMessage.success(val ? '已启用' : '已停用')
  } catch {
    row.enable = prev
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选数据')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateCashPaymentMethod(selectedIds.value, { enable: 1 })
      ElMessage.success('批量启用成功')
    } else if (command === 'disable') {
      await batchUpdateCashPaymentMethod(selectedIds.value, { enable: 0 })
      ElMessage.success('批量停用成功')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 条？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteCashPaymentMethod(selectedIds.value)
      ElMessage.success('批量删除成功')
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
        <el-form-item label="名称">
          <el-input
            v-model="query.name"
            clearable
            placeholder="请输入名称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="编码">
          <el-input
            v-model="query.code"
            clearable
            placeholder="请输入编码"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="启用">
          <el-select
            v-model="query.enable"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
      </template>

      <template #header>
        <div class="order-toolbar">
          <div class="order-toolbar__left">
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
                  <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                  <el-dropdown-item command="disable">批量停用</el-dropdown-item>
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
        prop="name"
        label="名称"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="code" label="编码" width="110" />
      <el-table-column prop="paytypeType" label="类型" width="100" />
      <el-table-column
        prop="subjectName"
        label="会计科目"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column prop="currencyName" label="币种" width="90" />
      <el-table-column
        prop="startBalance"
        label="期初余额"
        width="120"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.startBalance) }}
        </template>
      </el-table-column>
      <el-table-column prop="income" label="收入" width="110" align="right">
        <template #default="{ row }">
          {{ formatAmount(row.income) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="expenditure"
        label="支出"
        width="110"
        align="right"
      >
        <template #default="{ row }">
          {{ formatAmount(row.expenditure) }}
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="120" align="right">
        <template #default="{ row }">
          {{ formatAmount(row.balance) }}
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="排序" width="80" align="center" />
      <el-table-column prop="enable" label="启用" width="90" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enable"
            :active-value="1"
            :inactive-value="0"
            @change="(val) => handleEnableChange(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" @click="openEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
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
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" clearable />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.paytypeType" style="width: 100%">
            <el-option
              v-for="item in TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会计科目">
          <el-input v-model="form.subjectName" clearable />
        </el-form-item>
        <el-form-item label="币种">
          <el-input v-model="form.currencyName" clearable />
        </el-form-item>
        <el-form-item label="期初余额">
          <el-input-number
            v-model="form.startBalance"
            :controls="false"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.priority" :min="0" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
            v-model="form.enable"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          保存
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

.order-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  gap: 2px;
  white-space: nowrap;
}

:deep(.page-head__meta) {
  flex: 1;
  min-width: 0;
}
</style>
