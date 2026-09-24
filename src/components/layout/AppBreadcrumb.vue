<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  return route.matched
    .filter((item) => item.meta?.title && item.name !== 'Root')
    .map((item) => ({
      title: item.meta.title,
      path: item.path.startsWith('/')
        ? item.path
        : `/${item.path}`.replace(/\/+/g, '/'),
    }))
})

function handleClick(item, index) {
  if (index === breadcrumbs.value.length - 1) return
  if (item.path && item.path !== route.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="`${item.path}-${item.title}`"
    >
      <span
        class="crumb"
        :class="{ 'is-current': index === breadcrumbs.length - 1 }"
        @click="handleClick(item, index)"
      >
        {{ item.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.crumb {
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.crumb:hover:not(.is-current) {
  color: #4f46e5;
}

.crumb.is-current {
  cursor: default;
}
</style>
