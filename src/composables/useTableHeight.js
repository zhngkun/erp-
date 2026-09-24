import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 根据容器剩余高度计算 el-table 的 height，使表体内部滚动且不超过 layout。
 * @param {import('vue').Ref<HTMLElement | null>} containerRef 表格外层容器
 */
export function useTableHeight(containerRef) {
  const tableHeight = ref(360)

  function updateHeight() {
    const el = containerRef.value
    if (!el) return
    const next = Math.floor(el.clientHeight)
    tableHeight.value = next > 120 ? next : 120
  }

  let observer

  onMounted(async () => {
    await nextTick()
    updateHeight()
    if (typeof ResizeObserver === 'undefined' || !containerRef.value) return
    observer = new ResizeObserver(() => updateHeight())
    observer.observe(containerRef.value)
    window.addEventListener('resize', updateHeight)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('resize', updateHeight)
  })

  return {
    tableHeight,
    updateHeight,
  }
}
