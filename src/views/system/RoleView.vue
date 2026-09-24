<script setup>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { PageList } from '@/components/page'

const roles = ref([
  { id: 1, name: '超级管理员', code: 'admin', remark: '拥有全部权限' },
  { id: 2, name: '运维', code: 'ops', remark: '系统运维相关' },
  { id: 3, name: '财务', code: 'finance', remark: '财务模块权限' },
])

const query = reactive({
  page: 1,
  pageSize: 10,
})
</script>

<template>
  <PageList
    v-model:page="query.page"
    v-model:page-size="query.pageSize"
    title="角色管理"
    description="基础占位页，后续可扩展权限树与授权。"
    :data="roles"
    :total="roles.length"
    :show-pagination="false"
  >
    <template #actions>
      <el-button type="primary" :icon="Plus">新增角色</el-button>
    </template>

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
  </PageList>
</template>
