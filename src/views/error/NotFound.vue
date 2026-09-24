<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="panel">
      <h1>404</h1>
      <p>页面不存在或已被移除</p>
      <el-button type="primary" @click="router.push('/dashboard')">
        返回工作台
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f8fafc;
  padding: 24px;
}

.panel {
  text-align: center;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
  padding: 48px 40px;
}

.panel h1 {
  margin: 0;
  font-size: 4rem;
  color: #4f46e5;
}

.panel p {
  margin: 8px 0 24px;
  color: #6b7280;
}
</style>
