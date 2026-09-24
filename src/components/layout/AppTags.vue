<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'
import { useTagsStore } from '@/stores/tags'

const route = useRoute()
const router = useRouter()
const tagsStore = useTagsStore()

const tags = computed(() => tagsStore.visitedViews)

function isActive(tag) {
  return tag.path === route.path
}

function go(tag) {
  if (tag.path !== route.path) {
    router.push(tag.path)
  }
}

function close(tag, event) {
  event.stopPropagation()
  const next = tagsStore.delView(tag.path)
  if (isActive(tag) && next) {
    router.push(next.path)
  } else if (isActive(tag) && !next) {
    router.push('/dashboard')
  }
}

function onContext(command, tag) {
  if (command === 'others') {
    tagsStore.delOthers(tag.path)
    if (route.path !== tag.path) router.push(tag.path)
  }
  if (command === 'all') {
    tagsStore.delAll()
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="tags-bar">
    <div class="tags-scroll">
      <el-dropdown
        v-for="tag in tags"
        :key="tag.path"
        trigger="contextmenu"
        @command="(cmd) => onContext(cmd, tag)"
      >
        <button
          class="tag-item"
          type="button"
          :class="{ 'is-active': isActive(tag) }"
          @click="go(tag)"
        >
          <span class="title">{{ tag.title }}</span>
          <el-icon
            v-if="!tag.affix"
            class="close"
            @click="close(tag, $event)"
          >
            <Close />
          </el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="others">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.tags-bar {
  flex-shrink: 0;
  padding: 8px 12px;
}

.tags-scroll {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 0;
  background: #f8fafc;
  color: #4b5563;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
}

.tag-item:hover {
  background: #eef2ff;
  color: #4f46e5;
}

.tag-item.is-active {
  background: #4f46e5;
  color: #ffffff;
}

.close {
  font-size: 12px;
  padding: 1px;
  transition: background 0.2s ease-in-out, opacity 0.2s ease-in-out;
  opacity: 0.7;
}

.close:hover {
  opacity: 1;
  background: rgb(0 0 0 / 0.08);
}

.tag-item.is-active .close:hover {
  background: rgb(255 255 255 / 0.22);
}

@media (max-width: 640px) {
  .tags-bar {
    padding: 8px 10px;
  }
}
</style>
