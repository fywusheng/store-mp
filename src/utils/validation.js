/**
 *  校验手机号是否合法
 * @param {String} phoneNumber 手机号
 */
export function validatePhoneNumber(phoneNumber) {
  const pattern = /^[1]([3-9])[0-9]{9}$/
  return phoneNumber && pattern.test(phoneNumber)
}

/**
 * 校验密码是否合法
 * @param {String} password 密码
 * @param {String} rule 自定义的校验规则正则
 */
export function validatePassword(password, rule) {
  const pattern = rule || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
  return password && pattern.test(password)
}
/**
 * 校验邮箱是否合法
 * @param {String} email 邮箱
 * @param {String} rule 自定义的校验规则正则
 */
export function validateEmail(email, rule) {
  const pattern = rule || /^\s*$|^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/
  return email && pattern.test(email)
}
/**
 * 校验银行卡是否合法
 * @param {String} cardId 银行卡
 * @param {String} rule 自定义的校验规则正则
 */
export function validateBankNo(cardId, rule) {
  const pattern = rule || /^([1-9]{1})(\d{14}|\d{18})$/
  return cardId && pattern.test(cardId)
}

/**
 * 校验身份证号是否合法
 * @param {String} idCardNumber 身份证号
 */
export function validateIDCardNumber(idCardNumber) {
  if (typeof idCardNumber !== 'string') return false
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  var birthday =
    idCardNumber.substr(6, 4) +
    '/' +
    Number(idCardNumber.substr(10, 2)) +
    '/' +
    Number(idCardNumber.substr(12, 2))
  var d = new Date(birthday)
  var newBirthday =
    d.getFullYear() +
    '/' +
    Number(d.getMonth() + 1) +
    '/' +
    Number(d.getDate())
  var currentTime = new Date().getTime()
  var time = d.getTime()
  var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  var sum = 0
  var i
  var residue

  if (!/^\d{17}(\d|x)$/i.test(idCardNumber)) return false
  if (city[idCardNumber.substr(0, 2)] === undefined) return false
  if (time >= currentTime || birthday !== newBirthday) return false
  for (i = 0; i < 17; i++) {
    sum += idCardNumber.substr(i, 1) * arrInt[i]
  }
  residue = arrCh[sum % 11]
  if (residue !== idCardNumber.substr(17, 1)) return false

  return true
}

