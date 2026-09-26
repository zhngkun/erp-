<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import {
  createCustomerMaterial,
  getCustomerMaterialList,
  removeCustomerMaterial,
  updateCustomerMaterial,
} from '@/api/customerMaterial'
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
  customerName: '',
  materialName: '',
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  customerName: '',
  customerCode: '',
  materialName: '',
  materialCode: '',
  customerMaterialName: '',
  customerMaterialCode: '',
  spec: '',
  unitName: '件',
  remark: '',
})

const formRules = {
  customerName: [{ required: true, message: '请输入客户', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getCustomerMaterialList({ ...query })
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
  query.materialName = ''
  query.page = 1
  fetchList()
}

function resetForm() {
  Object.assign(form, {
    id: null,
    customerName: '',
    customerCode: '',
    materialName: '',
    materialCode: '',
    customerMaterialName: '',
    customerMaterialCode: '',
    spec: '',
    unitName: '件',
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
        await createCustomerMaterial(payload)
        ElMessage.success('新增成功')
      } else {
        await updateCustomerMaterial(id, payload)
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
    await ElMessageBox.confirm('确认删除该客户物料映射？', '提示', {
      type: 'warning',
    })
    await removeCustomerMaterial(row.id)
    ElMessage.success('已删除')
    fetchList()
  } catch {
    /* cancel */
  }
}

function handleExport() {
  exportRowsToCsv(
    [
      { prop: 'customerName', label: '客户' },
      { prop: 'customerCode', label: '客户编码' },
      { prop: 'materialName', label: '物料名称' },
      { prop: 'materialCode', label: '物料编码' },
      { prop: 'customerMaterialName', label: '客品名称' },
      { prop: 'customerMaterialCode', label: '客品编码' },
      { prop: 'spec', label: '规格' },
      { prop: 'unitName', label: '单位' },
    ],
    tableData.value,
    `客户物料-${Date.now()}`,
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
        <el-form-item label="客户">
          <el-input
            v-model="query.customerName"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="物料">
          <el-input
            v-model="query.materialName"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
      </template>
      <template #header>
        <div class="order-toolbar">
          <el-button type="primary" :icon="Plus" @click="openCreate">
            新增客户物料
          </el-button>
          <div>
            <el-button type="primary" plain @click="handleExport">导出</el-button>
            <el-button circle :icon="Refresh" @click="fetchList" />
          </div>
        </div>
      </template>

      <el-table-column prop="customerName" label="客户" min-width="140" show-overflow-tooltip />
      <el-table-column prop="customerCode" label="客户编码" width="110" />
      <el-table-column prop="materialName" label="物料名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" min-width="120" />
      <el-table-column prop="customerMaterialName" label="客品名称" min-width="120" />
      <el-table-column prop="customerMaterialCode" label="客品编码" min-width="120" />
      <el-table-column prop="spec" label="规格" min-width="110" />
      <el-table-column prop="unitName" label="单位" width="80" />
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
      :title="dialogMode === 'create' ? '新增客户物料' : '编辑客户物料'"
      width="560px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="客户" prop="customerName">
          <el-input v-model="form.customerName" />
        </el-form-item>
        <el-form-item label="客户编码">
          <el-input v-model="form.customerCode" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="form.materialCode" />
        </el-form-item>
        <el-form-item label="客品名称">
          <el-input v-model="form.customerMaterialName" />
        </el-form-item>
        <el-form-item label="客品编码">
          <el-input v-model="form.customerMaterialCode" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unitName" />
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
