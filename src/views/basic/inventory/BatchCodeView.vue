<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Printer, Refresh, View } from '@element-plus/icons-vue'
import {
  getInventoryBatchCodeSettings,
  previewInventoryBatchCodes,
  saveInventoryBatchCodeSettings,
} from '@/api/inventoryBatchCode'

const loading = ref(false)
const previewing = ref(false)
const saving = ref(false)
const codeList = ref([])

const form = reactive({
  codeType: 'barcode',
  paperSize: '40x30',
  barHeight: 40,
  marginLeft: 2,
  marginTop: 2,
  marginBottom: 2,
  textAlign: 'center',
  codeShow: 1,
  codeFontSize: 12,
  codeFontWeight: 'normal',
  prefixType: 'none',
  prefixValue: '',
  startNo: 1,
  number: 10,
  fillGap: 4,
  separator: '-',
})

const codeTypeOptions = [
  { value: 'barcode', label: '一维码' },
  { value: 'qrcode', label: '二维码' },
]

const paperOptions = [
  { value: '40x30', label: '40×30 mm' },
  { value: '50x30', label: '50×30 mm' },
  { value: '60x40', label: '60×40 mm' },
  { value: '80x50', label: '80×50 mm' },
]

const alignOptions = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
]

const prefixOptions = [
  { value: 'none', label: '无' },
  { value: 'text', label: '自定义文本' },
  { value: 'date', label: '日期 yyyyMMdd' },
]

const previewSample = computed(() => codeList.value[0]?.code || 'DEMO0001')

async function loadSettings() {
  loading.value = true
  try {
    const data = await getInventoryBatchCodeSettings()
    Object.assign(form, data)
  } finally {
    loading.value = false
  }
}

async function handlePreview() {
  previewing.value = true
  try {
    const data = await previewInventoryBatchCodes({ ...form })
    codeList.value = data.list || []
    ElMessage.success(`已生成 ${codeList.value.length} 条预览`)
  } finally {
    previewing.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    await saveInventoryBatchCodeSettings({ ...form })
    ElMessage.success('设置已保存')
  } finally {
    saving.value = false
  }
}

function handlePrint() {
  if (!codeList.value.length) {
    ElMessage.warning('请先生成预览')
    return
  }
  ElMessage.info('打印功能待对接浏览器打印驱动')
}

function removeCode(row) {
  codeList.value = codeList.value.filter((item) => item.id !== row.id)
}

onMounted(async () => {
  await loadSettings()
  handlePreview()
})
</script>

