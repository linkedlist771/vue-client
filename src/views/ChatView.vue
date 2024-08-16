<script setup lang="ts">
import { computed, onUnmounted, type CSSProperties, type Ref } from 'vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import Icon from '@/components/icon/index.vue'
import {
  fetchConversation,
  getQueryParam,
  documentConversionUrl,
  chat,
  deleteAllConversation,
  imageUploadUrl
} from '@/api/chat'
import MarkDownMessage from '@/components/message/MarkdownMessage.vue'
import { message } from 'ant-design-vue'
import userImg from '@/assets/user.png'
import aiImg from '@/assets/ai.png'
import { throttle } from 'lodash-es'
import { useWindowFocus } from '@vueuse/core'

// const sidebarRef = ref<HTMLElement | null>(null)

// onMounted(() => {
//   if (sidebarRef.value) {
//     const sidebarElement = sidebarRef.value.$el || sidebarRef.value
//     sidebarElement.style.height = '100vh'
//     sidebarElement.style.overflowY = 'hidden'
//   }
// })

// 添加日期处理函数
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays < 7) {
    return '过去一周'
  } else {
    return '更早以前'
  }
}

// 对对话记录进行分组
const groupedConversations = computed(() => {
  const groups = {
    今天: [],
    过去一周: [],
    更早以前: []
  }

  list.value.forEach((conversation) => {
    const group = formatDate(conversation.messages[0].timestamp)
    groups[group].push(conversation)
  })

  return groups
})

const { focused } = useWindowFocus()
let focusTimer: number | null = null

watch(focused, (newFocused) => {
  if (!newFocused) {
    focusTimer = setTimeout(() => {
      stopReceiveMessage()
    }, 90 * 1000) // 90 seconds
  } else {
    if (focusTimer) {
      clearTimeout(focusTimer)
      focusTimer = null
    }
  }
})

const devicewidth = document.documentElement.clientWidth //获取当前分辨率下的可是区域宽度

// 进行黏贴图片的函数处理
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault()
      const blob = item.getAsFile()
      if (!blob) continue

      uploadDisabled.value = true
      const formData = new FormData()
      formData.append('file', blob, 'pasted_image.png')
      formData.append('client_idx', clientIdx)
      formData.append('client_type', clientType)

      const myHeaders = new Headers()
      myHeaders.append('Authorization', apiKey)

      const fileObj = {
        type: 'image',
        url: URL.createObjectURL(blob),
        name: 'Pasted image',
        loading: true
      }

      messageList.value.push({
        role: 'user',
        content: inputText.value,
        file: fileObj
      })

      fetch(imageUploadUrl, {
        method: 'POST',
        body: formData,
        headers: myHeaders
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.file_name) {
            throw new Error('上传失败')
          }

          message.success('图片上传成功!')
          uploadFileRes.value.push(data)
          const current = messageList.value[messageList.value.length - 1]
          if (current) {
            current.file.loading = false
          }
        })
        .catch((err) => {
          message.error('图片上传失败')
          messageList.value.pop()
          console.error(err)
        })
        .then(() => {
          uploadDisabled.value = false
        })
    }
  }
}

type Message = {
  role: string
  content: string
  loading?: boolean
  file?: { type: string; url: string; name: string; loading: boolean }
  timestamp?: string
}
type MessageItem = {
  messages: Message[]
  conversation_id: string
  model: string
}
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 'auto',
  lineHeight: '20px',
  backgroundColor: '#ded8c4',
  padding: '15px'
}

const contentStyle: CSSProperties = {
  textAlign: 'center',
  height: 'calc(100vh - 190px)',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f2f1ea',
  padding: '20px 20px',
  'overflow-x': 'hidden',
  'overflow-y': 'scroll'
}

const siderStyle: Ref<CSSProperties> = ref({
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f2f1ea',
  position: 'relative',
  borderRight: '1px solid #ddd',
  height: '100vh',
  // overflow: 'scroll'
  overflowY: 'auto', // 添加这一行
  overflowX: 'hidden' // 添加这一行
})

