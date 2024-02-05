import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import inject from '@rollup/plugin-inject'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    inject({
      Axios: 'axios', // 这里会自动载入 node_modules 中的 axios
      Store: ['@/store', 'default'],
      VUEX: '@/store/mutation-types.js',
      ENV: ['@/config/env', 'default']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})



