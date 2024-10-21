<template>
  <div class="w-full absolute" :style="{
    backgroundImage: isDarkMode
      ? 'linear-gradient(-20deg, #E0C3FC 0%, #8EC5FC 100%)'
      : 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)'
  }">
    <div class="flex flex-col w-9/12 mx-auto mt-10 gap-4">
      <!-- 添加切换按钮 -->

      <div class="absolute top-0 right-0 mt-4 mr-4 flex items-center">

        <div class="flex justify-center cursor-pointer items-center color-gray-500 hover:color-gray-950" @click="exit">
          <icon icon="icon-switch" :style="{ width: '20px', height: '20px' }"></icon>
          <span class="ml-2">退出</span>
        </div>
      </div>

      <a-alert v-if="showAnnouncement" message="重要公告" type="info" show-icon closable @close="closeAnnouncement"
        style="margin-bottom: 20px">
        <template #description>
          <div v-html="announcementContent"></div>
        </template>
      </a-alert>

      <div class="text-lg border border-gray border-solid rounded-2xl pa-30px max-w-1000px mx-auto lh-relaxed">
        选择状态为可用的账号使用，当下方使用账号次数达到上限时，这时候你需要点击换号，选择一个可用的账号使用。
        要想长期保留记录，请在此账号下续费，不然记录会丢失。
        如出现报错或无回复，请尝试刷新页面或退出账号重新登录，开始新对话即可使用。

        <li>普通账户只能使用<strong style="font-weight: bold">普通账号 </strong>的Sonnet3.5模型</li>
        <li>
          plus账户还能使用plus账号的<strong style="font-weight: bold">
            Opus 和Sonnet3.5模型
          </strong>
          ， 并且有<strong style="font-weight: bold">更大</strong> 的配额。
        </li>
      </div>
    </div>
    <div class="mx-auto w-9/10 mt-20">
      <div v-if="loading" style="text-align: center; padding: 20px; font-size: 16px; color: #999">
        <a-spin size="large" />
        <p style="margin-top: 10px">加载中账号中....</p>
      </div>
      <a-list v-else :grid="{ gutter: 1, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :data-source="[{
        id: 'additional', type: 'claude官网', meta_data: {
          'official_login': true
        },
        message: 'Claude官网(联系对接人获取秘钥)'
      }, ...data,]">


        <template #renderItem="{ item }">
          <a-list-item :key="item.idx">
            <a-card :title="item.id" @click="goUrl(item)" :class="{
              'cursor-pointer': true,
              'card-plus': item.type === 'plus',
              'card-normal': item.type === 'normal',
              'card-cd': item.status === 'cd',
              'card-noncd': item.status !== 'cd'
            }">
              <template #extra>
                <a-tag :color="getTagColor(item)" :visible="item.is_session_login">官网1:1</a-tag>
                <a-tag :color="item.type === 'normal' ? '#2db7f5' : '#f50'" :class="{
                  'tag-plus': item.type === 'plus',
                  'tag-normal': item.type === 'normal',
                  'tag-cd': item.status === 'cd',
                  'tag-noncd': item.status !== 'cd'
                }">
                  {{ item.type }}
                </a-tag>
              </template>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-statistic title="使用次数" :value="item.usage" :value-style="{ color: '#3f8600' }" />
                </a-col>
                <a-col :span="12">
                  <a-statistic title="状态" :value="item.status === 'cd' ? '冷却' : '可用'"
                    :value-style="{ color: item.status === 'cd' ? '#cf1322' : '#3f8600' }" />
                </a-col>
              </a-row>
              <a-tooltip :title="item.message">
                <div class="message-ellipsis">{{ item.message }}</div>
              </a-tooltip>
            </a-card>

          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Ref } from 'vue'
import { sendRequest, getQueryParam, baseSendRequest } from '@/api/status.js'
import { message } from 'ant-design-vue'
import { Card, Tag, Statistic, Row, Col, Tooltip } from 'ant-design-vue';
import { isPc } from '@/util/is'
import { reverseClaudeBaseUrl } from '@/config/constants'

import Icon from '@/components/icon/index.vue'

const exit = () => {
  localStorage.removeItem('SJ_API_KEY')
  window.location.href = '/chat'
}

interface DataItem {
  id: string
  status: string
  type: string
  idx: number
  message: string
  is_session_login: boolean
  usage: number
  remaining: number
  meta_data: Record<string, any>
}


const data: Ref<DataItem[]> = ref([])
const apiKey = getQueryParam('api_key') || (localStorage.getItem('SJ_API_KEY') as string)
const loading = ref(true)
const isDarkMode = ref(false)
const getTagColor = computed(() => (item: DataItem) => {
  if (item.is_session_login) return '#87d068'
  if (item.type === 'normal') return '#2db7f5'
  if (item.usage < 10 && item.status !== 'cd') return '#ffff00' // 添加这一行
  return '#f50'
})
const usageLimit: Ref<number> = ref(0)
const currentUsage: Ref<number> = ref(0)