const zeroWidthTriggerStyle = {
  position: 'absolute',
  top: '4px',
  backgroundColor: '#f2f1ea',
  color: '#6B7280FF'
}

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#f2f1ea',
  position: 'relative',
  padding: '15px'
}
const sideLoading = ref(false)
const inputText = ref<string>('')
const isStreaming = ref(false)
// const selectValue = ref<string>('default')
const selectModelValue = ref('claude-3-5-sonnet-20240620')
const list: Ref<MessageItem[]> = ref([])
const fileList = ref([])
const uploadFileRes = ref([])
const attachments = ref([])
const accept = 'image/*,.pdf,.doc,.docx,.csv,.txt,.html,.htm'
const clientIdx = getQueryParam('client_idx') ?? ''
const clientType = getQueryParam('client_type') ?? ''
const apiKey = getQueryParam('api_key') || (localStorage.getItem('SJ_API_KEY') as string)
const conversation_id = ref('')
const messageList: Ref<Message[]> = ref([])
const abortController = ref<AbortController>()
const isSend: Ref<boolean> = ref(false)
const uploadDisabled = ref(false)
const messageContainerHeight = ref(0)
const messageContainerRef = ref<Element | null>(null)
const modelDisabled = ref(false)
const listHeight = ref('calc(100vh - 47px)')
const getUrl = (file: File) => {
  return URL.createObjectURL(file)
}

// 是否进行联网搜索 const isNetworkEnabled = ref(false)
const isNetworkEnabled = ref(false)

// 是否进行artifacts
const isArtifactsEnabled = ref(localStorage.getItem('isArtifactsEnabled') === 'true' || false)
// 监听 isArtifactsEnabled 的变化，并更新本地缓存
watch(isArtifactsEnabled, (newValue) => {
  localStorage.setItem('isArtifactsEnabled', newValue.toString())
})
const handleChange = (info: UploadChangeParam) => {}
const isImageType = (type: string) => {
  return type.includes('image')
}
const isImage = ref(false)
const clearState = () => {
  attachments.value = []
  fileList.value = []
  messageList.value = []
  conversation_id.value = ''
  inputText.value = ''
  modelDisabled.value = false
  uploadFileRes.value = []
  isNetworkEnabled.value = false // 添加这一行
  // isArtifactsEnabled.value = false
}

const collapse = (type: boolean) => {
  if (!type) {
    siderStyle.value.position = 'absolute'
    // siderStyle.value.overflow = 'auto'
    listHeight.value = 'calc(100vh - 47px - 110px - 42px - 15px)'
  } else {
    siderStyle.value.position = 'relative'
    listHeight.value = 'calc(100vh - 47px)'
  }
}
const scrollToBottom = throttle(function (force?: boolean) {
  nextTick(() => {
    if (messageContainerRef.value) {
      const containerHeight = messageContainerRef.value?.clientHeight

      if (force || messageContainerHeight.value !== containerHeight) {
        messageContainerHeight.value = containerHeight
        messageContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  })
}, 0)
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    message.error('文件大小不能超过10MB')
    return false
  }
}
const customRequest = (parmas: any) => {
  return new Promise((resolve, reject) => {
    const file = parmas.file
    isImage.value = isImageType(parmas.file.type)
    const url = isImage.value ? imageUploadUrl : documentConversionUrl
    const formData = new FormData()
    formData.append('file', file)
    if (isImage.value) {
      formData.append('client_idx', clientIdx)
      formData.append('client_type', clientType)
    }
    const myHeaders = new Headers()
    myHeaders.append('Authorization', apiKey)
    uploadDisabled.value = true
    const fileObj = {
      type: isImage.value ? 'image' : 'file',
      url: getUrl(file),
      name: file.name,
      loading: true
    }
    const len = messageList.value.push({
      role: 'user',
      content: inputText.value,
      file: fileObj
    })
    fetch(url, {
      method: 'POST',
      body: formData,
      headers: myHeaders
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (!data.file_name) {
          throw new Error('上传失败')
        }
        message.success('上传成功!')
        if (isImage.value) {
          uploadFileRes.value.push(data)
        } else {
          attachments.value.push(data)
        }
        const current = messageList.value[len - 1]
        if (current) {
          current.file.loading = false
        }
        uploadDisabled.value = false
        resolve(data)
      })
      .catch((err) => {
        message.error('上传失败')
        const current = messageList.value[len - 1]
        current.loading = false
        current.file.loading = false
        uploadDisabled.value = false
        console.log(err)
        reject(err)
      })
  })
}

// function stopReceiveMessage() {
//   if (!abortController.value) {
//     return
//   }

//   abortController.value.abort()
// }

function stopReceiveMessage() {
  if (!abortController.value) {
    return
  }

  abortController.value.abort()
  isStreaming.value = false
  isSend.value = false
}

