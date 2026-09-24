<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import { deleteUser, getUserList } from '@/api/user'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  username: '',
  nickname: '',
  phone: '',
  status: '',
  page: 1,
  pageSize: 10,
})

async function fetchList() {
  loading.value = true
  try {
    const data = await getUserList({ ...query })
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
  query.username = ''
  query.nickname = ''
  query.phone = ''
  query.status = ''
  query.page = 1
  query.pageSize = 10
  fetchList()
}

function handlePageChange(page) {
  query.page = page
  fetchList()
}

function handleSizeChange(size) {
  query.pageSize = size
  query.page = 1
  fetchList()
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除用户「${row.nickname}」？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && query.page > 1) {
      query.page -= 1
    }
    fetchList()
  } catch {
    /* cancel or error already toasted */
  }
}

function handleCreate() {
  ElMessage.info('新增弹窗可后续补充，当前列表已对接 mock 接口')
}

function handleEdit() {
  ElMessage.info('编辑可后续补充')
}

onMounted(fetchList)
</script>

<template>
  <div class="user-page">
    <section class="search-card">
      <el-form :model="query" class="search-form" @submit.prevent>
        <el-form-item label="账号">
          <el-input
            v-model="query.username"
            clearable
            placeholder="请输入账号"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="query.nickname"
            clearable
            placeholder="请输入昵称"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="query.phone"
            clearable
            placeholder="请输入手机号"
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
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="search-actions">
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="table-card">
      <div class="page-head">
        <div>
          <h2>用户管理</h2>
          <p>数据来自本地 Mock，可检索、分页，后续可无缝切换真实接口。</p>
        </div>
        <el-button type="primary" :icon="Plus" @click="handleCreate">
          新增用户
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="72" />
        <el-table-column prop="username" label="账号" min-width="110" />
        <el-table-column prop="nickname" label="昵称" min-width="110" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="role" label="角色" min-width="120" />
        <el-table-column prop="department" label="部门" min-width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span class="status-pill" :data-on="row.status === 1">
              {{ row.status === 1 ? '启用' : '停用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="query.page"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 50]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-card,
.table-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
  padding: 24px 32px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  align-items: flex-end;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  color: #4b5563;
  font-weight: 500;
}

.search-actions :deep(.el-form-item__content) {
  display: flex;
  gap: 12px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-head h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.page-head p {
  margin: 6px 0 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.status-pill[data-on='true'] {
  background: #ecfdf5;
  color: #059669;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  color: #4b5563;
  font-weight: 600;
}

:deep(.el-pagination.is-background .el-pager li),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
  border-radius: 12px;
  border: 0;
  background: #f8fafc;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background: #4f46e5;
  box-shadow: 0 8px 18px -6px rgb(79 70 229 / 0.35);
}

@media (max-width: 768px) {
  .search-card,
  .table-card {
    padding: 20px;
  }

  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
