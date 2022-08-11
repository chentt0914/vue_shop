import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//字体图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局样式表
import './assets/css/base.css'




const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

