import { defineStore } from 'pinia'
import { ref } from 'vue'

const AFFIX_HOME = {
  title: '工作台',
  path: '/dashboard',
  name: 'Dashboard',
  affix: true,
}

export const useTagsStore = defineStore('tags', () => {
  const visitedViews = ref([{ ...AFFIX_HOME }])

  function addView(route) {
    if (!route?.name || route.meta?.hiddenTag) return
    const exists = visitedViews.value.some((item) => item.path === route.path)
    if (exists) return

    visitedViews.value.push({
      title: route.meta?.title || route.name,
      path: route.path,
      name: route.name,
      affix: Boolean(route.meta?.affix),
    })
  }

  function delView(path) {
    const index = visitedViews.value.findIndex((item) => item.path === path)
    if (index === -1) return null
    const target = visitedViews.value[index]
    if (target.affix) return null
    visitedViews.value.splice(index, 1)
    return visitedViews.value[index - 1] || visitedViews.value[0] || null
  }

  function delOthers(path) {
    visitedViews.value = visitedViews.value.filter(
      (item) => item.affix || item.path === path,
    )
  }

  function delAll() {
    visitedViews.value = visitedViews.value.filter((item) => item.affix)
    if (!visitedViews.value.length) {
      visitedViews.value = [{ ...AFFIX_HOME }]
    }
  }

  function reset() {
    visitedViews.value = [{ ...AFFIX_HOME }]
  }

  return {
    visitedViews,
    addView,
    delView,
    delOthers,
    delAll,
    reset,
  }
})
