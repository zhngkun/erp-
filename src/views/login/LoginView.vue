<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref()
const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value?.validate()
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/dashboard'
    router.replace(String(redirect))
  } catch {
    /* 错误已在 request 层提示 */
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-ambient" aria-hidden="true" />

    <div class="login-card">
      <div class="login-brand">
        <div class="logo-mark">ERP</div>
        <h1>Soft ERP</h1>
        <p>柔和界面风格的企业后台基础架构</p>
      </div>

      <el-form
        ref="formRef"
        class="login-form"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="账号"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-button
          class="submit-btn"
          type="primary"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <p class="hint">演示账号：任意账号密码均可，默认 admin / 123456</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.login-ambient {
  position: absolute;
  inset: -20% auto auto -10%;
  width: 520px;
  height: 520px;
  border-radius: 999px;
  background: #eef2ff;
  filter: blur(40px);
  opacity: 0.9;
  pointer-events: none;
}

.login-card {
  position: relative;
  width: min(100%, 440px);
  padding: 40px 36px;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgb(148 163 184 / 0.4);
}

.login-brand {
  text-align: center;
  margin-bottom: 32px;
}

.logo-mark {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 12px 28px -6px rgb(79 70 229 / 0.28);
}

.login-brand h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.login-brand p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  margin-top: 8px;
  border-radius: 1rem !important;
  font-size: 1rem;
}

.hint {
  margin: 20px 0 0;
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
