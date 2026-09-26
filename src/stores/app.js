import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const THEME_KEY = 'erp_theme'
const LOCALE_KEY = 'erp_locale'

function readStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function readStoredLocale() {
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  return 'zh'
}

export function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  localStorage.setItem(THEME_KEY, theme)
}

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref(readStoredTheme())
  const locale = ref(readStoredLocale())

  const isDark = computed(() => theme.value === 'dark')
  const isZh = computed(() => locale.value === 'zh')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setTheme(next) {
    theme.value = next
    applyTheme(next)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function setLocale(next) {
    if (next !== 'zh' && next !== 'en') return
    locale.value = next
    localStorage.setItem(LOCALE_KEY, next)
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  }

  // 初始化时同步到 DOM
  applyTheme(theme.value)
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'

  return {
    sidebarCollapsed,
    theme,
    locale,
    isDark,
    isZh,
    toggleSidebar,
    setTheme,
    toggleTheme,
    setLocale,
  }
})
