<template>
  <div class="container">
    <h1>Artifacts渲染</h1>
    <div class="content-wrapper">
      <a-spin :spinning="!codeLoaded" tip="代码加载中..." class="loading">
        <VueLiveEditor
          :initial-code="artifactsCode"
          v-if="showPreviewCode && codeLoaded"
          @close="closePreviewCode"
        />
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Spin as ASpin, message } from 'ant-design-vue'
import VueLiveEditor from '@/components/editor/VueLiveEditor.vue'
import { baseSendRequest, getQueryParam } from '@/api/status.js'

const code_hash = getQueryParam('code_hash')
const showPreviewCode = ref(true)
const codeLoaded = ref(false)
const artifactsCode = ref('')

const closePreviewCode = () => {
  showPreviewCode.value = false
}

onMounted(async () => {
  if (!code_hash) {
    message.error('链接无效，返回登录页面')
    setTimeout(() => {
      window.location.href = '/chat'
    }, 2000) // 2秒后跳转
  }

  try {
    let codeUrl = '/artifacts_sharing/get_code/' + code_hash
    const codeRes = await baseSendRequest(codeUrl, 'GET', {})
    const code = codeRes.code
    artifactsCode.value = code
    codeLoaded.value = true
  } catch (error) {
    message.error('加载数据失败，请重试')
  }
})
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  // // 增大加载图标和文字
  // :deep(.ant-spin-dot) {
  //   font-size: 28px; // 增大加载图标
  // }

  // :deep(.ant-spin-text) {
  //   font-size: 28px; // 增大加载文字
  //   margin-top: 28px; // 增加文字与图标的间距
  // }
}
</style>
