<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Download,
  FullScreen,
  Plus,
  Refresh,
  Setting,
  Upload,
} from '@element-plus/icons-vue'
import { getSupplierCategoryList } from '@/api/supplierCategory'
import {
  batchDeleteSupplier,
  batchUpdateSupplier,
  createSupplier,
  deleteSupplier,
  getSupplierList,
  updateSupplier,
} from '@/api/supplier'
import { PageList } from '@/components/page'

const TYPE_OPTIONS = [
  { value: '企业', label: '企业' },
  { value: '个人', label: '个人' },
]

const STATUS_OPTIONS = [
  { value: '草稿', label: '草稿' },
  { value: '已审核', label: '已审核' },
  { value: '停用', label: '停用' },
]

const loading = ref(false)
const categoryLoading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const detailRow = ref(null)

const categories = ref([])
/** null = 全部 */
const activeCategoryId = ref(null)

const query = reactive({
  categoryId: '',
  name: '',
  code: '',
  type: '',
  status: '',
  filterZeroPayable: 0,
  page: 1,
  pageSize: 10,
})

const form = reactive({
  id: null,
  categoryId: null,
  name: '',
  code: '',
  type: '企业',
  org: '',
  status: '草稿',
  email: '',
  enabled: 1,
  openingPayable: 0,
  openingPayableBalance: 0,
  payableAmount: 0,
  paidAmount: 0,
  endingPayable: 0,
  prepaidBalance: 0,
  fax: '',
  taxNo: '',
  taxRate: null,
  discountProportion: null,
  openBank: '',
  accountNo: '',
  acceptanceNo: '',
  supplySafety: '',
  remark: '',
  lastPaymentTime: '',
  verifyData: '',
  sort: 0,
  contact: '',
  phone: '',
  address: '',
  managerCount: 0,
})

const formRef = ref(null)
const formRules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
}

const dialogTitle = computed(() =>
  dialogMode.value === 'create' ? '新增供应商' : '编辑供应商',
)

const selectedIds = computed(() => selectedRows.value.map((row) => row.id))

async function fetchCategories() {
  categoryLoading.value = true
  try {
    const data = await getSupplierCategoryList({
      page: 1,
      pageSize: 200,
      enabled: 1,
    })
    categories.value = data.list || []
  } finally {
    categoryLoading.value = false
  }
}

function selectCategory(id) {
  activeCategoryId.value = id
  query.categoryId = id == null ? '' : id
  query.page = 1
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const data = await getSupplierList({ ...query })
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
  query.type = ''
  query.status = ''
  query.filterZeroPayable = 0
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function resetForm() {
  form.id = null
  form.categoryId = activeCategoryId.value
  form.name = ''
  form.code = ''
  form.type = '企业'
  form.org = ''
  form.status = '草稿'
  form.email = ''
  form.enabled = 1
  form.openingPayable = 0
  form.openingPayableBalance = 0
  form.payableAmount = 0
  form.paidAmount = 0
  form.endingPayable = 0
  form.prepaidBalance = 0
  form.fax = ''
  form.taxNo = ''
  form.taxRate = null
  form.discountProportion = null
  form.openBank = ''
  form.accountNo = ''
  form.acceptanceNo = ''
  form.supplySafety = ''
  form.remark = ''
  form.lastPaymentTime = ''
  form.verifyData = ''
  form.sort = 0
  form.contact = ''
  form.phone = ''
  form.address = ''
  form.managerCount = 0
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
    categoryId: row.categoryId,
    name: row.name,
    code: row.code,
    type: row.type || '企业',
    org: row.org || '',
    status: row.status || '草稿',
    email: row.email || '',
    enabled: row.enabled,
    openingPayable: row.openingPayable ?? 0,
    openingPayableBalance: row.openingPayableBalance ?? 0,
    payableAmount: row.payableAmount ?? 0,
    paidAmount: row.paidAmount ?? 0,
    endingPayable: row.endingPayable ?? 0,
    prepaidBalance: row.prepaidBalance ?? 0,
    fax: row.fax || '',
    taxNo: row.taxNo || '',
    taxRate: row.taxRate ?? null,
    discountProportion: row.discountProportion ?? null,
    openBank: row.openBank || '',
    accountNo: row.accountNo || '',
    acceptanceNo: row.acceptanceNo || '',
    supplySafety: row.supplySafety || '',
    remark: row.remark || '',
    lastPaymentTime: row.lastPaymentTime || '',
    verifyData: row.verifyData || '',
    sort: row.sort ?? 0,
    contact: row.contact || '',
    phone: row.phone || '',
    address: row.address || '',
    managerCount: row.managerCount ?? 0,
  })
  dialogVisible.value = true
}

