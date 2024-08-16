<!-- <template>
  <div
    class="content rounded-2xl"
    :class="{ typing: loading }"
    @click="handleClick($event)"
    v-html="htmlStr"
  ></div>
</template> -->
<template>
  <div
    class="conversation-item"
    @mouseover="handleMouseOver($event)"
    @mouseleave="showButtons = false"
  >
    <div
      class="content rounded-2xl"
      :class="{ typing: loading }"
      @click="handleClick($event)"
      v-html="htmlStr"
    ></div>
    <div
      class="action-buttons"
      :style="{
        top: buttonPosition.top + 'px',
        left: buttonPosition.left + 'px',
        padding: '4px 8px', // Add padding
        display: 'flex',
        gap: '6px' // Add gap between buttons
      }"
    >
      <button
        @click="buttonCopyContent"
        class="action-button"
        style="border: none; background: none; padding: 0"
      >
        <svg
          v-if="!isCheckmark"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <!-- Original copy icon path -->
          <rect width="24" height="24" fill="rgb(242, 241, 234)" />
          <path
            fill="#333333"
            fill-rule="evenodd"
            d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect width="24" height="24" fill="rgb(242, 241, 234)" />
          <path fill="#333333" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </button>
      <!-- 
      <button
        v-if="props.index % 2 !== 0"
        @click="regenerateContent"
        class="action-button"
        :style="{
          border: 'none',
          background: 'none',
          padding: 0,
          opacity: hasValidVueCode ? 1 : 0.5,
          cursor: hasValidVueCode ? 'pointer' : 'not-allowed'
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          class="icon-md-heavy"
        >
          <path
            fill="currentColor"
            d="M3.07 10.876C3.623 6.436 7.41 3 12 3a9.15 9.15 0 0 1 6.012 2.254V4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H15a1 1 0 1 1 0-2h1.957A7.15 7.15 0 0 0 12 5a7 7 0 0 0-6.946 6.124 1 1 0 1 1-1.984-.248m16.992 1.132a1 1 0 0 1 .868 1.116C20.377 17.564 16.59 21 12 21a9.15 9.15 0 0 1-6-2.244V20a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7.043A7.15 7.15 0 0 0 12 19a7 7 0 0 0 6.946-6.124 1 1 0 0 1 1.116-.868"
          ></path>
        </svg>
      </button> -->

      <button
        v-if="props.role === 'assistant'"
        @click="renderContent"
        :disabled="!hasValidVueCode"
        class="action-button"
        style="border: none; background: none; padding: 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M17 8l3-3"></path>
          <path d="M21 12h2"></path>
          <path d="M17 16l3 3"></path>
        </svg>
      </button>
    </div>

    <div v-if="showPreviewCode" class="fullscreen-overlay">
      <div class="fullscreen-preview">
        <div class="button-row">
          <button @click="closePreviewCode" class="header-button">关闭</button>
          <button @click="shareCodeBlock" class="header-button share-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="share-icon"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            分享
          </button>
          <!-- <button @click="shareCodeBlock" class="header-button">分享</button> -->
          <!-- 添加 SharePopup 组件 -->
          <SharePopup v-model:isVisible="isSharePopupVisible" :shareUrl="shareUrl" />
          <!-- <button @click="buttonAction(2)" class="header-button">按钮 2</button>
          <button @click="buttonAction(3)" class="header-button">按钮 3</button>
          <button @click="buttonAction(4)" class="header-button">按钮 4</button> -->
        </div>
        <VueLiveEditor :initial-code="detectedVueCode" @close="closePreviewCode" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.min.css'
import { copyToClipboard } from 'quasar'
import MermaidPlugin from '@/plugins/markdown-it/plugins/mermaid'
import LatexPlugin from '@/plugins/markdown-it/plugins/latex'
import SvgPlugin from '@/plugins/markdown-it/plugins/svg'
import { message } from 'ant-design-vue'
import VueLiveEditor from '@/components/editor/VueLiveEditor.vue'
import SharePopup from '@/components/share/SharePopup.vue'
import { baseSendRequest, getQueryParam } from '@/api/status.js'

const showPreviewCode = ref(false)
const detectedVueCode = ref('')
const apiKey = getQueryParam('api_key') || (localStorage.getItem('SJ_API_KEY') as string)
const isSharePopupVisible = ref(false)
const shareUrl = ref('')

const showButtons = ref(false)
function handleMouseOver(event) {
  showButtons.value = true
  updateButtonPosition(event)
}
const buttonPosition = ref({ top: 0, left: 0 })
const isCheckmark = ref(false)

