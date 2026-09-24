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
  background: var(--soft-bg);
  padding: 24px;
}

.panel {
  text-align: center;
  background: var(--soft-surface);
  border-radius: 1.5rem;
  box-shadow: var(--soft-shadow-lg);
  padding: 48px 40px;
}

.panel h1 {
  margin: 0;
  font-size: 4rem;
  color: var(--soft-primary);
}

.panel p {
  margin: 8px 0 24px;
  color: var(--soft-text-muted);
}
</style>
