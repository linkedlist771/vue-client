<template>
  <div class="preview-code">
    <!-- <svg
      class="close-button"
      @click="closeComponent"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#333333"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg> -->

    <div class="editor" ref="editorContainer"></div>
    <div class="preview">
      <VueLive
        v-if="!isClosed"
        :code="code"
        :layout="layout"
        :preview-only="true"
        @error="handleError"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'
import { VueLive } from 'vue-live'
import 'vue-live/style.css'
const isClosed = ref(false)
const emit = defineEmits(['close'])

const closeComponent = () => {
  isClosed.value = true
  disposeEditor()
  emit('close')
}
const disposeEditor = () => {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

onBeforeUnmount(() => {
  disposeEditor()
})

const props = defineProps({
  initialCode: {
    type: String,
    default: `
  <template>
    <div>
      <h1>{{ message }}</h1>
      <button @click="count++">Count is: {{ count }}</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const message = ref('Hello VueLive!');
  const count = ref(0);
  <\/script>
      `
  }
})

const editorContainer = ref(null)
const code = ref(props.initialCode)

const layout = {
  template: '<div class="custom-layout"><slot name="preview"></slot></div>'
}

let editor

onMounted(() => {
  monaco.languages.register({ id: 'vue' })

  // 定义Vue语言的基本语法高亮规则
  monaco.languages.setMonarchTokensProvider('vue', {
    defaultToken: '',
    tokenPostfix: '.vue',

    keywords: [
      'template',
      'script',
      'style',
      'v-if',
      'v-else',
      'v-for',
      'v-on',
      'v-bind',
      'ref',
      'reactive',
      'computed',
      'watch',
      'onMounted',
      'onUnmounted',
      'import',
      'export',
      'default',
      'from',
      'as',
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'do',
      'switch',
      'case',
      'break',
      'continue',
      'try',
      'catch',
      'finally',
      'throw',
      'async',
      'await'
    ],
    typeKeywords: ['props', 'emits', 'defineProps', 'defineEmits', 'defineExpose', 'withDefaults'],
    // HTML元素列表
    htmlElements: [
      'div',
      'span',
      'p',
      'a',
      'img',
      'button',
      'form',
      'input',
      'textarea',
      'select',
      'option',
      'ul',
      'ol',
      'li',
      'table',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'footer',
      'main',
      'section',
      'article',
      'nav',
      'aside',
      'label'
    ],
    // 常见的JavaScript/Vue函数
    builtinFunctions: [
      'console',
      'log',
      'warn',
      'error',
      'info',
      'debug',
      'parseInt',
      'parseFloat',
      'setTimeout',
      'setInterval',
      'clearTimeout',
      'clearInterval',
      'isNaN',
      'isFinite',
      'encodeURIComponent',
      'decodeURIComponent',
      'Math',
      'Date',
      'Array',
      'Object',
      'String',
      'Number',
      'Boolean',
      'Function',
      'Promise',
      'JSON',
      'Map',
      'Set',
      'Symbol',
      // Vue特定
      'ref',
      'reactive',
      'computed',
      'watch',
      'onMounted',
      'onUnmounted',
      'provide',
      'inject',
      'nextTick',
      'defineComponent',
      'defineAsyncComponent'
    ],
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
      { open: '<', close: '>', token: 'delimiter.angle' }
    ],

    tokenizer: {
      root: [
        [/[a-zA-Z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        { include: '@whitespace' },
        [/[{}()[\]]/, '@brackets'],
        [/@[a-zA-Z_$][\w$]*/, 'tag'],
        [/[:.,=]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number']
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment']
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ]
    }
  })

  editor = monaco.editor.create(editorContainer.value, {
    value: code.value,
    language: 'vue',
    theme: 'vs-dark',
    fontSize: 14,
    minimap: { enabled: false }
  })

  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue()
  })
})

const handleError = (error) => {
  if (!isClosed.value) {
    console.error('VueLive Error:', error)
  }
}

const handleSuccess = () => {
  if (!isClosed.value) {
    console.log('VueLive rendered successfully')
  }
}
</script>

<style scoped>
.preview-code {
  display: flex;
  width: 100vw; /* 使用100%的视窗宽度 */
  height: 100vh; /* 使用100%的视窗高度 */

  /* width: 950px; */
  margin: 30px auto;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 0 3px #ccc;
  position: relative;
}

.preview-code > div {
  /* width: 40%; */
  /* padding-left: 6%; */
  height: 100%; /* 确保子元素也占满全高 */
}

.editor {
  border-right: 1px solid #ccc;
  /* width: 10%; */
  width: 32%;
  height: 100%; /* 确保编辑器占满全高 */
}

.preview {
  /* padding: 10px; */
  /* margin-left: -40%; */
  padding-left: 20%;

  background-color: #fff;
  /* overflow: scroll; */
  height: 100%; /* 确保预览区域占满全高 */
  color: #333; /* 添加这行来设置文字颜色 */
  /* width: 60%; */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1000;
}

@media only screen and (max-width: 1000px) {
  .preview-code {
    width: 90vw;
  }
}

@media only screen and (max-width: 568px) {
  .preview-code {
    flex-direction: column;
  }

  .preview-code > div {
    width: 100%;
  }

  .editor {
    border-right: none;
    border-bottom: 1px solid #ccc;
  }
}
</style>
