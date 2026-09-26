<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import {
  createSku,
  getSkuList,
  removeSku,
  updateSku,
} from '@/api/sku'
import { PageList } from '@/components/page'
import { exportRowsToCsv } from '@/utils/listToolkit'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)

const query = reactive({
  name: '',
  code: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  name: '',
  code: '',
  spec: '',
  unitName: '件',
  salePrice: 0,
  costPrice: 0,
  enable: 1,
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入SKU编码', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getSkuList({ ...query })
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
  query.page = 1
  fetchList()
}

function resetForm() {
  Object.assign(form, {
    id: null,
    name: '',
    code: '',
    spec: '',
    unitName: '件',
    salePrice: 0,
    costPrice: 0,
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
      if (dialogMode.value === 'create') {
        await createSku(payload)
        ElMessage.success('新增成功')
      } else {
        await updateSku(id, payload)
        ElMessage.success('保存成功')
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
    await ElMessageBox.confirm(`确认删除 SKU「${row.code}」？`, '提示', {
      type: 'warning',
    })
    await removeSku(row.id)
    ElMessage.success('已删除')
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleExport() {
  exportRowsToCsv(
    [
      { prop: 'name', label: 'SKU名称' },
      { prop: 'code', label: 'SKU编码' },
      { prop: 'spec', label: '规格' },
      { prop: 'unitName', label: '单位' },
      { prop: 'salePrice', label: '销售价' },
      { prop: 'costPrice', label: '成本价' },
      { prop: 'enable', label: '启用' },
      { prop: 'remark', label: '备注' },
    ],
    tableData.value,
    `SKU管理-${Date.now()}`,
    (row, col) => {
      if (col.prop === 'enable') return row.enable ? '是' : '否'
      return row[col.prop]
    },
  )
  ElMessage.success('已导出当前页')
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
        <el-form-item label="SKU名称">
          <el-input v-model="query.name" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="query.code" clearable @keyup.enter="handleSearch" />
        </el-form-item>
      </template>
      <template #header>
        <div class="order-toolbar">
          <el-button type="primary" :icon="Plus" @click="openCreate">新增SKU</el-button>
          <div>
            <el-button type="primary" plain @click="handleExport">导出</el-button>
            <el-button circle :icon="Refresh" @click="fetchList" />
          </div>
        </div>
      </template>

      <el-table-column prop="name" label="SKU名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="code" label="SKU编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="spec" label="规格" min-width="110" show-overflow-tooltip />
      <el-table-column prop="unitName" label="单位" width="80" />
      <el-table-column prop="salePrice" label="销售价" width="110" align="right" />
      <el-table-column prop="costPrice" label="成本价" width="110" align="right" />
      <el-table-column prop="enable" label="启用" width="80" align="center">
        <template #default="{ row }">{{ row.enable ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </PageList>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增SKU' : '编辑SKU'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="SKU名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="SKU编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unitName" />
        </el-form-item>
        <el-form-item label="销售价">
          <el-input-number v-model="form.salePrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="成本价">
          <el-input-number v-model="form.costPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-root {
  height: 100%;
}
.order-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
