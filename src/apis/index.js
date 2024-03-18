// 自动导入 modules 中所有的接口
let apis = {}
const context = require.context('./modules', true, /\.js$/)
context.keys().forEach((item) => {
  const module = context(item)
  apis = { ...apis, ...(module.default || module) }
})

export default apis
