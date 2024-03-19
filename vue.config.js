// const path = require('path')
const webpack = require('webpack')
// function resolve(dir) {
//   return path.join(__dirname, '.', dir)
// }


module.exports = {
transpileDependencies: ['@dcloudio/uni-ui'],
  configureWebpack: {
    resolve: {
      alias: {
        Axios: 'axios',
        _: 'lodash',
        VUEX: 'VUEX',
        ENV: 'ENV',
        XIU: 'XIU',
        Store: 'Store'
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Axios: 'axios',
        _: 'lodash',
        Store: ['@/store', 'default'],
        VUEX: '@/store/mutation-types.js',
        ENV: ['@/config/env', 'default'],
        XIU: ['@/utils', 'default']
      })
    ]
  }
}
