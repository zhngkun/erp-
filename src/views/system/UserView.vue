<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteUser, getUserList } from '@/api/user'
import { PageList } from '@/components/page'

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

function handlePageChange() {
  fetchList()
}

function handleSizeChange() {
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
  <PageList
    v-model:page="query.page"
    v-model:page-size="query.pageSize"
    title="用户管理"
    description="数据来自本地 Mock，可检索、分页，后续可无缝切换真实接口。"
    :query="query"
    :loading="loading"
    :data="tableData"
    :total="total"
    @search="handleSearch"
    @reset="handleReset"
    @page-change="handlePageChange"
    @size-change="handleSizeChange"
  >
    <template #search>
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
    </template>

    <template #actions>
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新增用户
      </el-button>
    </template>

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
        <el-button link type="primary" @click="handleEdit">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </PageList>
</template>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--soft-status-off-bg);
  color: var(--soft-status-off-text);
}

.status-pill[data-on='true'] {
  background: var(--soft-status-on-bg);
  color: var(--soft-status-on-text);
}
</style>
