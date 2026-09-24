<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Moon, Sunny } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const loading = ref(false)
const formRef = ref()
const isDark = computed(() => appStore.isDark)
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

    <button
      class="theme-btn"
      type="button"
      :aria-label="isDark ? '切换日间模式' : '切换夜间模式'"
      :title="isDark ? '日间模式' : '夜间模式'"
      @click="appStore.toggleTheme()"
    >
      <el-icon :size="18">
        <component :is="isDark ? Sunny : Moon" />
      </el-icon>
    </button>

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
  background: var(--soft-bg);
}

.theme-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--soft-surface);
  color: var(--soft-text-secondary);
  box-shadow: var(--soft-shadow-lg);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.theme-btn:hover {
  transform: translateY(-1px);
  color: var(--soft-primary);
  box-shadow: var(--soft-shadow-primary);
}

.login-ambient {
  position: absolute;
  inset: -20% auto auto -10%;
  width: 520px;
  height: 520px;
  border-radius: 999px;
  background: var(--soft-primary-light);
  filter: blur(40px);
  opacity: 0.9;
  pointer-events: none;
}

.login-card {
  position: relative;
  width: min(100%, 440px);
  padding: 40px 36px;
  background: var(--soft-surface);
  border-radius: 1.5rem;
  box-shadow: var(--soft-shadow-lg);
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
  background: var(--soft-primary-light);
  color: var(--soft-primary);
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: var(--soft-shadow-primary);
}

.login-brand h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--soft-text);
}

.login-brand p {
  margin: 8px 0 0;
  color: var(--soft-text-muted);
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
  color: var(--soft-text-muted);
}
</style>
