import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const THEME_KEY = 'erp_theme'

function readStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
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

  const isDark = computed(() => theme.value === 'dark')

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

  // 初始化时同步到 DOM
  applyTheme(theme.value)

  return {
    sidebarCollapsed,
    theme,
    isDark,
    toggleSidebar,
    setTheme,
    toggleTheme,
  }
})
