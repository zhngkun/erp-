<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  Box,
  Document,
  Money,
  Odometer,
  ShoppingCart,
  TrendCharts,
  Warning,
} from '@element-plus/icons-vue'
import { getWarningList } from '@/api/warning'

const userStore = useUserStore()
const router = useRouter()
const nickname = computed(() => userStore.userInfo?.nickname || '用户')

const stats = ref([
  { title: '待办单据', value: '—', icon: Document, tone: 'indigo', path: '/oa/todo' },
  { title: '销售待出库', value: '—', icon: ShoppingCart, tone: 'emerald', path: '/sales/outbound' },
  { title: '采购待入库', value: '—', icon: Box, tone: 'pink', path: '/purchase/inbound' },
  { title: '库存预警', value: '—', icon: Warning, tone: 'amber', path: '/warning/stock' },
  { title: '收款逾期', value: '—', icon: Money, tone: 'indigo', path: '/warning/cash' },
  { title: '生产超时', value: '—', icon: TrendCharts, tone: 'emerald', path: '/warning/production' },
])

const loading = ref(false)

async function loadStats() {
  loading.value = true
  try {
    const [stock, purchase, sales, production, cash] = await Promise.all([
      getWarningList('stock', { page: 1, pageSize: 1 }),
      getWarningList('purchase', { page: 1, pageSize: 1 }),
      getWarningList('sales', { page: 1, pageSize: 1 }),
      getWarningList('production', { page: 1, pageSize: 1 }),
      getWarningList('cash', { page: 1, pageSize: 1 }),
    ])
    stats.value = [
      { title: '待办单据', value: '12', icon: Document, tone: 'indigo', path: '/oa/todo' },
      {
        title: '销售预警',
        value: String(sales.total ?? 0),
        icon: ShoppingCart,
        tone: 'emerald',
        path: '/warning/sales',
      },
      {
        title: '采购预警',
        value: String(purchase.total ?? 0),
        icon: Box,
        tone: 'pink',
        path: '/warning/purchase',
      },
      {
        title: '库存预警',
        value: String(stock.total ?? 0),
        icon: Warning,
        tone: 'amber',
        path: '/warning/stock',
      },
      {
        title: '收付款预警',
        value: String(cash.total ?? 0),
        icon: Money,
        tone: 'indigo',
        path: '/warning/cash',
      },
      {
        title: '生产预警',
        value: String(production.total ?? 0),
        icon: TrendCharts,
        tone: 'emerald',
        path: '/warning/production',
      },
    ]
  } finally {
    loading.value = false
  }
}

function go(path) {
  if (path) router.push(path)
}

onMounted(loadStats)
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <section class="welcome soft-card">
      <div>
        <h2>你好，{{ nickname }}</h2>
        <p>业务概览：销售 / 采购 / 库存 / 生产 / 收付款预警一览。</p>
      </div>
      <div class="welcome-badge">
        <el-icon :size="22"><Odometer /></el-icon>
      </div>
    </section>

    <section class="stat-grid">
      <article
        v-for="item in stats"
        :key="item.title"
        class="stat-card soft-card"
        @click="go(item.path)"
      >
        <div class="stat-icon" :data-tone="item.tone">
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
        </div>
        <div>
          <p class="stat-label">{{ item.title }}</p>
          <p class="stat-value">{{ item.value }}</p>
        </div>
      </article>
    </section>

    <section class="guide soft-card">
      <h3>快捷入口</h3>
      <ul>
        <li @click="go('/warning/stock')">预警中心：库存 / 采购 / 销售 / 生产 / 收付款</li>
        <li @click="go('/stock/assembly')">库存：组装拆卸、打包装箱</li>
        <li @click="go('/purchase/compare')">采购：比价、定价</li>
        <li @click="go('/basic/inventory/sku')">基础资料：SKU、客户物料</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 1rem;
  box-shadow: var(--soft-shadow-lg);
  padding: 14px 16px;
  transition: all 0.3s ease-in-out;
}

.soft-card:hover {
  transform: translateY(-2px);
}

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.welcome p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.welcome-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: #fff;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
}

.stat-icon[data-tone='indigo'] {
  background: #5e72e4;
}
.stat-icon[data-tone='emerald'] {
  background: #2dce89;
}
.stat-icon[data-tone='pink'] {
  background: #f5365c;
}
.stat-icon[data-tone='amber'] {
  background: #fb6340;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-value {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: 700;
}

.guide h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.guide ul {
  margin: 0;
  padding-left: 18px;
}

.guide li {
  margin: 6px 0;
  cursor: pointer;
  color: var(--el-color-primary);
}

@media (max-width: 960px) {
  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
