// import './assets/main.css'
import antd from 'ant-design-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '//at.alicdn.com/t/c/font_4565805_mtkshfnyzag.js'

import App from './App.vue'
import router from './router'
import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(antd)
app.mount('#app')
