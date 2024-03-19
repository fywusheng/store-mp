export default {
  // 版本号
  VERSION: '1.4.7',
  // 环境常量
  NODE_ENV: process.env.NODE_ENV,
  NODE_ENV_DEVELOPMENT: process.env.NODE_ENV === 'development',
  NODE_ENV_PRODUCTION: process.env.NODE_ENV === 'production',
  // 商城基础url
  API: {
    development: 'https://mall.hling168.com/mall-client-api',
    // development: 'http://192.168.1.187:18888',
    test: 'http://192.168.1.187:18888',
    production: 'https://mall.hling168.com/mall-client-api'
  }[process.env.NODE_ENV],
  // 基础url
  BASE_API: {
    development: 'http://192.168.1.187:28800',
	// development: 'http://192.168.1.187:18888',
	// development:'http://IP:PORT',
	// development: 'http://192.168.1.187:10188',
    test: 'http://192.168.1.187:10000/api',
    production: 'https://api.hpgjzlinfo.com/nepsp-api'
  }[process.env.NODE_ENV],
  BASE_1: {
    // development: 'http://192.168.1.187:28800',
  	development: 'http://192.168.1.187:18888',
  	// development: 'http://192.168.1.187:10188',
    test: 'http://192.168.1.187:10000/api',
    production: 'https://api.hpgjzlinfo.com/nepsp-api'
  }[process.env.NODE_ENV],
  BASE_2: {
    // development: 'http://192.168.1.187:28800',
  	// development: 'http://192.168.1.187:18888',
  	development: 'http://192.168.1.187:10188',
    test: 'http://192.168.1.187:10000/api',
    production: 'https://api.hpgjzlinfo.com/nepsp-api'
  }[process.env.NODE_ENV],
  BASE_3: {
    development: ' http://192.168.1.187:10000/api',
  	// development: 'http://192.168.1.187:18888',
  	// development: 'http://192.168.1.187:10188',
    test: 'http://192.168.1.187:10000/api',
    production: 'https://api.hpgjzlinfo.com/nepsp-api'
  }[process.env.NODE_ENV],
  // http://192.168.1.187:10000/api/ngcmn/wbst/msgtype/list
  // 静态域
  ASSETS: {
    development: 'http://39.101.162.232/',
    test: 'http://39.101.162.232/',
    production: '//39.101.162.232/'
  }[process.env.NODE_ENV],
  SEARCH_BASE: {
    development: 'http://192.168.1.187:18888',
    test: 'http://192.168.1.187:18888',
    production: 'http://192.168.1.187:18888'
  }[process.env.NODE_ENV],
  SEARCH_PLAN: {
    development: 'http://192.168.1.187:18888/search/productList',
    test: 'http://192.168.1.187:18888/plan/search/productList',
    production: 'http://192.168.1.187:18888/search/productList'
  }[process.env.NODE_ENV],
  // 默认图片
  IMG_DEFAULT: 'http://192.168.1.187:10088/static/home/image-home-article-default.png'
}
