import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const app = createApp(App)
app.config.globalProperties.$toast = Toastify
app.use(router)
app.mount('#app')
