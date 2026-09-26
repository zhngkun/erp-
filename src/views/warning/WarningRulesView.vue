<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import {
  createWarningRule,
  generateWarnings,
  getWarningRuleList,
  removeWarningRule,
  updateWarningRule,
} from '@/api/warning'
import { PageList } from '@/components/page'

const loading = ref(false)
const submitting = ref(false)
const generating = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)

const MODULE_OPTIONS = [
  { value: 'stock', label: '库存' },
  { value: 'purchase', label: '采购' },
  { value: 'sales', label: '销售' },
  { value: 'production', label: '生产' },
  { value: 'cash', label: '收付款' },
]

const query = reactive({ name: '', module: '', page: 1, pageSize: 10 })
const form = reactive({
  id: null,
  name: '',
  module: 'stock',
  warningType: '',
  threshold: 0,
  level: '中',
  enable: 1,
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  module: [{ required: true, message: '请选择模块', trigger: 'change' }],
  warningType: [{ required: true, message: '请输入预警类型', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getWarningRuleList({ ...query })
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
  query.module = ''
  query.page = 1
  fetchList()
}
function resetForm() {
  Object.assign(form, {
    id: null,
    name: '',
    module: 'stock',
    warningType: '',
    threshold: 0,
    level: '中',
    enable: 1,
    remark: '',
  })
}
function openCreate() {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}
function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const { id, ...payload } = form
      if (dialogMode.value === 'create') await createWarningRule(payload)
      else await updateWarningRule(id, payload)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchList()
    } finally {
      submitting.value = false
    }
  })
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除规则「${row.name}」？`, '提示', { type: 'warning' })
    await removeWarningRule(row.id)
    ElMessage.success('已删除')
    fetchList()
  } catch { /* cancel */ }
}

async function handleGenerate() {
  generating.value = true
  try {
    const data = await generateWarnings()
    ElMessage.success(`已按规则生成预警：新增 ${data.created || 0} 条`)
  } finally {
    generating.value = false
  }
}

function moduleLabel(v) {
  return MODULE_OPTIONS.find((i) => i.value === v)?.label || v
}

onMounted(fetchList)
</script>

<template>
  <div class="page-root">
    <PageList
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
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
        <el-form-item label="规则名称">
          <el-input v-model="query.name" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="query.module" clearable style="width: 140px">
            <el-option v-for="o in MODULE_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
      </template>
      <template #header>
        <div class="toolbar">
          <div>
            <el-button type="primary" :icon="Plus" @click="openCreate">新增规则</el-button>
            <el-button type="warning" plain :loading="generating" @click="handleGenerate">
              按规则生成预警
            </el-button>
          </div>
          <el-button circle :icon="Refresh" @click="fetchList" />
        </div>
      </template>

      <el-table-column prop="name" label="规则名称" min-width="140" />
      <el-table-column prop="module" label="模块" width="100">
        <template #default="{ row }">{{ moduleLabel(row.module) }}</template>
      </el-table-column>
      <el-table-column prop="warningType" label="预警类型" min-width="120" />
      <el-table-column prop="threshold" label="阈值" width="90" />
      <el-table-column prop="level" label="级别" width="80" />
      <el-table-column prop="enable" label="启用" width="80" align="center">
        <template #default="{ row }">{{ row.enable ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'create' ? '新增规则' : '编辑规则'" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="规则名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="模块" prop="module">
          <el-select v-model="form.module" style="width: 100%">
            <el-option v-for="o in MODULE_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警类型" prop="warningType"><el-input v-model="form.warningType" /></el-form-item>
        <el-form-item label="阈值"><el-input-number v-model="form.threshold" :min="0" /></el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.level" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-root { height: 100%; }
.toolbar { display: flex; justify-content: space-between; align-items: center; width: 100%; }
</style>
