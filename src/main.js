import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'
import emitter from './methods/emitter'

import App from './App.vue'
import router from './router'

//載入動畫
import Loading from 'vue3-loading-overlay'
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import 'animate.css' // 引入 animate.css
import './assets/all.scss'

//swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css'

// 具名載入千分號
import { currency, date } from './methods/filters.js'

//表單驗證
// 引入 VeeValidate 元件跟功能
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
// 引入 VeeValidate 的驗證規則
import * as AllRules from '@vee-validate/rules'
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n'
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

// 將當前 VeeValidate 的語系設定為繁體中文
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true
})
setLocale('zh_TW')

const app = createApp(App)

app.use(VueAxios, axios)
app.config.globalProperties.$http = axios
app.config.globalProperties.emitter = emitter
app.use(createPinia())
app.use(router)
app.use(bootstrap)
app.use(VueAwesomeSwiper)

// app.config.globalProperties後面為自定義filter，建議其前面加上$字號，這樣子的話比較不會跟區域元件裡面的變數產生衝突
// 並把currency這個方法
app.config.globalProperties.$filters = {
  currency,
  date
}

app.component('VLoading', Loading)
// 掛載 Global 的 VeeValidate 元件
app.component('VField', Field)
app.component('VForm', Form)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