function openDetail(row) {
  detailRow.value = { ...row }
  detailVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        code: form.code,
        type: form.type,
        org: form.org,
        status: form.status,
        email: form.email,
        enabled: form.enabled,
        openingPayable: form.openingPayable,
        openingPayableBalance: form.openingPayableBalance,
        payableAmount: form.payableAmount,
        paidAmount: form.paidAmount,
        endingPayable: form.endingPayable,
        prepaidBalance: form.prepaidBalance,
        fax: form.fax,
        taxNo: form.taxNo,
        taxRate: form.taxRate,
        discountProportion: form.discountProportion,
        openBank: form.openBank,
        accountNo: form.accountNo,
        acceptanceNo: form.acceptanceNo,
        supplySafety: form.supplySafety,
        remark: form.remark,
        lastPaymentTime: form.lastPaymentTime,
        verifyData: form.verifyData,
        sort: form.sort,
        contact: form.contact,
        phone: form.phone,
        address: form.address,
        managerCount: form.managerCount,
      }
      if (dialogMode.value === 'create') {
        await createSupplier(payload)
        ElMessage.success('新增成功')
      } else {
        await updateSupplier(form.id, payload)
        ElMessage.success('更新成功')
      }
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
    await updateSupplier(row.id, { enabled: next })
    ElMessage.success(next === 1 ? '已启用' : '已停用')
  } catch {
    row.enabled = prev
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除供应商「${row.name}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteSupplier(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) {
      query.page -= 1
    }
    fetchList()
  } catch {
    /* cancel */
  }
}

