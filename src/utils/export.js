export function exportExcel (fileData, documentName = 'excel') {
  /*
  PRIVATE_DOC: 应用私有文档目录常量
  PUBLIC_DOCUMENTS: 程序公用文档目录常量
  */
  plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
    let rootObj = fs.root
    let fullPath = rootObj.fullPath
    console.log("开始导出数据********")
    // 创建文件夹
    rootObj.getDirectory(documentName, {
      create: true
    }, function(dirEntry) {
      // 创建文件,防止重名
      let fileName = new Date().getTime()
      console.log(fileName)
      dirEntry.getFile(`${fileName}.xlsx`, {
        create: true
      }, function(fileEntry) {
        fileEntry.createWriter(function(writer) {
          writer.onwritestart = (e) => {
            showLoading('正在导出')
          }
          writer.onwrite = (e) => {
            // 成功导出数据
            hideLoading()
            setTimeout(() => {
              showToast('导出成功')
              const path = `file://${fullPath}${documentName}/${fileName}.xlsx`
              console.log('文件位置：', path)
              // 打开文件
              uni.openDocument({
                filePath: path,
                success: res => {
                  console.log('打开文档成功', res)
                },
                fail: e => {
                  console.log('打开失败', e)
                }
              })
            },500)
          }
          // 写入内容
          writer.write(fileData)
        }, function(e) {
          console.log(e.message)
        })
      })
    })
  })
}