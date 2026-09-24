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
          class="tag-card"
          type="button"
          :class="{ 'is-active': isActive(tag) }"
          @click="go(tag)"
        >
          <span class="dot" />
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
  margin: 16px 24px 0;
}

.tags-scroll {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.tag-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 14px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #4b5563;
  font: inherit;
  font-weight: 500;
  box-shadow: 0 10px 25px -5px rgb(148 163 184 / 0.35);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
}

.tag-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px -8px rgb(79 70 229 / 0.22);
  color: #4f46e5;
}

.tag-card.is-active {
  background: #4f46e5;
  color: #ffffff;
  box-shadow: 0 12px 28px -6px rgb(79 70 229 / 0.28);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.45;
}

.tag-card.is-active .dot {
  opacity: 1;
  background: #ffffff;
}

.close {
  font-size: 12px;
  border-radius: 999px;
  transition: background 0.2s ease-in-out;
}

.close:hover {
  background: rgb(255 255 255 / 0.25);
}

@media (max-width: 640px) {
  .tags-bar {
    margin: 12px 12px 0;
  }
}
</style>
