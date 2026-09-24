<script setup>
const roles = [
  { id: 1, name: '超级管理员', code: 'admin', remark: '拥有全部权限' },
  { id: 2, name: '运维', code: 'ops', remark: '系统运维相关' },
  { id: 3, name: '财务', code: 'finance', remark: '财务模块权限' },
]
</script>

<template>
  <div class="page-card">
    <div class="page-head">
      <div>
        <h2>角色管理</h2>
        <p>基础占位页，后续可扩展权限树与授权。</p>
      </div>
      <el-button type="primary">新增角色</el-button>
    </div>

    <el-table :data="roles" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="角色编码" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="160">
        <template #default>
          <el-button link type="primary">授权</el-button>
          <el-button link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.page-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
  padding: 24px 32px;
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

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
}
</style>
