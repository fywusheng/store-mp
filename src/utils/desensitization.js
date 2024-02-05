/**
 * 姓名脱敏处理
 * @param {String} name 未脱敏的姓名
 */
export function desensitizeName(name) {
  if (!name) return name
  // 复姓列表, 用于姓名脱敏
  const compoundSurnames = ['百里', '北宫', '北堂', '北野', '曹岳', '常夏', '车非', '陈梁', '陈林', '陈生', '成公', '迟辟', '叱干', '叱利', '褚师', '淳于', '达奚', '大狐', '大野', '带曰', '单徒', '单于', '澹台', '邓李', '第二', '第五', '东方', '东宫', '东郭', '东门', '东野', '独孤', '独吉', '端木', '段干', '段阳', '范姜', '丰召', '高陈', '高堂', '高阳', '哥舒', '公保', '公乘', '公广', '公户', '公坚', '公肩', '公良', '公孟', '公孙', '公西', '公析', '公羊', '公冶', '公仪', '公祖', '谷梁', '毌将', '毌丘', '归海', '郭公', '郭罗', '还闵', '何阳', '贺陈', '贺兰', '贺若', '赫连', '黑齿', '呼延', '胡母', '胡杨', '斛律', '斛粟', '皇甫', '黄方', '黄龙', '吉胡', '即墨', '夹谷', '夹谷', '蒋申', '金狐', '九方', '可频', '孔令', '乐正', '冷富', '梁丘', '林彭', '陵尹', '令狐', '刘付', '刘谭', '龙丘', '陆费', '陆叶', '闾丘', '洛松', '洛阳', '明哲', '命提', '抹捻', '慕容', '纳兰', '南伯', '南方', '南宫', '南郭', '南门', '南容', '南野', '楠龙', '宁成', '女娲', '欧侯', '欧南', '欧阳', '辟闾', '仆固', '仆散', '蒲察', '濮阳', '普周', '漆雕', '亓官', '千秋', '钱赖', '钱王', '钳耳', '青柳', '青阳', '秋山', '屈卢', '屈突', '渠丘', '壤驷', '善续', '上官', '尚官', '少室', '少叔', '厍狄', '申叔', '申徒', '申屠', '申鲜', '石官', '石邵', '士孙', '侍其', '是云', '叔孙', '叔先', '叔仲', '淑鸟', '水城', '司秆', '司空', '司寇', '司马', '司琴', '司徒', '夙沙', '索卢', '拓跋', '太公', '太史', '太叔', '太阳', '唐古', '同蹄', '秃发', '屠岸', '完颜', '万俟', '王曹', '王孙', '微生', '韦开', '尉迟', '闻人', '巫马', '巫许', '无庸', '吴沈', '吴刘', '吾丘', '五兆', '西门', '夏侯', '鲜于', '相呈', '相礼', '相里', '相令', '相望', '相续', '新垣', '信平', '秀山', '徐离', '续相', '轩辕', '宣谈', '延陵', '阎法', '羊角', '羊舌', '阳迟', '杨若', '尧乐', '耶律', '伊祁', '瑛黄', '游子', '游走', '有琴', '於陵', '宇文', '袁州', '宰父', '泽久', '张包', '张官', '张简', '张廖', '章项', '仉督', '长儿', '长孙', '中叔', '钟离', '钟任', '仲孙', '仲贤', '仲长', '诸葛', '主父', '颛孙', '宗政', '左丘', '左人']

  const isCompoundSurname = compoundSurnames.indexOf(name.substring(0, 2)) !== -1
  const array = name.split('')
  const result = isCompoundSurname ? [array.shift(), array.shift()] : [array.shift()]
  if (array.length === 1) {
    result.push('*')
  } else {
    while (array.length > 1) {
      result.push('*')
      array.shift()
    }
    result.push(array.shift())
  }
  return result.join('')
}

/**
 * 邮箱脱敏处理
 * @param {String} email 未脱敏的邮箱
 */
export function desensitizeEmail(email) {
  if (!email) return email
  const pattern = /^([A-Za-z0-9_\-\.]+)(\@[A-Za-z0-9_\-\.]+\.([A-Za-z]{2,4}))$/
  const emailName = email.match(pattern)[1]
  const suffix = email.match(pattern)[2]
  const array = emailName.split('')
  const result = [array.shift(), array.shift(), array.shift()]
  while (array.length > 0) {
    result.push('*')
    array.shift()
  }
  return result.join('') + suffix
}

/**
 * 普通信息脱敏处理
 * @param {String} info 未脱敏的信息
 */
export function desensitizeInfo(info) {
  if (!info) return info
  const array = info.split('')
  const result = [array.shift(), array.shift(), array.shift()]
  while (array.length > 4) {
    result.push('*')
    array.shift()
  }
  return result.concat(array).join('')
}

/**
 * 手机号码脱敏
 * @param {String} phone 未脱敏的手机号
 */
export function hidePhone(phone) {
  if (phone == null) {
    return '未设置'
  } else {
    return phone.replace(/^(.{3})(?:\w+)(.{4})$/, '\$1****\$2')
  }
}

/**
 * 自定义脱敏规则
 * @param {string} val 脱敏目标值
 * @param {number} front 截取前几字符位个数
 * @param {number} back 截取后几位字符个数
 * @param {number} placeholder 中间占位个数
 */
export function hideRule(val, front, back, placeholder) {
  const length = val.length
  placeholder = placeholder || length - front - back

  if (length > front + back) {
    const frontVal = val.slice(0, front)
    const backVal = back ? val.slice(-back) : ''
    return frontVal + '*'.repeat(placeholder) + backVal
  }

  return val
}