<template>
  <div class="batch-page" v-loading="loading">
    <section class="batch-card soft-card">
      <header class="batch-card__head">
        <h3>条码参数</h3>
        <div class="batch-card__actions">
          <el-button :icon="Refresh" @click="loadSettings">重置</el-button>
          <el-button type="primary" plain :loading="saving" @click="handleSave">
            保存设置
          </el-button>
          <el-button
            type="primary"
            :icon="View"
            :loading="previewing"
            @click="handlePreview"
          >
            生成预览
          </el-button>
          <el-button type="primary" :icon="Printer" @click="handlePrint">
            打印
          </el-button>
        </div>
      </header>

      <el-form label-width="110px" class="batch-form">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="条码类型">
              <el-select v-model="form.codeType" style="width: 100%">
                <el-option
                  v-for="opt in codeTypeOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="纸张尺寸">
              <el-select v-model="form.paperSize" style="width: 100%">
                <el-option
                  v-for="opt in paperOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="条码高度">
              <el-input-number v-model="form.barHeight" :min="10" :max="120" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="左边距">
              <el-input-number v-model="form.marginLeft" :min="0" :max="40" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="上边距">
              <el-input-number v-model="form.marginTop" :min="0" :max="40" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="下边距">
              <el-input-number v-model="form.marginBottom" :min="0" :max="40" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="文字对齐">
              <el-select v-model="form.textAlign" style="width: 100%">
                <el-option
                  v-for="opt in alignOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="显示编码">
              <el-switch
                :model-value="form.codeShow === 1"
                @change="(val) => (form.codeShow = val ? 1 : 0)"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="字号">
              <el-input-number v-model="form.codeFontSize" :min="8" :max="28" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="前缀类型">
              <el-select v-model="form.prefixType" style="width: 100%">
                <el-option
                  v-for="opt in prefixOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.prefixType === 'text'" :xs="24" :sm="12" :md="8">
            <el-form-item label="前缀内容">
              <el-input v-model="form.prefixValue" placeholder="自定义前缀" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="起始号">
              <el-input-number v-model="form.startNo" :min="1" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="生成数量">
              <el-input-number v-model="form.number" :min="1" :max="200" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="补位长度">
              <el-input-number v-model="form.fillGap" :min="1" :max="12" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="分隔符">
              <el-input v-model="form.separator" maxlength="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>

    <div class="batch-bottom">
      <section class="batch-card soft-card preview-panel">
        <header class="batch-card__head">
          <h3>效果预览</h3>
          <span class="muted">纸张 {{ form.paperSize }}</span>
        </header>
        <div class="preview-stage">
          <div
            class="preview-label"
            :style="{
              textAlign: form.textAlign,
              paddingTop: `${form.marginTop}px`,
              paddingBottom: `${form.marginBottom}px`,
              paddingLeft: `${form.marginLeft}px`,
            }"
          >
            <div
              class="preview-bars"
              :class="{ 'is-qr': form.codeType === 'qrcode' }"
              :style="{ height: `${form.barHeight}px` }"
            />
            <div
              v-if="form.codeShow === 1"
              class="preview-text"
              :style="{
                fontSize: `${form.codeFontSize}px`,
                fontWeight: form.codeFontWeight,
              }"
            >
              {{ previewSample }}
            </div>
          </div>
        </div>
      </section>

      <section class="batch-card soft-card list-panel">
        <header class="batch-card__head">
          <h3>打印列表</h3>
          <span class="muted">共 {{ codeList.length }} 条</span>
        </header>
        <el-table :data="codeList" height="100%" stripe>
          <el-table-column prop="code" label="编码" min-width="160" />
          <el-table-column prop="count" label="数量" width="90" align="center" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button link type="danger" @click="removeCode(row)">
                  移除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<style scoped>
.batch-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.soft-card {
  background: var(--soft-surface);
  border-radius: 16px;
  box-shadow: var(--soft-shadow-lg);
}

.batch-card {
  padding: 16px 18px;
  min-height: 0;
}

.batch-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.batch-card__head h3 {
  margin: 0;
  font-size: 16px;
  color: var(--soft-text);
}

.batch-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muted {
  color: var(--soft-text-muted);
  font-size: 13px;
}

.batch-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.batch-bottom {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: 12px;
}

.preview-panel,
.list-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--soft-primary) 10%, transparent), transparent 45%),
    var(--soft-bg);
  border-radius: 12px;
  padding: 20px;
}

.preview-label {
  width: 180px;
  min-height: 110px;
  background: #fff;
  border-radius: 8px;
  box-shadow: var(--soft-shadow);
  padding-right: 8px;
}

.preview-bars {
  width: 100%;
  border-radius: 4px;
  background: repeating-linear-gradient(
    90deg,
    #111 0 2px,
    #fff 2px 4px,
    #111 4px 5px,
    #fff 5px 8px,
    #111 8px 11px,
    #fff 11px 13px
  );
}

.preview-bars.is-qr {
  aspect-ratio: 1;
  height: auto !important;
  background:
    linear-gradient(#111 25%, transparent 0) 0 0 / 20% 20%,
    linear-gradient(90deg, #111 25%, transparent 0) 0 0 / 20% 20%,
    #fff;
  border: 1px solid #111;
}

.preview-text {
  margin-top: 8px;
  color: #222;
  letter-spacing: 0.5px;
}

.list-panel :deep(.el-table) {
  flex: 1;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .batch-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
