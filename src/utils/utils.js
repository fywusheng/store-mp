import api from '@/apis/index.js'
/**
 * 函数防抖
 */
export function debounce(fn, delay) {
  // 记录上一次的延时器
  var timer = null
  var delayT = delay || 200
  return function () {
    var args = arguments
    var that = this
    // 清除上一次延时器
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(that, args)
    }, delayT)
  }
}

/**
 * 人脸识别
 */
export function startFacialRecognitionVerify(params) {
  // #ifdef MP-WEIXIN
  wx.startFacialRecognitionVerify({
    name: params.name,
    idCardNumber: params.idCard, // 身份证号码
    // checkAliveType: "", 人脸核验的交互方式，默认读数字（见表1）
    success: (res) => {
      // errCode为0时表示人脸通过完成
      if (res.errCode == 0) {
        params.success()
      }
    },
    fail: (err) => {
      console.log(err, 'err')
    }
  })
  // #endif

  // #ifdef MP-ALIPAY
  console.log('====支付宝唤醒4---', params)
  api.getAliPayCertifyParams({
    data: {
      bizCode: 'FACE',
      userName: params.name, // params.name,
      idCard: params.idCard, // params.idCard,
      returnUrl: 'www.baidu.com'
    },
    success: (data) => {
      my.startAPVerify({
        url: data.certifyUrl,
        certifyId: data.certifyId,
        success: (res) => {
          console.log('success--', res)
          if (res['resultStatus'] == '9000') {
            const result = res['result']
            const certifyId = result['certifyId']
            api.certifyQuery({
              data: {
                certifyId: certifyId
              },
              success: (query) => {
                console.log('==query---', query)
                if (query['passed'] == 'T') {
                  const materialInfo = query['materialInfo']
                  const object = JSON.parse(materialInfo)
                  const facial_picture_front = object['facial_picture_front'] || {}
                  const FEATURE_FACE = facial_picture_front['FEATURE_FACE']
                  console.log('====图片---', FEATURE_FACE)
                  params.success(FEATURE_FACE)
                }
              },
              fail: (e) => {
                console.log('==erro---', e)
              }
            })
          }
        },
        fail: function (res) {
          console.log('fail--', res)
        },
        complete: function (res) {
          console.log('complete--', res)
        }
      })
    },
    fail: (res) => {
      console.log('自己接口fail--', res)
    },
    complete: (res) => {
      console.log('自己接口complete--', res)
    }
  })
  // #endif
}
/* 拍照
*/
export function cameraAuth(params) {
  uni.setStorageSync('typeChoice', 'scan')
  uni.chooseImage({
    sourceType: params.sourceType || ['camera'],
    count: params.count || 1,
    success: (res) => {
      console.log('图片success：', res)
      // #ifdef MP-WEIXIN
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        encoding: 'base64',
        success: (rs) => {
          const image64 = rs.data
          params.success(image64)
        }
      })
      // #endif
      // #ifdef MP-ALIPAY
      my.getImageInfo({
        src: res.tempFilePaths[0],
        success: (resImg) => {
          console.log('图片数据resImg：', resImg)
          this.imgWidth = resImg.width
          this.imgHeight = resImg.height
          console.log('图片规格imgWidth：', this.imgWidth)
          console.log('图片规格imgHeight：', this.imgHeight)
          const canvas = my.createCanvasContext('canvas')
          canvas.drawImage(
            res.tempFilePaths[0],
            0,
            0,
            this.imgWidth,
            this.imgHeight
          ) // 1. 绘制图片至canvas
          // 绘制完成后执行回调
          canvas.draw(false, () => {
            console.log('绘制完成后执行回调')
            canvas
              .toDataURL({
                width: this.imgWidth,
                height: this.imgHeight,
                quality: 1
              })
              .then((baseImg) => {
                console.log('图片baseImg：', baseImg)
                const base64 = baseImg.split(',')[1]
                console.log('图片base64：', base64)
              })
          })
        }
      })
      // #endif
    },
    complete: (res) => {
      console.log('图片complete：', res)
    }
  })
}
/**
 * 拍照2  TODO 4月8日 测试发现支付宝小程序获取base64失效，以下做兼容处理
 */
export function openCameraAuth(params) {
  uni.chooseImage({
    sourceType: params.sourceType || ['camera'],
    count: params.count || 1,
    success: (res) => {
      console.log('图片success：', res)
      // #ifdef MP-WEIXIN
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        encoding: 'base64',
        success: (rs) => {
          const image64 = rs.data
          params.success(image64)
        },
        fail: (erro) => {
          console.log('---异常拿到---', erro)
        }
      })
      // #endif
    },
    complete: (res) => {
      console.log('图片complete：', res)
    }
  })
}
/** **
 * 支付宝城市选择
 * 要求： list以alipay 格式为主 {name:'',subList:[]}
 * params:{
 * list:[],
 * success:()=>{}
 * }
 */
