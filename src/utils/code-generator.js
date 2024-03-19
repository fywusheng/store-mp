var barcode = require('./barcode')
var qrcode = require('./qrcode')

function convert_length(length) {
  return Math.round(uni.getSystemInfoSync().windowWidth * length / 750)
}

function barc(id, instance, code, width, height) {
  barcode.code128(uni.createCanvasContext(id, instance), code, convert_length(width), convert_length(height))
}

function qrc(id, instance, code, width, height) {
  qrcode.api.draw(code, {
    ctx: uni.createCanvasContext(id, instance),
    width: convert_length(width),
    height: convert_length(height)
  })
}

module.exports = {
  barcode: barc,
  qrcode: qrc
}
