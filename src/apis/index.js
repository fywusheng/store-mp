const modules = import.meta.glob('./modules/*.js', { eager: true })   // 批量导入 /apis 文件夹下所有js文件
let apis = {} // 导出的对象
for (const path in modules) {
  const module =  modules[path]
  apis = { ...apis, ...(module.default || module) }
}

export default apis