const props = withDefaults(
  defineProps<{
    text: string
    loading?: boolean
    index: number
    role: string
  }>(),
  {
    loading: false
  }
)

let md: MarkdownIt
md = new MarkdownIt({
  breaks: true,
  highlight: function (str, lang) {
    let highlightedText = ''
    if (lang && hljs.getLanguage(lang)) {
      highlightedText = hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true
      }).value
    } else if (!lang && str) {
      const detection = hljs.highlightAuto(str)
      lang = detection.language || lang
      highlightedText = detection.value
    }

    const copyIcon =
      '<i class="q-icon copy-code notranslate material-icons" aria-hidden="true" role="presentation">copy</i>'

    if (highlightedText) {
      try {
        return (
          `<pre class="hljs language-${lang}">${copyIcon}` +
          `<code>${highlightedText}</code>` +
          '</pre>'
        )
      } catch (__) {}
    }

    return (
      `<pre class="hljs hljs_code">${copyIcon}<code>` + md.utils.escapeHtml(str) + '</code></pre>'
    )
  }
})

md.use(MermaidPlugin).use(LatexPlugin).use(SvgPlugin)
function checkValidVueCode(text: string): boolean {
  const vueCodeRegex = /```([\s\S]*?)```/g
  text = artifactsStr2MDStr(text)
  let match

  while ((match = vueCodeRegex.exec(text)) !== null) {
    const vueCode = match[1].trim()
    if (
      /<template[\s\S]*<\/template>/i.test(vueCode) &&
      /<script[\s\S]*<\/script>/i.test(vueCode)
    ) {
      return true
    }
  }
  return false
}
// 计算属性：检查是否有有效的 Vue 代码
const hasValidVueCode = computed(() => {
  return checkValidVueCode(props.text)
})

const htmlStr = computed(() => {
  const strWithouArtifacts = artifactsStr2MDStr(props.text)
  // renderVueCode(props.text)
  return str2html(strWithouArtifacts || '')
  // str2html(props.text) + (props.loading ? "<span class='typing'></span>" : "")
})
// function renderContent() {
//   if (hasValidVueCode.value) {
//     showPreviewCode.value = true;
//     // 这里需要实现检测Vue代码的逻辑，可能类似于：
//     // detectedVueCode.value = extractVueCode(props.text);
//   }
// }

function renderVueCode(codStrring: string) {
  const vueCodeRegex = /```([\s\S]*?)```/g
  let match
  codStrring = artifactsStr2MDStr(codStrring)

  while ((match = vueCodeRegex.exec(codStrring)) !== null) {
    const vueCode = match[1].trim()
    if (vueCode.includes('<script') && vueCode.includes('<template>')) {
      handleVueCode(vueCode)
    }
  }
}
function handleVueCode(code: string) {
  console.log('检测到Vue代码:', code)
  detectedVueCode.value = code
  showPreviewCode.value = true
  // 在这里添加你想要执行的逻辑
}

function closePreviewCode() {
  showPreviewCode.value = false
}

async function shareCodeBlock() {
  // 1. 上传codeBlock获得code_hash
  const codeBlock = detectedVueCode.value

  // /api/v1/artifacts_sharing/upload_code
  const codeUrl = '/artifacts_sharing/upload_code'

  // const payLoad = {
  //   code: codeBlock
  // }
  const payLoad = {
    code: codeBlock
  }

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', apiKey)

  try {
    isSharePopupVisible.value = true
    // export async function baseSendRequest(url, method, headers, queryParams = null, body = null) {

    const res = await baseSendRequest(codeUrl, 'POST', headers, null, payLoad)

    // const resMessage = res.message
    const codeHash = res.code_hash

    const codeShareUrl = window.location.origin + '/claude/artifacts/' + '?code_hash=' + codeHash

    // 复制到剪贴板
    // await navigator.clipboard.writeText(codeShareUrl)

    // Show success message

    shareUrl.value = codeShareUrl

    // Show share link
    // console.log('分享成功，链接已复制到剪贴板', shareUrl)
    // 2. 根据hash_code生成分享链接
  } catch (error) {
    console.error('Error loading data:', error)
    // message.error('artifact 分享失败')
  }

  // 2. 根据hash_code生成分享链接
}