const sendMessage = async () => {
  isSend.value = !isSend.value
  if (!isSend.value) {
    stopReceiveMessage()
    return
  }

  // 设置超时定时器
  const timeoutId = setTimeout(() => {
    stopReceiveMessage()
    message.error('链接超时无响应，请刷新页面重新开始对话或更换账号。')
  }, 60 * 1000) // 1分钟后中止请求

  const messageText = inputText.value
  inputText.value = ''

  const payload = {
    client_idx: clientIdx,
    client_type: clientType,
    attachments: attachments.value,
    files: uploadFileRes.value.map((v: any) => v.file_uuid),
    conversation_id: conversation_id.value,
    need_web_search: isNetworkEnabled.value, // 添加这一行
    need_artifacts: isArtifactsEnabled.value
  }

  let resultText = ''
  isStreaming.value = true // 开始 streaming
  abortController.value = new AbortController()
  const chatOptions = {
    api_key: apiKey,
    message: messageText,
    model: selectModelValue.value,
    payload,
    controller: abortController.value,
    onProgress: (content: string, options: { done: boolean; d?: string }) => {
      modelDisabled.value = true
      let stringText = content
      scrollToBottom(true)
      resultText += stringText
      if (resultText !== '') {
        clearTimeout(timeoutId)
      }
      const current = messageList.value[messageList.value.length - 1]
      current.content = resultText
      current.loading = false
      if (options.done) {
        isStreaming.value = false // 结束 streaming
        conversation_id.value = options?.id ?? ''
        scrollToBottom(true)
        isSend.value = false
        uploadFileRes.value = []
        attachments.value = []
        fetchConversation(clientIdx, clientType, apiKey).then((res: any) => {
          if (res) {
            list.value = res
          }
        })
      }
    },
    onError: (err: any) => {
      isStreaming.value = false // 结束 streaming
      clearTimeout(timeoutId)
      stopReceiveMessage()
      const index = messageList.value.length - 1
      messageList.value.splice(index, 1)
      isSend.value = false
      modelDisabled.value = false
      clearState()
      message.error(err || '链接超时，请刷新页面重新开始对话或更换账号。')
    }
  }
  messageList.value.push(
    ...[
      {
        role: 'user',
        content: messageText,
        loading: false
      },
      {
        role: 'assistant',
        content: resultText,
        loading: true
      }
    ]
  )
  chat(chatOptions)
}
const sendKeyDown = (evt: any) => {
  if (evt.keyCode === 13 && !evt.shiftKey) {
    evt.preventDefault()
    sendMessage()
  }
}
const roleImgMap: any = {
  assistant: aiImg,
  user: userImg
}
const clearAll = async () => {
  if (!list.value.length) {
    message.warn('暂无聊天记录')
    return
  }
  try {
    await deleteAllConversation(clientIdx, clientType, apiKey)
    message.success('清空聊天记录成功')
    list.value = []
  } catch (e) {
    message.error('清空聊天记录失败')
  }
}
const changeItem = (item: MessageItem) => {
  messageList.value = item.messages
  conversation_id.value = item.conversation_id
  modelDisabled.value = true
  selectModelValue.value = item.model
}
const deleteItem = (item: MessageItem) => {
  const idx = list.value.findIndex((v) => v.conversation_id == item.conversation_id)
  if (idx !== -1) {
    list.value.splice(idx, 1)
  }
}
const deleteImg = (index: number) => {
  messageList.value.splice(index, 1)
  uploadFileRes.value.splice(index, 1)
}

const goUrl = (url: string) => {
  window.location.href = url
}
const newChat = () => {
  clearState()
}
const exit = () => {
  localStorage.removeItem('SJ_API_KEY')
  goUrl('/chat')
}
const md = 768
const sideWidth = devicewidth <= md ? '50vw' : 200
onMounted(async () => {
  if (!clientType || !clientIdx || !apiKey) {
    message.error('登录无效，请返回重新登录')
    goUrl('/chat')
  }
  sideLoading.value = true
  const res = await fetchConversation(clientIdx, clientType, apiKey)
  if (res) {
    list.value = res
    sideLoading.value = false
  }
})

onUnmounted(() => {
  if (focusTimer) {
    clearTimeout(focusTimer)
  }
})

// ti
</script>