export function alipayCityChoose(params) {
  my.multiLevelSelect({
    title: '请选择省市区',
    list: params.list,
    success: (res) => {
      if (res.success) {
        const arg = res['result'].reduce(
          (pre, cur, i) => {
            pre.push(cur.name)
            return pre
          }, [])
        const selectDes = arg.join('')
        params.success(selectDes)
      }
    }
  })
}

/**
 * 获取银行卡背景色值
 * @param {string} name
 * @returns
 */
export function getBankBg(name) {
  if (!name) return '#ffffff'
  const key = name.substring(0, 2)
  const colorMap = {
    '浦发': '#000073',
    '光大': '#6A1685',
    '中信': '#C22B26',
    '上海': '#314693',
    '中国': '#A71E32',
    '邮政': '#02724A',
    '民生': '#0072BC',
    '工商': '#C22B26',
    '农业': '#009C96',
    '建设': '#00509C',
    '招商': '#A30030'
  }

  return colorMap[key] || '#A30030'
}

/**
 * 给的文件资源是否小于LimitSize （M）, 小于走lessCallBack， 大于走moreCallBack
 */
export function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
  uni.getFileInfo({
    filePath: imagePath,

    success(res) {
      console.log('压缩前图片大小:', res.size / 1024, 'kb')

      if (res.size > 1024 * 1024 * limitSize) {
        moreCallBack()
      } else {
        lessCallBack()
      }
    }
  })
} // 主调用方法

/**
 * 获取小于限制大小的Image, limitSize默认为1M，递归调用。
 */

export function getLessLimitSizeImage(canvasId, imagePath, limitSize = 1, drawWidth, callBack, which) {
  imageSizeIsLessLimitSize(
    imagePath,
    limitSize,
    (lessRes) => {
      callBack(imagePath)
    },
    (moreRes) => {
      uni.getImageInfo({
        src: imagePath,
        success: function (imageInfo) {
          var maxSide = Math.max(imageInfo.width, imageInfo.height) // 画板的宽高默认是windowWidth

          var windowW = drawWidth
          var scale = 1

          if (maxSide > windowW) {
            scale = windowW / maxSide
          }

          var imageW = Math.floor(imageInfo.width * scale)
          var imageH = Math.floor(imageInfo.height * scale)
          console.log('调用压缩', imageW, imageH)
          getCanvasImage(canvasId, imagePath, imageW, imageH, (pressImgPath) => {
            getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.7, callBack, which)
          }, which)
        }
      })
    }
  )
}
/**
 * 获取画布图片
 */

export function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess, which) {
  const ctx = uni.createCanvasContext(canvasId, which)
  ctx.drawImage(imagePath, 0, 0, imageW, imageH)
  ctx.draw(false, () => {
    uni.canvasToTempFilePath({
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: imageW,
      height: imageH,
      quality: 1,
      success(res) {
        getImgsuccess(res.tempFilePath)
      }
    }, which)
  })
}

/**
 * 判断是否高分辨率
 */
export function isIphoneHair (deviceInfo){
  const isIphoneX = /iPhone X/i.test(deviceInfo.model);
  // iPhone X or iPhone XS
  const isIphoneXS =
    deviceInfo.platform === "ios" &&
    deviceInfo.pixelRatio === 3 &&
    deviceInfo.screenWidth === 375 &&
    deviceInfo.screenHeight === 812;
  // iPhone XS Max
  const isIphoneXSMAX =
    deviceInfo.platform === "ios" &&
    deviceInfo.pixelRatio === 3 &&
    deviceInfo.screenWidth === 414 &&
    deviceInfo.screenHeight === 896;
  // iPhone XR
  const isIphoneXR =
    deviceInfo.platform === "ios" &&
    deviceInfo.pixelRatio === 2 &&
    deviceInfo.screenWidth === 414 &&
    deviceInfo.screenHeight === 896;
    
  return isIphoneX || isIphoneXS || isIphoneXSMAX || isIphoneXR;
}
/**
 * 生成随机唯一设备UUID
 * @returns uuid
 */
export function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}


export default {
  getLessLimitSizeImage,
  imageSizeIsLessLimitSize,
  getCanvasImage,
  isIphoneHair
}