const goUrl = async (cardData: DataItem) => {


  if (cardData.meta_data && 'official_login' in cardData.meta_data) {
    if (cardData.meta_data['official_login']) {
      window.open('https://claude35.liuli.585dg.com', '_blank')
      return
    }
  }


  if (!cardData.is_session_login) {
    const targetURLBase = window.location.protocol + '//' + window.location.host + '/claude/chat'
    const targetURL =
      targetURLBase +
      '?api_key=' +
      apiKey +
      '&client_idx=' +
      cardData.idx +
      '&client_type=' +
      cardData.type
    window.location.href = targetURL
  } else {
    const payload = {
      client_idx: cardData.idx,
      client_type: cardData.type
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: apiKey
    }

    const loginInRes = await baseSendRequest(
      '/claude/obtain_reverse_official_login_router',
      'POST',
      headers,
      {},
      payload
    )
    if (loginInRes.valid) {
      // message.info('进入官网1：1登录页面')

      // const loginUrl = loginInRes.data.login_url
      // const targetURL = `${reverseClaudeBaseUrl}${loginUrl}`
      // // 尝试打开新窗口
      // window.open(targetURL, '_blank')
      // message.info('进入官网1：1登录页面').then(() => {
      //   const loginUrl = loginInRes.data.login_url
      //   const targetURL = `${reverseClaudeBaseUrl}${loginUrl}`
      //   // 尝试打开新窗口
      //   window.open(targetURL, '_blank')
      // }) change into set time interval
      message.info('进入官网1：1登录页面')
      const loginUrl = loginInRes.data.login_url
      const targetURL = `${reverseClaudeBaseUrl}${loginUrl}`
      window.open(targetURL, '_blank')
      // 尝试打开新窗口      // }) change into set time interval
      // setTimeout(() => {
      //   window.open(targetURL, '_blank')
      // }, 1000)
    } else {
      const errorMessage = loginInRes.message
      message.error(errorMessage)
    }

    // 这里怎么使用那种类似 新打开一个网页而不是改变当前网页的方式呢？

    // console.log(loginInRes, 'loginInRes')

    // const sessionKey = cardData.meta_data.session_key

    // const isSessionKeyLoginUrl = `${reverseClaudeBaseUrl}/login_token?session_key=${sessionKey}`

    // window.location.href = isSessionKeyLoginUrl
    // 这里要改一下了哦。
  }
}

const showAnnouncement = ref(false)
const announcementContent = `版本跟新了， 目前官网1：1能实现对话隔离，但是每次有三小时时限， 并且每次进入都将增加15次使用次数， 可以查看 <a href="https://w0zqg6m28ev.feishu.cn/docx/XiHfdcqq4oMeVGxBfPRcuxlUnBb?from=from_copylink" target="_blank">这个文档</a> 查看具体使用方法。`

const announcementVersion = '0.5' // 每次更新公告时，更改这个版本号

const checkAndShowAnnouncement = () => {
  const lastSeenVersion = localStorage.getItem('announcementVersion')
  if (lastSeenVersion !== announcementVersion) {
    showAnnouncement.value = true
    localStorage.setItem('announcementVersion', announcementVersion)
  }
}

const closeAnnouncement = () => {
  showAnnouncement.value = false
}

const toggleDarkMode = (check: boolean) => {
  isDarkMode.value = check
}

onMounted(async () => {
  if (!apiKey) {
    message.error('登录无效，请返回重新登录')
    window.location.href = '/chat'
  }
  // check 一下过期事件
  try {
    loading.value = true
    const expired_res = await sendRequest('/api_key/get_information/' + apiKey, 'GET')
    const is_key_valid = expired_res.is_key_valid
    // currentUsage.value = expired_res.current_usage
    usageLimit.value = expired_res.usage_limit
    if (is_key_valid) {
      message.info('账号过期时间：' + expired_res.expire_time)
    } else {
      localStorage.removeItem('SJ_API_KEY')
      message.error('账号密钥以及过期或失效，请返回重新登录')
      window.location.href = '/chat'
    }

    const res = await sendRequest('/clients_status', 'GET')
    console.log(res, 'res')
    data.value = res
  } catch (error) {
    console.error('Error loading data:', error)
    message.error('加载数据失败，请重试')
  } finally {
    loading.value = false
  }
  checkAndShowAnnouncement()
})
</script>
<style>
/* 切换预览内容 */
.message-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-top: 8px;
}

.night-mode {
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
}

.night-mode-text {
  color: #ffffff;
}

/* 添加自定义样式来放大开关 */
.custom-switch {
  transform: scale(1.5);
  /* 整体放大1.5倍 */
}

/* 可选：调整开关内部图标的大小和位置 */
.custom-switch :deep(.ant-switch-handle) {
  width: 24px;
  height: 24px;
  top: 2px;
}

.custom-switch :deep(.ant-switch-inner) {
  font-size: 16px;
  /* 调整图标大小 */
  line-height: 28px;
  /* 调整图标垂直位置 */
}

/* 调整开关的整体尺寸 */
.custom-switch :deep(.ant-switch) {
  min-width: 60px;
  height: 32px;
}

/* 切换预览内容 */

.ant-alert-description a {
  color: #1890ff;
  text-decoration: none;
}

.ant-alert-description a:hover {
  text-decoration: underline;
}

.card-plus {
  border: 2px solid #ff69b4;
  animation: rainbow-border 2s linear infinite;
}

.card-normal {
  border: 2px solid #2db7f5;
}

.card-cd {
  background-color: #e0f7fa;
}

.card-noncd {
  background-color: #ffffff;
}

.tag-plus {
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: #ffffff;
}

.tag-normal {
  background-color: #2db7f5;
  color: #ffffff;
}

.tag-cd {
  background-color: #26a69a;
  color: #ffffff;
}

.tag-noncd {
  background-color: #f44336;
  color: #000000;
}

.tag-session {
  background-color: #ff9800;
  color: #ffffff;
  z-index: 10000;
}

@keyframes rainbow-border {
  0% {
    border-color: #ff69b4;
  }

  14% {
    border-color: #ff1493;
  }

  28% {
    border-color: #ff4500;
  }

  42% {
    border-color: #ff8c00;
  }

  56% {
    border-color: #ffd700;
  }

  70% {
    border-color: #adff2f;
  }

  84% {
    border-color: #00ff7f;
  }

  100% {
    border-color: #1e90ff;
  }
}
</style>