<template>
  <div class="chat-view">
    <a-layout class="absolute w-full">
      <a-layout-sider
        breakpoint="md"
        collapsed-width="0"
        :style="siderStyle"
        :width="sideWidth"
        :zeroWidthTriggerStyle="zeroWidthTriggerStyle"
        @collapse="collapse"
      >
        <a-spin :spinning="sideLoading">
          <a-list :locale="{ emptyText: '暂无聊天记录' }">
            <template v-for="(conversations, group) in groupedConversations" :key="group">
              <template v-if="conversations.length">
                <div class="group-header">{{ group }}</div>
                <a-list-item
                  v-for="item in conversations"
                  :key="item.conversation_id"
                  style="padding: 10px 5px"
                >
                  <div class="flex relative w-full cursor-pointer" @click="changeItem(item)">
                    <icon icon="icon-a-01_ai" :style="{ width: '20px', height: '20px' }"></icon>
                    <div
                      class="ml-4px w-8/10 text-ellipsis overflow-hidden whitespace-nowrap text-left"
                    >
                      {{ item?.messages[0]?.content ?? '' }}
                    </div>
                    <div
                      class="delete cursor-pointer pos-absolute right-0 hover:color-gray-950"
                      @click.stop="deleteItem(item)"
                    >
                      <icon icon="icon-delete" :style="{ width: '20px', height: '20px' }"></icon>
                    </div>
                  </div>
                </a-list-item>
              </template>
            </template>
            <template #header>
              <div class="flex w-full justify-between">
                <div class="flex">聊天记录</div>
                <div class="flex cursor-pointer" @click="clearAll">
                  <span>清空</span>
                </div>
              </div>
            </template>
          </a-list>
        </a-spin>
      </a-layout-sider>

      <a-layout>
        <a-layout-header :style="headerStyle">
          <div class="w-full flex justify-end">
            <div
              class="flex mr-20px justify-center cursor-pointer items-center color-gray-500 hover:color-gray-950"
              @click="newChat"
            >
              <icon icon="icon-switch" :style="{ width: '20px', height: '20px' }"></icon>
              <span class="ml-2">新建聊天</span>
            </div>
            <div
              class="flex mr-20px justify-center cursor-pointer items-center color-gray-500 hover:color-gray-950"
              @click="goUrl(`/claude/status?api_key=${apiKey}`)"
            >
              <icon icon="icon-switch" :style="{ width: '20px', height: '20px' }"></icon>
              <span class="ml-2">换号</span>
            </div>
            <div
              class="flex justify-center cursor-pointer items-center color-gray-500 hover:color-gray-950"
              @click="exit"
            >
              <icon icon="icon-switch" :style="{ width: '20px', height: '20px' }"></icon>
              <span class="ml-2">退出</span>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content :style="contentStyle">
          <div ref="messageContainerRef">
            <div
              class="w-full flex flex-wrap pt-5 pb-5 relative"
              v-for="(item, index) in messageList"
              :key="index"
            >
              <div class="flex absolute">
                <a-avatar
                  :size="50"
                  shape="circle"
                  :src="roleImgMap[item.role]"
                  :class="{
                    'assistant-avatar-heartbeat':
                      item.role === 'assistant' && index === messageList.length - 1 && isStreaming
                  }"
                ></a-avatar>
              </div>
              <div class="lh-normal flex pl-60px text-left">
                <template v-if="item?.file">
                  <a-spin :spinning="item.file.loading">
                    <div
                      class="flex pa-10px border-solid border border-gray rounded-2xl pos-relative"
                    >
                      <div
                        class="pos-absolute -right-10px -top-10px bg-gray pa-5px rounded-full z-1 cursor-pointer hover:color-gray-950"
                        @click="deleteImg(index)"
                      >
                        <icon
                          icon="icon-delete"
                          :style="{ width: '18px', height: '18px', color: '#000' }"
                        ></icon>
                      </div>
                      <div v-if="item.file.type == 'image'">
                        <a-image :width="100" class="object-cover" :src="item.file.url" />
                      </div>
                      <div class="flex color-gray-500" v-else>
                        <icon
                          class="mr-10px"
                          icon="icon-fujian-"
                          :style="{ width: '20px', height: '20px' }"
                        ></icon>
                        <div
                          class="ml-5px whitespace-nowrap text-ellipsis overflow-hidden max-w-40vw"
                        >
                          {{ item.file.name }}{{ item.file.name }}{{ item.file.name
                          }}{{ item.file.name }}
                        </div>
                      </div>
                    </div>
                  </a-spin>
                </template>
                <template v-else>
                  <MarkDownMessage
                    :text="item.content"
                    :index="index"
                    :role="item.role"
                    v-if="!item.loading"
                  ></MarkDownMessage>
                  <a-spin size="large" v-else />
                </template>
              </div>
            </div>
          </div>
        </a-layout-content>
        <a-layout-footer :style="footerStyle">
          <!--            <div class="w-100px mb-10px absolute z-1 -top-12px left-2">-->
          <!--              <a-select name="jailbreak" size="small" v-model:value="selectValue" id="jailbreak" placement="topLeft">-->
          <!--                <a-select-option value="default" selected>default</a-select-option>-->
          <!--                <a-select-option value="gpt-math-1.0">math 1.0</a-select-option>-->
          <!--                <a-select-option value="gpt-dude-1.0">dude 1.0</a-select-option>-->
          <!--                <a-select-option value="gpt-dan-1.0">dan 1.0</a-select-option>-->
          <!--                <a-select-option value="gpt-dan-2.0">dan 2.0</a-select-option>-->
          <!--                <a-select-option value="gpt-dev-2.0">dev 2.0</a-select-option>-->
          <!--                <a-select-option value="gpt-evil-1.0">evil 1.0</a-select-option>-->
          <!--              </a-select>-->
          <!--            </div>-->
          <div class="flex items-center w-100px mb-10px absolute z-1 -top-25px left-18px">
            <a-select
              :disabled="modelDisabled"
              name="model"
              size="middle"
              id="model"
              placement="topLeft"
              v-model:value="selectModelValue"
            >
              <a-select-option value="claude-3-sonnet-20240229"
                >claude-3-sonnet-20240229</a-select-option
              >
              <a-select-option value="claude-3-opus-20240229"
                >claude-3-opus-20240229</a-select-option
              >
              <a-select-option value="claude-3-haiku-20240307"
                >claude-3-haiku-20240307</a-select-option
              >
              <a-select-option value="claude-3-5-sonnet-20240620"
                >claude-3-5-sonnet-20240620</a-select-option
              >
            </a-select>

            <!-- 联网开关 -->
            <div class="ml-4 flex items-center">
              <a-switch
                v-model:checked="isNetworkEnabled"
                :style="{ backgroundColor: isNetworkEnabled ? '#ba5b38' : '' }"
              />
              <span class="ml-2 text-gray-500 text-sm"> 联网 </span>
            </div>

            <!-- artifacts开关 -->
            <div class="ml-4 flex items-center">
              <a-switch
                v-model:checked="isArtifactsEnabled"
                :disabled="modelDisabled"
                :style="{ backgroundColor: isArtifactsEnabled ? '#ba5b38' : '' }"
              />
              <span class="ml-2 text-gray-500 text-sm"> 预览 </span>
            </div>
          </div>

          <div class="relative">
            <div
              class="absolute cursor-pointer right-60px bg-[#f0eee5] color-gray-500 top-20px font-size-12px rounded-full z-1 flex w-35px h-35px justify-center items-center"
            >
              <a-upload
                :before-upload="beforeUpload"
                :disabled="uploadDisabled"
                :accept="accept"
                class="flex"
                v-model:file-list="fileList"
                name="file"
                :max-count="1"
                :customRequest="customRequest"
                @change="handleChange"
              >
                <icon icon="icon-fujian-" :style="{ width: '20px', height: '20px' }"></icon>
                <template #itemRender> </template>
              </a-upload>
            </div>
            <div
              id="send-button"
              :class="
                uploadDisabled
                  ? 'bg-[#efefefff] cursor-not-allowed color-[#a3a6aa]'
                  : 'bg-[#ba5b38] cursor-pointer'
              "
              class="absolute right-20px top-20px font-size-12px rounded-full z-1 flex w-35px h-35px justify-center items-center"
              @click="sendMessage"
            >
              <icon
                :icon="isSend ? 'icon-iconfontstop' : 'icon-jijianfasong-xianxing'"
                :style="{ width: '20px', height: '20px' }"
              ></icon>
            </div>

            <!-- 添加了一个处理黏贴的部分 -->

            <div class="pos-relative">
              <a-textarea
                @keydown="sendKeyDown"
                @paste="handlePaste"
                class="rounded-2xl pa-10px"
                v-model:value="inputText"
                placeholder="请输入内容或粘贴图片"
                :auto-size="{ minRows: 4, maxRows: 8 }"
              />
            </div>
          </div>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>
<style lang="scss">
.chat-view {
  .ant-layout {
    background: none;
  }

  .ant-list-header,
  .ant-list-items {
    margin: 0px 15px;
  }
  .ant-list-items {
    margin-bottom: 15px;
    height: v-bind('listHeight');
    flex: 1; // 让列表项容器占据所有剩余空间
    overflow-y: auto; // 只在垂直方向允许滚动
  }

  .ant-layout-sider {
    .ant-spin-nested-loading,
    .ant-spin-container {
      height: 100%;
    }
  }

  .group-header {
    font-weight: bold;
    padding: 10px 5px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
  }

  .ant-list-item {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }
}

.assistant-avatar-heartbeat {
  animation: avatar-heartbeat 1.4s ease-in-out infinite;
}

@keyframes avatar-heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  15% {
    transform: scale(0.6);
  }
  30% {
    transform: scale(0.9);
  }
  45% {
    transform: scale(0.6);
  }
  60% {
    transform: scale(0.95);
  }
}
</style>
