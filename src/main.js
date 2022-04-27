import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入图标库
import '../src/assets/fonts/iconfont.css'
import '../src/assets/css/index.scss'

const app = createApp(App)

app.use(store).use(router).mount('#app')
