<template>
  <a-modal
    v-model:open="open"
    title=""
    :footer="null"
    centered
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
  >
    <div class="w-80px justify-center flex ma-auto">
      <img class="max-w-full" :src="imgUrl" alt="" />
    </div>
    <div class="font-size-16px font-500 mb-10px mt-40px">{{ loginTitle }}</div>
    <a-input
      autocomplete="on"
      @pressEnter="isValidKey"
      v-model:value="inputValue"
      size="large"
      :placeholder="inputPlaceholder"
    />
    <div class="flex mt-20px justify-end">
      <a-button
        :disabled="disabled"
        @click="isValidKey"
        type="default"
        size="large"
        class="w-100px"
        style="background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)"
        >登录</a-button
      >
    </div>
    <div class="mt-10px text-center">
      <a-button type="link" @click="toggleLoginMethod">
        {{ isSessionKeyLogin ? '使用秘钥登录' : '使用sessionKey登录' }}
      </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, nextTick, onBeforeMount, onMounted, computed } from 'vue'
import imgUrl from '@/assets/claude-ai-icon.png'
import { message } from 'ant-design-vue'
import { baseUrl } from '@/config/constants'
import { reverseClaudeBaseUrl } from '@/config/constants'
const disabled = ref(false)
const inputValue = ref('')
const open = ref(false)
const isSessionKeyLogin = ref(false)
const loginTitle = computed(() => (isSessionKeyLogin.value ? '登录SessionKey' : '登录秘钥'))
const inputPlaceholder = computed(() =>
  isSessionKeyLogin.value ? '输入SessionKey(sk-ant-xxxx)' : '输入登录秘钥(sk-xxxxxx)'
)
// const reverseClaudeBaseUrl = 'https://claude.liuligpt.com'

function toggleLoginMethod() {
  isSessionKeyLogin.value = !isSessionKeyLogin.value
  inputValue.value = ''
}

function loginWithAPIKey() {
  const apiKey = inputValue.value
  const url = `${baseUrl}/api/v1/api_key/validate_key/${apiKey}`
  if (apiKey == '') {
    return
  }
  disabled.value = true
  // Use the Fetch API to make the GET request
  fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.is_valid) {
        message.success('登录成功')
        localStorage.setItem('SJ_API_KEY', apiKey)
        const baseUrl = window.location.protocol + '//' + window.location.host
        const targetUrl = baseUrl + '/claude/status' + '?api_key=' + apiKey
        nextTick(() => {
          window.location.href = targetUrl
        })
      } else {
        message.error('该密码已过期或不存在，请重新购买。')
        localStorage.removeItem('SJ_API_KEY')
      }
    })
    .catch((error) => {
      message.error('登录发生错误')
      localStorage.removeItem('SJ_API_KEY')
    })
    .finally(() => {
      disabled.value = false
    })
}

// 做一个简单的校验
function simpleCheckSessionKey(sessionKey: string) {
  // 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
  if (!sessionKey.startsWith('sk-ant-')) {
    message.error('sessionKey格式错误, sessionKey格式为sk-ant-xxxx')
    return false
  }
  return true
}

function loginWithSessionKey() {
  if (!simpleCheckSessionKey(inputValue.value)) {
    return
  }
  const sessionKey = inputValue.value
  if (sessionKey == '') {
    message.error('请输入sessionKey')
    return
  }
  const isSessionKeyLoginUrl = `${reverseClaudeBaseUrl}/login_token?session_key=${sessionKey}`

  window.location.href = isSessionKeyLoginUrl
}

function isValidKey() {
  if (isSessionKeyLogin.value) {
    loginWithSessionKey()
  } else {
    loginWithAPIKey()
  }
}
const hasKey = ref(false)
onBeforeMount(async () => {
  const apiKey = localStorage.getItem('SJ_API_KEY')
  if (apiKey) {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const targetUrl = baseUrl + '/claude/status' + '?api_key=' + apiKey
    hasKey.value = true
    window.location.href = targetUrl
  }
})

onMounted(() => {
  open.value = !hasKey.value
})
</script>
