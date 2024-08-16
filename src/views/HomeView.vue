<template>
  <div
    class="w-full pb-10 h-full absolute overflow-scroll"
    style="background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)"
  >
    <div
      class="flex flex-col w-9/12 mx-auto mt-20 border-solid border border-gray rounded-2xl pa-10 max-w-700px"
    >
      <div class="w-full font-size-5 font-600 text-center">
        此为公益网址，欢迎大家免费体验，转发给有需要的朋友。
      </div>
      <div class="w-full font-size-4 mt-5 text-center" style="line-height: 2">
        点击下方按钮，无需魔法，
        <br />
        即可免费体验 claude 和 chatgpt 官网，
        <br />
        并支持付费使用 plus 账号，
        <br />
        GPT 官网直登可免魔法登录，但需要 chatgpt 官网账号。
      </div>
      <div class="w-full font-size-4 leading-relaxed text-center">
        如需账号或获取体验密码请联系微信：<strong>liulidsj</strong> 或在商城购买
      </div>
    </div>
    <div
      class="flex w-10/12 mx-auto mt-20 justify-center justify-items-center max-w-800px bg-[#dcdadaff] pa-30px rounded-2xl"
    >
      <a-list :grid="{ gutter: 40, xs: 2, sm: 2, md: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item :key="item.idx" style="padding: 0">
            <a-button>
              <a :href="item.href" class="py-4 text-center">{{ item.text }}</a>
            </a-button>
          </a-list-item>
        </template>
      </a-list>
    </div>

    <!--    <div class="flex w-10/12 mx-auto mt-20 justify-between justify-items-center max-w-800px bg-[#dcdadaff] pa-30px rounded-2xl" style="">-->
    <!--      <a-button size="large">-->
    <!--        <a href="/chat" class="basis-1/5 py-4 text-center">claude账号池</a>-->
    <!--      </a-button>-->
    <!--      <a-button size="large">-->
    <!--        <a href="https://ai.yoyogpt.online/chatgpt/login" target="_blank" class="basis-1/5 py-4 text-center">chatgpt账号池</a>-->
    <!--      </a-button>-->
    <!--      <a-button size="large">-->
    <!--        <a href="https://chat.freegpts.org" target="_blank" class="basis-1/5 py-4 text-center">GPT官网直登</a>-->
    <!--      </a-button>-->
    <!--      <a-button size="large">-->
    <!--        <a href="https://store.liuligpt.space/" target="_blank" class="basis-1/5 py-4 text-center">账号商城</a>-->
    <!--      </a-button>-->
    <!--    </div>-->
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const data = ref([
  {
    idx: 1,
    href: '/chat',
    text: 'claude账号池'
  },
  {
    idx: 2,
    href: 'https://ai.yoyogpt.online/chatgpt/login',
    text: 'chatgpt账号池'
  },
  {
    idx: 3,
    href: 'https://chat.freegpts.org',
    text: 'GPT官网直登'
  },
  {
    idx: 4,
    href: 'https://shop.liuli.arelay.com',
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

import { isPc } from '@/util/is'
// function bodyScale() {
//   let devicewidth = document.documentElement.clientWidth //获取当前分辨率下的可是区域宽度
//   let scale = devicewidth / 700 // 分母——设计稿的尺寸
//   document.body.style.zoom = scale //放大缩小相应倍数
// }
// if (!isPc()) {
//   bodyScale()
// }
</script>