function str2html(str: string, model: 'render' | 'renderInline' = 'render') {
  if (model in md && typeof md[model] === 'function') {
    return md[model](str)
  }

  return str
}
function artifactsStr2MDStr(artifactStr: string): string {
  // 使用正则表达式替换开始标记
  let result = artifactStr.replace(/<antArtifact[^>]*>/g, '```\n')
  // 替换结束标记
  result = result.replace(/<\/antArtifact>/g, '\n```')

  return result
}
function updateButtonPosition(event) {
  const rect = event.target.getBoundingClientRect()
  buttonPosition.value = {
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  }
}

async function buttonCopyContent() {
  try {
    await copyToClipboard(props.text)
    isCheckmark.value = true
    setTimeout(() => {
      isCheckmark.value = false
    }, 1500)
    message.success('复制成功')
  } catch (err) {
    // Handle error
  }
}

async function renderContent() {
  // Emit event to parent component
  renderVueCode(props.text)
}

async function regenerateContent() {
  // Emit event to parent component
  message.info('该功能还未实现')
}

async function handleClick(event: MouseEvent) {
  if (!event.target) {
    return
  }

  const target = event.target as HTMLElement

  if (target.className.includes('copy-code')) {
    if (target.nextSibling?.textContent) {
      const isCoppied = await copyContent(target.nextSibling?.textContent)
      if (isCoppied) {
        const innerText = target.innerText
        target.innerText = 'done'
        setTimeout(() => {
          target.innerText = innerText
        }, 1000)
      }
    }
  }
}

async function copyContent(str: string): Promise<boolean> {
  try {
    await copyToClipboard(str)
    return true
  } catch (err) {
    return false
  }
}
</script>

<style lang="scss">
// 而外的vue渲染的代码内容

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fullscreen-preview {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.button-row {
  // 让这个在右上角显示
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  z-index: 10001;
}

.header-button-group {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  z-index: 10001;
}

.header-button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  white-space: nowrap;
}

.header-button:hover {
  background-color: #e0e0e0;
}

.share-button {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.share-button:hover {
  background-color: #388e3c;
}

// VueLiveEditor 样式修改
.fullscreen-preview .vue-live-editor {
  flex: 1;
  width: 100%;
  height: calc(100% - 40px); // 减去关闭按钮的高度
  margin-top: 40px; // 为关闭按钮留出空间
}
.content {
  min-height: 1rem;
  letter-spacing: 1px;
  // background: #f7f7f7;
  background-color: rgb(222, 237, 215);
  padding: 20px;
  //border-radius: 8px;
  border: 1px solid #e1e0e0;
  & > * {
    color: #000;
  }
  //h1 {
  //  font-size: 1.15rem;
  //  font-weight: 700;
  //  line-height: 1.6;
  //}

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.6;
  }

  h3,
  h4,
  h5 {
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1.4;
  }

  p {
    code {
      background-color: #f2f3f545;
      padding: 0 2px;
      border-radius: 2px;
      white-space: pre-wrap;
    }

    code:not(pre code) {
      color: #0000ff; // 蓝色文本
      background-color: #f2f1ea; // 白色背景
      padding: 1px 2px;
      font-family: 'Consolas', 'Courier New', monospace; // 使用Consolas或其他等宽字体
      font-size: 1em; // 保持与周围文本相同的大小
      font-weight: normal; // 不加粗
      border: 1px solid #cccccc; // 浅灰色边框
      border-radius: 0; // 移除圆角
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); // 添加轻微阴影效果
      font-weight: bold; // 加粗
    }
  }

  pre {
    margin: 5px;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    white-space: break-spaces;

    span {
      white-space: pre-wrap;
    }

    .copy-code {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: 14px;
      opacity: 0.7;
      cursor: pointer;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    height: 500px;
    border-radius: 5px;
  }
}

.typing {
  @keyframes blink {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:empty::before,
  & > :last-child::after {
    font-size: 1rem;
    margin: 0;
    font-family: 'Courier New';
    font-weight: bold;
    content: '|';
    animation: blink 500ms linear infinite alternate;
  }

  .conversation-item {
    position: relative; // 添加这一行

    margin-bottom: 20px;
  }

  .action-buttons {
    position: absolute;
    display: flex;
    gap: 12px; /* Increased from 8px */
    z-index: 1000;
    background: none;
    border: 1px solid #e0e0e0;
    border-radius: 9999px;
    padding: 6px 8px; /* Added horizontal padding */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f0f0f0;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 14px;
    color: #333;
    margin: 0 2px; /* Added horizontal margin */

    &:hover {
      background-color: #f5f5f5;
    }

    svg {
      width: 20px; /* Adjusted size */
      height: 20px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .text-text-500 {
    // 给上面的padding加一点
    padding: 2px 4px;
  }
}
</style>
