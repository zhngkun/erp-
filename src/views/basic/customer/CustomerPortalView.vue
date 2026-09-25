<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const activeTab = ref('company')

/** 演示用租户 / 部门 / 用户信息 */
const portalMeta = {
  tenantId: '246',
  deptId: '1',
  userId: '1001',
}

const companyLink = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/client/#/?tId=${portalMeta.tenantId}`
})

const staffLink = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/client/#/?tId=${portalMeta.tenantId}&dId=${portalMeta.deptId}&uId=${portalMeta.userId}`
})

const currentLink = computed(() =>
  activeTab.value === 'company' ? companyLink.value : staffLink.value,
)

const qrSrc = computed(() => {
  const data = encodeURIComponent(currentLink.value)
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=8&data=${data}`
})

async function copyLink() {
  const text = currentLink.value
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

onMounted(() => {
  /* links depend on location.origin */
})
</script>

<template>
  <div class="page-root">
    <div class="portal-card">
      <div class="portal-card__title">客户门户端入口</div>

      <el-tabs v-model="activeTab" class="portal-tabs">
        <el-tab-pane label="公司推荐码(h5)" name="company" />
        <el-tab-pane label="员工推荐码(h5)" name="staff" />
      </el-tabs>

      <div class="portal-body">
        <div class="portal-qr">
          <img :src="qrSrc" alt="推荐码二维码" class="portal-qr__img" />
        </div>
        <div class="portal-link">
          <div class="portal-link__text" :title="currentLink">
            {{ currentLink }}
          </div>
          <el-button
            class="portal-link__copy"
            :icon="DocumentCopy"
            @click="copyLink"
          />
        </div>
        <p class="portal-hint">
          {{
            activeTab === 'company'
              ? '扫码或打开链接进入公司客户门户（H5）'
              : '扫码或打开链接进入员工推荐客户门户（H5）'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-root {
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding: 4px;
}

.portal-card {
  min-height: calc(100% - 8px);
  padding: 20px 24px 32px;
  border-radius: var(--soft-radius-lg);
  background: var(--soft-surface);
  box-shadow: var(--soft-shadow-lg);
}

.portal-card__title {
  position: relative;
  padding-left: 12px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--soft-text);
  line-height: 1.4;
}

.portal-card__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 3px;
  border-radius: 2px;
  background: var(--soft-primary);
}

.portal-tabs {
  margin-bottom: 8px;
}

.portal-body {
  padding-top: 12px;
  max-width: 480px;
}

.portal-qr {
  display: inline-flex;
  padding: 12px;
  border-radius: var(--soft-radius);
  background: #fff;
  box-shadow: var(--soft-shadow-sm, 0 2px 8px rgba(15, 23, 42, 0.06));
}

.portal-qr__img {
  width: 150px;
  height: 150px;
  display: block;
}

.portal-link {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  max-width: 100%;
}

.portal-link__text {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border-radius: var(--soft-radius);
  background: var(--soft-fill, #f5f7fa);
  color: var(--soft-text);
  font-size: 13px;
  line-height: 1.4;
  word-break: break-all;
}

.portal-link__copy {
  flex-shrink: 0;
}

.portal-hint {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--soft-text-muted);
  line-height: 1.5;
}
</style>