async function handleBatchCommand(command) {
  if (!selectedIds.value.length) {
    ElMessage.warning('请先勾选供应商')
    return
  }
  try {
    if (command === 'enable') {
      await batchUpdateSupplier(selectedIds.value, { enabled: 1 })
      ElMessage.success('已批量启用')
    } else if (command === 'disable') {
      await batchUpdateSupplier(selectedIds.value, { enabled: 0 })
      ElMessage.success('已批量停用')
    } else if (command === 'delete') {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedIds.value.length} 个供应商？`,
        '提示',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
      )
      await batchDeleteSupplier(selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    fetchList()
  } catch {
    /* cancel or error */
  }
}

function handleMoreCommand(command, row) {
  if (command === 'edit') openEdit(row)
  else if (command === 'delete') handleDelete(row)
  else if (command === 'audit') ElMessage.info('审核功能待开发')
}

function handleImport() {
  ElMessage.info('导入功能待开发')
}

function handleExport() {
  ElMessage.info('导出功能待开发')
}

function handleFullscreen() {
  ElMessage.info('全屏功能待开发')
}

function categoryName(id) {
  if (id == null) return '未分类'
  return categories.value.find((item) => item.id === id)?.name || '—'
}

onMounted(async () => {
  await fetchCategories()
  fetchList()
})
</script>

<template>
  <div class="page-root">
    <div class="sup-layout">
      <aside v-loading="categoryLoading" class="sup-side">
        <div class="sup-side__list">
          <button
            type="button"
            class="sup-side__item"
            :class="{ 'is-active': activeCategoryId === null }"
            @click="selectCategory(null)"
          >
            <span class="sup-side__name">全部</span>
          </button>
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="sup-side__item"
            :class="{ 'is-active': item.id === activeCategoryId }"
            @click="selectCategory(item.id)"
          >
            <span class="sup-side__name">{{ item.name }}</span>
          </button>
          <div v-if="!categories.length" class="sup-side__empty">
            暂无分类
          </div>
        </div>
      </aside>

      <div class="sup-main">
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
            <el-form-item label="应付过滤">
              <el-select
                v-model="query.filterZeroPayable"
                style="width: 160px"
              >
                <el-option label="不过滤0应付" :value="0" />
                <el-option label="过滤0应付" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商名称">
              <el-input
                v-model="query.name"
                clearable
                placeholder="请输入供应商名称"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="供应商编码">
              <el-input
                v-model="query.code"
                clearable
                placeholder="请输入供应商编码"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="供应商类型">
              <el-select
                v-model="query.type"
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
            <div class="sup-toolbar">
              <div class="sup-toolbar__left">
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
                <el-button type="primary" plain :icon="Upload" @click="handleImport">
                  导入
                </el-button>
                <el-button type="primary" plain :icon="Download" @click="handleExport">
                  导出
                </el-button>
              </div>
              <div class="sup-toolbar__right">
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
                <el-tooltip content="全屏" placement="top">
                  <el-button circle :icon="FullScreen" @click="handleFullscreen" />
                </el-tooltip>
              </div>
            </div>
          </template>

          <el-table-column type="selection" width="48" />
          <el-table-column
            prop="name"
            label="供应商名称"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="code"
            label="供应商编码"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="managerCount"
            label="负责人数量"
            width="100"
            align="center"
          />
          <el-table-column prop="type" label="供应商类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="primary" effect="light">
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="org"
            label="所属组织"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                effect="light"
                :type="row.status === '已审核' ? 'primary' : row.status === '停用' ? 'info' : 'warning'"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="160"
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
            prop="openingPayable"
            label="期初应付"
            width="100"
            sortable
            align="right"
          />
          <el-table-column
            prop="openingPayableBalance"
            label="期初应付余额"
            width="120"
            sortable
            align="right"
          />
          <el-table-column
            prop="payableAmount"
            label="应付金额"
            width="100"
            sortable
            align="right"
          />
          <el-table-column
            prop="paidAmount"
            label="已付金额"
            width="100"
            sortable
            align="right"
          />
          <el-table-column
            prop="endingPayable"
            label="期末应付"
            width="100"
            sortable
            align="right"
          />
          <el-table-column
            prop="prepaidBalance"
            label="预付余额"
            width="100"
            sortable
            align="right"
          />
          <el-table-column
            prop="fax"
            label="传真"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="taxNo"
            label="纳税人识别号"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="taxRate"
            label="税率(%)"
            width="90"
            align="right"
          />
          <el-table-column
            prop="discountProportion"
            label="折扣比例(%)"
            width="110"
            align="right"
          />
          <el-table-column
            prop="openBank"
            label="开户银行"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="accountNo"
            label="账号"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="address"
            label="地址"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="acceptanceNo"
            label="承兑号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="supplySafety"
            label="供货保障"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="lastPaymentTime"
            label="最近付款时间"
            min-width="160"
            sortable
            show-overflow-tooltip
          />
          <el-table-column
            prop="verifyData"
            label="审核信息"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="sort" label="排序值" width="90" sortable />
          <el-table-column
            prop="createdAt"
            label="创建时间"
            min-width="170"
            sortable
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="150" fixed="right">
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
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="audit">审核</el-dropdown-item>
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
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
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
        <el-form-item label="所属分类">
          <el-select
            v-model="form.categoryId"
            clearable
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" maxlength="80" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="code">
          <el-input v-model="form.code" maxlength="32" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="item in TYPE_OPTIONS"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input v-model="form.org" maxlength="50" placeholder="请输入所属组织" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option
              v-for="item in STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" maxlength="80" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" maxlength="30" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" maxlength="20" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" maxlength="120" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="form.enabled"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="期初应付">
          <el-input-number v-model="form.openingPayable" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="期初应付余额">
          <el-input-number
            v-model="form.openingPayableBalance"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="应付金额">
          <el-input-number v-model="form.payableAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="已付金额">
          <el-input-number v-model="form.paidAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="期末应付">
          <el-input-number v-model="form.endingPayable" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="预付余额">
          <el-input-number v-model="form.prepaidBalance" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="form.fax" maxlength="40" />
        </el-form-item>
        <el-form-item label="纳税人识别号">
          <el-input v-model="form.taxNo" maxlength="40" />
        </el-form-item>
        <el-form-item label="税率(%)">
          <el-input-number v-model="form.taxRate" :min="0" :max="100" :precision="2" />
        </el-form-item>
        <el-form-item label="折扣比例(%)">
          <el-input-number
            v-model="form.discountProportion"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="开户银行">
          <el-input v-model="form.openBank" maxlength="60" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.accountNo" maxlength="40" />
        </el-form-item>
        <el-form-item label="承兑号">
          <el-input v-model="form.acceptanceNo" maxlength="40" />
        </el-form-item>
        <el-form-item label="供货保障">
          <el-input v-model="form.supplySafety" maxlength="40" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="200" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailVisible"
      title="供应商详情"
      width="560px"
      destroy-on-close
    >
      <el-descriptions v-if="detailRow" :column="1" border>
        <el-descriptions-item label="供应商名称">
          {{ detailRow.name }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商编码">
          {{ detailRow.code }}
        </el-descriptions-item>
        <el-descriptions-item label="所属分类">
          {{ categoryName(detailRow.categoryId) }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商类型">
          {{ detailRow.type }}
        </el-descriptions-item>
        <el-descriptions-item label="所属组织">
          {{ detailRow.org || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detailRow.status }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ detailRow.email || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          {{ detailRow.contact || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ detailRow.phone || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ detailRow.address || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否启用">
          {{ detailRow.enabled === 1 ? '启用' : '停用' }}
        </el-descriptions-item>
        <el-descriptions-item label="期初应付">
          {{ detailRow.openingPayable }}
        </el-descriptions-item>
        <el-descriptions-item label="期初应付余额">
          {{ detailRow.openingPayableBalance }}
        </el-descriptions-item>
        <el-descriptions-item label="应付金额">
          {{ detailRow.payableAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="已付金额">
          {{ detailRow.paidAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="期末应付">
          {{ detailRow.endingPayable }}
        </el-descriptions-item>
        <el-descriptions-item label="预付余额">
          {{ detailRow.prepaidBalance }}
        </el-descriptions-item>
        <el-descriptions-item label="传真">
          {{ detailRow.fax || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="纳税人识别号">
          {{ detailRow.taxNo || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="税率(%)">
          {{ detailRow.taxRate ?? '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="折扣比例(%)">
          {{ detailRow.discountProportion ?? '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="开户银行">
          {{ detailRow.openBank || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="账号">
          {{ detailRow.accountNo || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="承兑号">
          {{ detailRow.acceptanceNo || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="供货保障">
          {{ detailRow.supplySafety || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="最近付款时间">
          {{ detailRow.lastPaymentTime || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="审核信息">
          {{ detailRow.verifyData || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="排序值">
          {{ detailRow.sort ?? '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          {{ detailRow.remark || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailRow.createdAt }}
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

.sup-layout {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.sup-side {
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: var(--soft-radius-lg);
  background: var(--soft-surface);
  box-shadow: var(--soft-shadow-lg);
  min-height: 0;
}

.sup-side__list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sup-side__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--soft-radius);
  background: transparent;
  color: var(--soft-text);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.sup-side__item:hover {
  background: var(--soft-fill-hover);
}

.sup-side__item.is-active {
  background: var(--soft-primary-light);
  color: var(--soft-primary);
}

.sup-side__name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.sup-side__empty {
  padding: 24px 8px;
  text-align: center;
  color: var(--soft-text-muted);
  font-size: 13px;
}

.sup-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sup-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.sup-toolbar__left,
.sup-toolbar__right {
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
