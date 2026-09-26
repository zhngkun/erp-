<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Fold,
  Expand,
  ArrowDown,
  Moon,
  Sunny,
  Search,
  Reading,
  ChatDotRound,
  Bell,
  FullScreen,
  Aim,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTagsStore } from '@/stores/tags'
import { menuRoutes } from '@/router/menus'
import { createOaApi } from '@/api/oa'
import { getWarningList } from '@/api/warning'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsStore = useTagsStore()

const collapsed = computed(() => appStore.sidebarCollapsed)
const isDark = computed(() => appStore.isDark)
const locale = computed(() => appStore.locale)

const nickname = computed(() => userStore.userInfo?.nickname || '用户')
const roleName = computed(
  () => userStore.userInfo?.role || (userStore.userInfo?.roles?.includes('admin') ? '超级管理员' : '用户'),
)
const maskedPhone = computed(() => maskPhone(userStore.userInfo?.phone || '18612349562'))
const userLabel = computed(() => `${roleName.value} ${maskedPhone.value}`)

const isFullscreen = ref(false)
const searchKeyword = ref('')
const searchVisible = ref(false)
const helpVisible = ref(false)
const messageVisible = ref(false)
const warningVisible = ref(false)

const messageList = ref([])
const warningList = ref([])
const messageUnread = ref(0)
const warningCount = ref(0)

const messageApi = createOaApi('message')

const WARNING_KEYS = [
  { key: 'stock', label: '库存预警', path: '/warning/stock' },
  { key: 'purchase', label: '采购预警', path: '/warning/purchase' },
  { key: 'sales', label: '销售预警', path: '/warning/sales' },
  { key: 'production', label: '生产预警', path: '/warning/production' },
  { key: 'cash', label: '收付款预警', path: '/warning/cash' },
]

const HELP_LINKS = [
  { title: '线上与本地功能差异清单', path: null, tip: '见仓库 docs/教程/线上与本地功能差异清单.md' },
  { title: '消息管理', path: '/oa/message' },
  { title: '预警中心', path: '/warning/stock' },
  { title: '系统配置', path: '/system/config' },
  { title: '个人信息', path: '/system/profile' },
]

function maskPhone(phone) {
  const text = String(phone || '').trim()
  if (text.length < 7) return text
  return text.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2')
}

function flattenMenus(routes, parents = []) {
  const list = []
  for (const item of routes) {
    const titles = [...parents, item.meta?.title].filter(Boolean)
    if (item.children?.length) {
      list.push(...flattenMenus(item.children, titles))
    } else if (item.path) {
      list.push({
        path: item.path,
        title: item.meta?.title || item.name,
        breadcrumb: titles.join(' / '),
      })
    }
  }
  return list
}

const allMenus = flattenMenus(menuRoutes)

const filteredMenus = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return allMenus.slice(0, 12)
  return allMenus
    .filter((m) => m.title.toLowerCase().includes(kw) || m.breadcrumb.toLowerCase().includes(kw))
    .slice(0, 20)
})

function syncFullscreen() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch {
    ElMessage.warning('当前浏览器不支持全屏')
  }
}

function handleLocale(command) {
  appStore.setLocale(command)
  ElMessage.success(command === 'zh' ? '已切换为中文' : 'Switched to English')
}

function goMenu(path) {
  searchVisible.value = false
  searchKeyword.value = ''
  router.push(path)
}

function openHelp(item) {
  helpVisible.value = false
  if (item.path) {
    router.push(item.path)
    return
  }
  if (item.tip) ElMessage.info(item.tip)
}

function goMessageCenter() {
  messageVisible.value = false
  router.push('/oa/message')
}

function goWarning(path) {
  warningVisible.value = false
  router.push(path || '/warning/stock')
}

