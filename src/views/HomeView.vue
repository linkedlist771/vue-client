<template>
  <div
    class="w-full pb-10 h-full absolute overflow-scroll"
    style="background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)"
  >
    <div
      class="flex flex-col w-11/12 sm:w-9/12 mx-auto mt-10 sm:mt-20 border-solid border border-gray rounded-2xl p-5 sm:p-10 max-w-700px"
    >
      <div class="w-full text-lg sm:text-xl font-semibold text-center">
        此为公益网址，欢迎大家免费体验，转发给有需要的朋友。
      </div>
      <div class="w-full text-base sm:text-lg mt-5 text-center" style="line-height: 1.6">
        点击下方按钮，无需魔法，
        <br />
        即可免费体验 claude 和 chatgpt 官网，
        <br />
        并支持付费使用 plus 账号，
        <br />
        GPT 官网直登可免魔法登录，但需要 chatgpt 官网账号。
      </div>
      <div class="w-full text-base sm:text-lg leading-relaxed text-center mt-5">
        如需账号或获取体验密码请联系微信：<strong>liulidsj</strong> 或在商城购买
      </div>
    </div>
    <div
      class="flex w-11/12 sm:w-10/12 mx-auto mt-10 sm:mt-20 justify-center items-center max-w-800px bg-[#dcdadaff] p-4 sm:p-8 rounded-2xl"
    >
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 5 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item :key="item.idx">
            <a-button :class="['custom-button', 'button-' + item.idx]" block>
              <a :href="item.href" class="py-2 sm:py-4 text-center block w-full">{{ item.text }}</a>
            </a-button>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const data = ref([
  {
    idx: 1,
    href: '/chat',
    text: 'claude独享入口'
  },
  {
    idx: 2,
    href: 'https://claude35.liuli.585dg.com',
    text: 'claude官网站'
  },
  {
    idx: 3,
    href: 'https://ai.yoyogpt.online/chatgpt/login',
    text: 'chatgpt账号池'
  },
  {
    idx: 4,
    href: 'https://chat.closeai.biz',
    text: 'chatgpt独享入口'
  },
  {
    idx: 5,
    href: 'https://shop.liuli.585dg.com',
    text: '账号购买商城'
  }
])

onMounted(() => {
  const apiKey = localStorage.getItem('SJ_API_KEY')
  if (apiKey) {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const targetUrl = baseUrl + '/claude/status' + '?api_key=' + apiKey
    data.value[0].href = targetUrl
  }
})
</script>

<style scoped>
.custom-button {
  height: auto;
  white-space: normal;
  text-align: center;
  line-height: 1.2;
  padding: 10px 5px;
}

.button-1 {
  background-color: #A5D6A7; /* 浅绿色 */
  border-color: #A5D6A7;
}
.button-2 {
  background-color: #90CAF9; /* 浅蓝色 */
  border-color: #90CAF9;
}
.button-3 {
  background-color: #FFF59D; /* 浅黄色 */
  border-color: #FFF59D;
}
.button-4 {
  background-color: #CE93D8; /* 浅紫色 */
  border-color: #CE93D8;
}
.button-5 {
  background-color: #FFAB91; /* 浅橙色 */
  border-color: #FFAB91;
}

.button-1:hover, .button-2:hover, .button-3:hover, .button-4:hover, .button-5:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .custom-button {
    font-size: 14px;
    padding: 8px 4px;
  }
}
</style>