import { createSSRApp } from 'vue'
import store from './store'
import App from './App'
import uniapp from '@/utils/uni'
import '@/config/axios'

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$uni = uniapp
  app.use(store)
  return {
      app
  }
}