async function loadHeaderBadges() {
  try {
    const [msgRes, ...warnResList] = await Promise.all([
      messageApi.getList({ page: 1, pageSize: 20, direction: 'received' }),
      ...WARNING_KEYS.map((w) => getWarningList(w.key, { page: 1, pageSize: 3 })),
    ])

    const messages = msgRes?.list || msgRes?.records || msgRes?.data?.list || []
    messageList.value = messages.slice(0, 8)
    messageUnread.value = messages.filter((m) => m.isRead === '未读' || m.isRead === false || m.isRead === 0).length

    const items = []
    let total = 0
    warnResList.forEach((res, idx) => {
      const meta = WARNING_KEYS[idx]
      const list = res?.list || res?.records || res?.data?.list || []
      const totalCount = Number(res?.total ?? res?.data?.total ?? list.length) || list.length
      total += totalCount
      list.slice(0, 2).forEach((row) => {
        items.push({
          id: `${meta.key}-${row.id}`,
          title: row.warningType || row.materialName || row.billCode || meta.label,
          desc: row.materialName || row.partnerName || row.customerName || row.supplierName || row.billCode || '',
          path: meta.path,
          level: row.level || '中',
        })
      })
    })
    warningList.value = items.slice(0, 10)
    warningCount.value = total
  } catch {
    /* mock / offline ignore */
  }
}

async function handleCommand(command) {
  if (command === 'profile') {
    router.push('/system/profile')
    return
  }
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出当前账号？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      })
      userStore.logout()
      tagsStore.reset()
      router.replace('/login')
    } catch {
      /* cancel */
    }
  }
}

onMounted(() => {
  syncFullscreen()
  document.addEventListener('fullscreenchange', syncFullscreen)
  loadHeaderBadges()
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', syncFullscreen)
})
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button
        class="icon-btn"
        type="button"
        aria-label="切换侧边栏"
        @click="appStore.toggleSidebar()"
      >
        <el-icon :size="18">
          <component :is="collapsed ? Expand : Fold" />
        </el-icon>
      </button>
      <AppBreadcrumb />
    </div>

    <div class="header-right">
      <el-dropdown trigger="click" @command="handleLocale">
        <button class="icon-btn" type="button" title="语言" aria-label="切换语言">
          <svg class="globe-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path
              d="M3.5 12h17M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
          </svg>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh" :disabled="locale === 'zh'">中文</el-dropdown-item>
            <el-dropdown-item command="en" :disabled="locale === 'en'">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-popover
        v-model:visible="searchVisible"
        placement="bottom-end"
        :width="360"
        trigger="click"
        popper-class="header-popper"
      >
        <template #reference>
          <button class="icon-btn" type="button" title="全局搜索" aria-label="全局搜索">
            <el-icon :size="18"><Search /></el-icon>
          </button>
        </template>
        <div class="search-panel">
          <el-input
            v-model="searchKeyword"
            clearable
            placeholder="搜索菜单…"
            :prefix-icon="Search"
            @keyup.enter="filteredMenus[0] && goMenu(filteredMenus[0].path)"
          />
          <ul class="result-list">
            <li
              v-for="item in filteredMenus"
              :key="item.path"
              @click="goMenu(item.path)"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.breadcrumb }}</span>
            </li>
            <li v-if="!filteredMenus.length" class="empty">无匹配菜单</li>
          </ul>
        </div>
      </el-popover>

      <el-popover
        v-model:visible="helpVisible"
        placement="bottom-end"
        :width="280"
        trigger="click"
        popper-class="header-popper"
      >
        <template #reference>
          <button class="icon-btn" type="button" title="帮助文档" aria-label="帮助文档">
            <el-icon :size="18"><Reading /></el-icon>
          </button>
        </template>
        <div class="help-panel">
          <div class="panel-title">帮助文档</div>
          <button
            v-for="item in HELP_LINKS"
            :key="item.title"
            type="button"
            class="help-item"
            @click="openHelp(item)"
          >
            {{ item.title }}
          </button>
        </div>
      </el-popover>

      <el-popover
        v-model:visible="messageVisible"
        placement="bottom-end"
        :width="340"
        trigger="click"
        popper-class="header-popper"
        @show="loadHeaderBadges"
      >
        <template #reference>
          <button class="icon-btn badge-btn" type="button" title="消息" aria-label="消息">
            <el-badge :value="messageUnread" :max="99" show-zero>
              <el-icon :size="18"><ChatDotRound /></el-icon>
            </el-badge>
          </button>
        </template>
        <div class="notify-panel">
          <div class="panel-title">
            <span>消息</span>
            <el-button link type="primary" @click="goMessageCenter">前往消息中心</el-button>
          </div>
          <ul class="result-list">
            <li
              v-for="item in messageList"
              :key="item.id"
              class="notify-item"
              @click="goMessageCenter"
            >
              <div class="notify-main">
                <strong :class="{ unread: item.isRead === '未读' }">{{ item.title }}</strong>
                <span>{{ item.content }}</span>
              </div>
              <em>{{ item.urgencyLevel }}</em>
            </li>
            <li v-if="!messageList.length" class="empty">暂无消息</li>
          </ul>
        </div>
      </el-popover>

      <el-popover
        v-model:visible="warningVisible"
        placement="bottom-end"
        :width="340"
        trigger="click"
        popper-class="header-popper"
        @show="loadHeaderBadges"
      >
        <template #reference>
          <button class="icon-btn badge-btn" type="button" title="预警通知" aria-label="预警通知">
            <el-badge :value="warningCount" :max="99" show-zero>
              <el-icon :size="18"><Bell /></el-icon>
            </el-badge>
          </button>
        </template>
        <div class="notify-panel">
          <div class="panel-title">
            <span>预警通知</span>
            <el-button link type="primary" @click="goWarning('/warning/stock')">查看全部</el-button>
          </div>
          <ul class="result-list">
            <li
              v-for="item in warningList"
              :key="item.id"
              class="notify-item"
              @click="goWarning(item.path)"
            >
              <div class="notify-main">
                <strong>{{ item.title }}</strong>
                <span>{{ item.desc }}</span>
              </div>
              <em :class="`level-${item.level}`">{{ item.level }}</em>
            </li>
            <li v-if="!warningList.length" class="empty">暂无预警</li>
          </ul>
        </div>
      </el-popover>

      <button
        class="icon-btn"
        type="button"
        :title="isFullscreen ? '退出全屏' : '全屏'"
        :aria-label="isFullscreen ? '退出全屏' : '全屏'"
        @click="toggleFullscreen"
      >
        <el-icon :size="18">
          <component :is="isFullscreen ? Aim : FullScreen" />
        </el-icon>
      </button>

      <button
        class="icon-btn"
        type="button"
        :aria-label="isDark ? '切换日间模式' : '切换夜间模式'"
        :title="isDark ? '日间模式' : '夜间模式'"
        @click="appStore.toggleTheme()"
      >
        <el-icon :size="18">
          <component :is="isDark ? Sunny : Moon" />
        </el-icon>
      </button>

      <el-dropdown trigger="click" @command="handleCommand">
        <button class="user-trigger" type="button">
          <span class="avatar">{{ nickname.slice(0, 1).toUpperCase() }}</span>
          <span class="name">{{ userLabel }}</span>
          <el-icon><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  padding: 8px 12px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.icon-btn,
.user-trigger {
  border: 0;
  background: var(--soft-fill);
  cursor: pointer;
  font: inherit;
  color: var(--soft-text-secondary);
  transition: all 0.2s ease-in-out;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  position: relative;
}

.icon-btn.badge-btn {
  width: auto;
  min-width: 36px;
  padding: 0 8px;
}

.globe-icon {
  display: block;
}

.icon-btn:hover,
.user-trigger:hover {
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow-primary);
  color: var(--soft-primary);
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--soft-primary-light);
  color: var(--soft-primary);
  font-weight: 700;
  font-size: 0.8125rem;
}

.name {
  font-weight: 600;
  color: var(--soft-text);
  font-size: 0.875rem;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-panel,
.help-panel,
.notify-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--soft-text);
}

.result-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow: auto;
}

.result-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.result-list li:hover {
  background: var(--soft-fill);
}

.result-list strong {
  font-size: 0.875rem;
  color: var(--soft-text);
}

.result-list span {
  font-size: 0.75rem;
  color: var(--soft-text-secondary);
}

.result-list .empty {
  cursor: default;
  color: var(--soft-text-secondary);
  text-align: center;
}

.notify-item {
  flex-direction: row !important;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.notify-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notify-item em {
  flex-shrink: 0;
  font-style: normal;
  font-size: 0.75rem;
  color: var(--soft-text-secondary);
}

.notify-item .unread {
  color: var(--soft-primary);
}

.level-高 {
  color: #e5484d;
}

.level-中 {
  color: #f5a524;
}

.help-item {
  border: 0;
  background: var(--soft-fill);
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--soft-text);
  font: inherit;
}

.help-item:hover {
  color: var(--soft-primary);
  box-shadow: var(--soft-shadow-primary);
}

@media (max-width: 640px) {
  .app-header {
    padding: 8px 10px;
  }

  .name {
    display: none;
  }
}
</style>
