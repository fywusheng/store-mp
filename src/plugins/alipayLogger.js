'use strict'
Date.now = Date.now || function () {
  return new Date().getTime()
}
var SEQUENCE = Date.now()
var noop = function () { }
var getCwarn = function () {
  var t = typeof console == 'object' ? console.warn : noop
  try {
    var e = {
      warn: t
    }
    e.warn.call(e)
  } catch (n) {
    return noop
  }
  return t
}
var util = {
  noop: noop,
  warn: getCwarn(),
  createObject: function (t) {
    if (Object.create) {
      return Object.create(t)
    }
    var e = function () { }
    return e.prototype = t, new e()
  }, each: function (t, e) {
    var n = 0
    var r = t.length
    if (this.T(t, 'Array')) {
      for (; n < r && !1 !== e.call(t[n], t[n], n); n++) { }
    } else {
      for (n in t) {
        if (!1 === e.call(t[n], t[n], n)) {
          break
        }
      }
    }
    return t
  }, safetyCall: function (t, e, n) {
    if (typeof t != 'function') {
      return n
    }
    try {
      return t.apply(this, e)
    } catch (r) {
      return n
    }
  }, ignoreByRule: function (t, e) {
    if (!t || !e) return !1
    if ((this.isString(e) || e.source || this.T(e) === 'Function') && (e = [e]), !this.isArray(e)) {
      return util.warn('[cloudMonitor] invalid rules of ignore config, (list of) String/RegExp/Funcitons are available'),
        !1
    }
    for (var n, r = [], o = 0, i = e.length; o < i; o++) if (n = e[o], this.isString(n)) r.push(n.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')); else if (n && n.source) r.push(n.source); else if (n && this.T(n) === 'Function' && !0 === this.safetyCall(n, [t], !1)) return !0
    var a = new RegExp(r.join('|'), 'i')
    return !!(r.length && a.test && a.test(t))
  }, T: function (t, e) {
    var n = Object.prototype.toString.call(t).substring(8).replace(']', '')
    return e ? n === e : n
  }, J: function (t) {
    if (!t || typeof t != 'string') {
      return t
    }
    var e = null
    try {
      e = JSON.parse(t)
    } catch (n) { }
    return e
  }, pick: function (t) {
    return t === 1 || Math.ceil(Math.random() * t) === 1
  }, verifyConfig: function (t) {
    if ('sample' in t) {
      var e = t.sample
      var n = e
      e && /^\d+(\.\d+)?%$/.test(e) && (n = parseInt(100 / parseFloat(e))), n > 0 && n < 1 && (n = parseInt(1 / n)), n >= 1 && n <= 100 ? t.sample = n : delete t.sample
    }
    return t
  }, delay: function (t, e) {
    return e === -1 ? (t(), null) : setTimeout(t, e || 0)
  }, ext: function (t) {
    for (var e = 1, n = arguments.length; e < n; e++) {
      var r = arguments[e]
      for (var o in r) {
        Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o])
      }
    }
    return t
  }, sub: function (t, e) {
    var n = {}
    return this.each(t, function (t, r) {
      e.indexOf(r) !== -1 && (n[r] = t)
    }), n
  }, uu: function () {
    for (var t, e, n = 20, r = new Array(n), o = Date.now().toString(36).split(''); n-- > 0;) {
      e = (t = 36 * Math.random() | 0).toString(36), r[n] = t % 3 ? e : e.toUpperCase()
    }
    for (var i = 0; i < 8; i++) {
      r.splice(3 * i + 2, 0, o[i])
    }
    return r.join('')
  }, seq: function () {
    return (SEQUENCE++).toString(36)
  }, decode: function (t) {
    try {
      t = decodeURIComponent(t)
    } catch (e) { }
    return t
  }, encode: function (t, e) {
    try {
      t = e ? encodeURIComponent(t).replace(/\(/g, '%28').replace(/\)/g, '%29') : encodeURIComponent(t)
    } catch (n) { }
    return t
  }, serialize: function (t) {
    t = t || {}
    var e = []
    for (var n in t) {
      Object.prototype.hasOwnProperty.call(t, n) && t[n] !== undefined && e.push(n + '=' + this.encode(t[n], n === 'msg'))
    }
    return e.join('&')
  }, checkAPI: function (t, e) {
    if (!t || typeof t != 'string') {
      return !1
    }
    var n = /openmonitor(\.(dev|sit|test))?\.alipay[\w-]*/.test(t)
    return !n && e && (n = /(\.png)|(\.gif)|(alicdn\.com)/.test(t)), !n
  }, checkAutoError: function (t) {
    return !(!t || !t.message) && !/failed[\w\s]+fetch/i.test(t.message)
  }, cutUrlSearch: function (t) {
    return t && typeof t == 'string' ? t.replace(/^(.*?https?:)?\/\//, '').replace(/\?.*$/, '').replace(/&.*$/, '').replace(/\/\d{1,}$/, '/*').replace(/\/\d{1,}\//, '/*/') : ''
  }, patchPath: function (t) {
    if (!t || typeof t != 'string') return ''
    t = t.replace(/^\//, '')
    return t.includes('pages/') ? t.replace(/\.\.\//g, '') : t.replace(/^\.\./, 'pages')
  }, getRandIP: function () {
    for (var t = [], e = 0; e < 4; e++) {
      var n = Math.floor(256 * Math.random())
      t[e] = (n > 15 ? '' : '0') + n.toString(16)
    }
    return t.join('')
  }, getSortNum: function (t) {
    return t ? (t += 1) >= 1000 && t <= 9999 ? t : t < 1000 ? t + 1000 : t % 10000 + 1000 : 1000
  }, getRandNum: function (t) {
    return t && typeof t == 'string' ? t.length < 5 ? this.getNum(5) : t.substring(t.length - 5) : this.getNum(5)
  }, getNum: function (t) {
    for (var e = [], n = 0; n < t; n++) {
      var r = Math.floor(16 * Math.random())
      e[n] = r.toString(16)
    }
    return e.join('')
  }, isFunction: function (t) {
    return typeof t == 'function'
  }, isPlainObject: function (t) {
    return Object.prototype.toString.call(t) === '[object Object]'
  }, isString: function (t) {
    return Object.prototype.toString.call(t) === '[object String]'
  }, isArray: function (t) {
    return Object.prototype.toString.call(t) === '[object Array]'
  }, joinRegExp: function (t) {
    for (var e, n = [], r = 0, o = t.length; r < o; r++) {
      e = t[r], this.isString(e) ? n.push(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')) : e && e.source && n.push(e.source)
    }
    return new RegExp(n.join('|'), 'i')
  }, getPropertyValue: function (j, arr) {
    if (!arr) return ''
    for (var k in j) {
      if (arr.indexOf(k) > -1 && (typeof j[k] != 'object')) {
        return j[k] + ''
      }
    }
    return ''
  }, hashCode: function (s) {
    var hash = 0; var i; var chr
    for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }, toHex: function (s) {
    return !s ? null : ('000' + this.hashCode(s).toString(16)).slice(-4)
  }, replaceAll: function (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
  }
}
var util_1 = util
var pushToQueue = function (e, t) {
  var i
  {
    if (t.t !== 'error' || !(i = e.requestQueue[0]) || i.t !== 'error' || t.msg !== i.msg) {
      if (t.t === 'behavior') {
        var n = e.requestQueue && e.requestQueue.length
        if (n > 0 && e.requestQueue[n - 1].t === 'behavior') {
          var r = t.behavior || []
          e.requestQueue[n - 1].behavior.concat(r)
        } else e.requestQueue.push(t)
      } else e.requestQueue.unshift(t)
      return e.onReady(function () {
        e.requestTimmer = util.delay(function () {
          e.clear()
        }, e.requestQueue[0] && e.requestQueue[0].t === 'error' ? 3e3 : -1)
      }), !0
    }
    i.times++
  }
}
var Base = function (t) {
  return this.ver = '1.2.2', this.syn = 0, this.err = 0, this._conf = util.ext({}, Base.dftCon), this.sampleCache = {}, this.requestQueue = [], this.hash = util.seq(), this.resetSession(), this.setConfig(t), this.rip = util.getRandIP(), this._common = {}, this
}
Base.dftCon = {
  sample: 1,
  tag: '',
  imgUrls: ['https://openmonitor.alipay-eco.com/cloudmonitor/put.htm?'],
  release: undefined,
  environment: 'production',
  charset: 'utf-8'
}, Base.prototype = {
  constructor: Base,
  getPage: function () {
    var e = this._conf.page
    return util.safetyCall(e, [], e + '')
  }, setPage: function () { }, setConfig: function (e) {
    e && typeof e == 'object' && (util.verifyConfig(e), e = this.setImgUrl(e), this._conf = util.ext({}, this._conf, e))
  }, setImgUrl: function (e) {
    return e.imgUrl && (this._conf.imgUrls = [e.imgUrl]), e
  }, sendRequest: function () { }, postData: function () { }, commonInfo: function () {
    return {}
  }, setCommonInfo: function (e) {
    e && typeof e == 'object' && (this._common = util.ext({}, this._common, e))
  }, resetSession: function () {
    this.session = util.uu(), this.sBegin = Date.now()
  }, getConfig: function (e) {
    return e ? this._conf[e] : util.ext({}, this._conf)
  }, sampling: function (e) {
    return e === 1 || (typeof this.sampleCache[e] == 'boolean' ? this.sampleCache[e] : (this.sampleCache[e] = util.pick(e),
      this.sampleCache[e]))
  }, clear: function () {
    var e; var t = this
    if (t.syn > 2) {
      return clearTimeout(t.requestTimmer), t.requestTimmer = setTimeout(function () {
        t.clear()
      }, 50), t
    }
    for (clearTimeout(t.requestTimmer), t.requestTimmer = null; t.syn < 2 && (e = t.requestQueue.pop()); t.syn++) {
      e.t === 'res' ? t.postData(e, 'res') : e.t === 'error' ? t.postData(e, 'err') : e.t === 'behavior' ? t.postData(e, 'behavior') : t.sendRequest(e)
    }
    !!t.requestQueue.length && (t.requestTimmer = setTimeout(function () {
      t.clear()
    }, 50))
    return this
  }, getToken: function (e) {
    var t = this._conf.token
    return !t ? '-' : t[e] || '-'
  }, _lg: function (e, t, i) {
    var n = this._conf; var r = t.page || util.patchPath(this.getPage()); var s = n.ignore || {}; var o = s.ignoreErrors; var u = s.ignoreUrls; var a = s.ignoreApis
    return util.ignoreByRule(r, u) || util.ignoreByRule(util.decode(r), u) ? this : e === 'error' && (util.ignoreByRule(t.msg, o) || util.ignoreByRule(util.decode(t.msg), o)) ? this : e === 'api' && (util.ignoreByRule(t.api, a) || util.ignoreByRule(util.decode(t.api), a)) ? this : t && !n.disabled && (n.pid || n.token) ? i && !this.sampling(i) ? this : (t = util.ext({
      t: e,
      page: r,
      environment: n.environment,
      _input_charset: n.charset,
      timestamp: Date.now()
    }, t, this.commonInfo(), this._common, {
      token: this.getToken(e),
      pid: n.pid || '-',
      _v: this.ver,
      uid: this._common.uid,
      sampling: i || 1,
      miniVersion: this._conf.miniVersion
    }), pushToQueue(this, t)) : this
  }, custom: function (e, t) {
    if (!e || typeof e != 'object') {
      return this
    }
    var i = !1
    var r = {
      timestamp: Date.now()
    }
    return util.each(e, function (e, t) {
      return !(i = t && t.length <= 20) && util.warn('[CloudMonitor] invalid key: ' + t), r['x-' + t] = e, i
    }), i ? this._lg('custom', r, t || 1) : this
  }, logInfo: function () {
    if (arguments.length === 0) return
    var msg = ''
    for (var e = 0, n = arguments.length; e < n; e++) {
      msg += (' ' + JSON.stringify(arguments[e]))
    }
    var r = {
      timestamp: Date.now(),
      level: 'info',
      msg: msg.substring(1)
    }
    return this._lg('log', r, 1), this
  }, report: function (k, e) {
    if (!k || !e || typeof e != 'object') {
      return this
    }
    var i = !1
    var r = {
      timestamp: Date.now()
    }
    return util.each(e, function (e, t) {
      return !(i = t && t.length <= 20) && util.warn('[CloudMonitor] invalid key: ' + t), r['x-' + t] = e, i
    }), i ? this._lg(k, r, 1) : this
  }
}
var base = Base
var validApiKeys = ['api', 'success', 'time', 'code', 'msg', 'begin', 'response', 'c1', 'c2', 'c3']
var parseStatData = function (t, e) {
  var r = t.split('::')
  return r.length > 1 ? util_1.ext({
    group: r[0],
    key: r[1]
  }, e) : util_1.ext({
    group: 'default_group',
    key: r[0]
  }, e)
}
var Reporter = function (t) {
  base.call(this, t)
  var e
  try {
    e = typeof performance == 'object' ? performance.timing.fetchStart : Date.now()
  } catch (r) {
    e = Date.now()
  }
  return this._startTime = e, this
}
Reporter.prototype = util_1.createObject(base.prototype), util_1.ext(base.dftCon, {
  startTime: null
}), util_1.ext(Reporter.prototype, {
  constructor: Reporter,
  _super: base,
  sum: function (t, e, r) {
    try {
      return this._lg('sum', parseStatData(t, {
        val: e || 1,
        begin: Date.now()
      }), r)
    } catch (n) {
      util_1.warn('[retcode] can not get parseStatData: ' + n)
    }
  }, avg: function (t, e, r) {
    try {
      return this._lg('avg', parseStatData(t, {
        val: e || 0,
        begin: Date.now()
      }), r)
    } catch (n) {
      util_1.warn('[retcode] can not get parseStatData: ' + n)
    }
  }, percent: function (t, e, r, n) {
    try {
      return this._lg('percent', parseStatData(t, {
        subkey: e,
        val: r || 0,
        begin: Date.now()
      }), n)
    } catch (i) {
      util_1.warn('[retcode] can not get parseStatData: ' + i)
    }
  }, msg: function (t, e) {
    if (t && !(t.length > 180)) {
      return this.custom({
        msg: t
      }, e)
    }
  }, error: function (t, e) {
    if (!t) {
      return util_1.warn('[cloudMonitor] invalid param e: ' + t), this
    }
    arguments.length === 1 ? (typeof t == 'string' && (t = {
      message: t
    }, e = {}), typeof t == 'object' && (e = t = t.error || t)) : (typeof t == 'string' && (t = {
      message: t
    }), typeof e != 'object' && (e = {}))
    var r = t.name || 'CustomError'
    var n = util_1.encode(t.message)
    var i = util_1.encode(util_1.replaceAll(t.stack || '', 'http.*\\d*:\\d*', 'unknow'))
    e = e || {}
    var s = {
      begin: Date.now(),
      cate: r,
      msg: n.substring(0, 256),
      stack: i && i.substring(0, 256),
      file: e.filename || '',
      line: e.lineno || '',
      col: e.colno || '',
      err: {
        msg_raw: n,
        stack_raw: i
      }
    }; var n = (this.getConfig('ignore') || {}).ignoreErrors
    return util.ignoreByRule(s.msg, n) || util.ignoreByRule(util.decode(s.msg), n) ? this : (this.beforeSend && this.beforeSend('error', s)), this._lg('error', s, 1)
  }, behavior: function (t) {
    if (t) {
      var e = typeof t == 'object' && t.behavior ? t : {
        behavior: t
      }
      return this.beforeSend && this.beforeSend('behavior', t), this._lg('behavior', e, 1)
    }
  }, api: function (e, t, r, i, a, s) {
    if (!e) {
      return util.warn('[cloudMonitor] api is null'), this
    }
    e = typeof e == 'string' ? {
      api: e,
      success: t,
      time: r,
      code: i,
      msg: a,
      begin: s
    } : util.sub(e, validApiKeys)
    if (e.code = e.code || '', e.msg = e.msg || '', e.success = e.success ? 1 : 0, e.time = +e.time, e.begin = e.begin || '', !e.api || isNaN(e.time)) {
      return util.warn('[cloudMonitor] invalid time or api'), this
    }
    var c = (this.getConfig('ignore') || {}).ignoreApis
    if (util.ignoreByRule(e.api, c) || util.ignoreByRule(util.decode(e.api), c)) return this
    this.beforeSend && this.beforeSend('api', e)
    return this._lg('api', e, e.success && !e.response && this.getConfig('sample'))
  }, resource: function (t, e) {
    if (!t || !util_1.isPlainObject(t)) {
      return util_1.warn('[cloudMonitor] invalid param data: ' + t), this
    }
    var r = Object.keys(t)
    var n = ['begin', 'dom', 'load', 'res', 'dl']
    var i = !1
    for (var o in n) {
      if (r.indexOf(n[o]) < 0) {
        i = !0
        break
      }
    }
    if (i) {
      return util_1.warn('[cloudMonitor] lack param data: ' + t), this
    }
    var a = {
      begin: t.begin || Date.now(),
      dom: t.dom || '',
      load: t.load || '',
      res: util_1.isArray(t.res) ? JSON.stringify(t.res) : JSON.stringify([]),
      dl: t.dl || ''
    }
    return this._lg('res', a, e)
  }
}), Reporter._super = base, Reporter._root = base, base.Reporter = Reporter
var reporter = Reporter
var MiniProgramLogger = function (t) {
  var o = this
  return Reporter.call(o, t), o._health = {
    errcount: 0,
    apisucc: 0,
    apifail: 0
  }, o.DEFAUT_PAGE_PATH = '[app]', o.isSendPerf = !1, o.beforeSend = function (e, t) {
    e === 'error' ? o._health.errcount++ : e === 'api' && o._health[t.success ? 'apisucc' : 'apifail']++
  }, typeof o.autoSetCommonInfo == 'function' && o.autoSetCommonInfo(), this
}
MiniProgramLogger.prototype = util.createObject(Reporter.prototype), util.ext(Reporter._root.dftCon, {
  sendRequest: function () { }, getCurrentPage: function () { }, getPrePage: function () { }
}), util.ext(MiniProgramLogger.prototype, {
  constructor: MiniProgramLogger,
  _super: Reporter,
  onReady: function (e) {
    var t = this
    t._common.uid ? e() : setTimeout(function () {
      t.onReady(e)
    }, 100)
  }, sendRequest: function (e, o) {
    var a = this
    if (a.getConfig('debug') || a.err > 0) {
      typeof console != 'undefined' && console && typeof console.log == 'function' && console.log('[cloudMonitor] [DEBUG MODE] log data', e)
    } else {
      var r = a._conf.sendRequest
      util.each(a.getConfig('imgUrls'), function (t, i) {
        typeof e == 'object' && (e = util.serialize(e))
        var n = t + e
        o && (n += '&post_res=')
        if (typeof r == 'function') {
          try {
            !i ? r(n, o, a) : r(n, o)
          } catch (i) {
            util.warn('[cloudMonitor] error in sendRequest', i)
          }
        }
      })
    }
  }, postData: function (e, o) {
    var t = {}
    t[o] = e[o], delete e[o], this.sendRequest(e, t)
  }, getPage: function (delta) {
    var e = this._conf.getCurrentPage
    if (typeof e == 'function') {
      try {
        var o = e()
        if (o && typeof o == 'string') {
          return o
        }
      } catch (t) {
        util.warn('[cloudMonitor] error in getPage', t)
      }
    }
    return typeof e == 'string' && e ? e : this.DEFAUT_PAGE_PATH
  }, addHook: function () {
    return this
  }, removeHook: function () {
    return this
  }, hookApp: function (e) {
    var o = this
    var t = {
      onError: function (t) {
        var n = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        var r = e.onError
        try {
          o.error(t)
        } catch (t) {
          util.warn('[cloudMonitor] error in hookApp:onError', t)
        }
        if (typeof r == 'function') {
          return r.apply(this, n)
        }
      }
    }
    return util.ext({}, e, t)
  }, autoSetCommonInfo: function () {
    this.setCommonInfo({
      app: 'mini_common',
      uid: this._conf.uid
    })
  }, _lgPV: function (t) {
    if (!t) return
    if (typeof t == 'string') {
      t = { page: t }
    }
    t.page = util.cutUrlSearch(t.page)
    t.url && (t.url = util.cutUrlSearch(t.url))
    !t.spmPre && (t.spmPre = util.toHex(this.getPage()) || ''), !t.spmId && (t.spmId = util.toHex(t.page) || ''), !t.scene && (t.scene = ''), this._lg('pv', t)
  },
  sendHealthOnPageShowOrHide: function () {
    try {
      this.sessionPage = this.getPage(), this.sendHealth(), this.speedCache && (this._lg('speed', this.speedCache), this.speedCache = null,
        clearTimeout(this.speedTimmer)), this.clear()
    } catch (o) {
      util.warn('[cloudMonitor] error in sendHealthOnPageShowOrHide', o)
    }
  },
  sendHealth: function () {
    if (this.sessionPage) {
      var e = util.ext({}, this._health)
      e.healthy = e.errcount > 0 ? 0 : 1, e.begin = Date.now()
      var o = e.begin - this.sBegin
      e.page = this.sessionPage, e.stay = o, this._lg('health', e, 1), this._health = {
        errcount: 0,
        apisucc: 0,
        apifail: 0
      }, this.sessionPage = null
    }
  },
  parseResponse: function (e) {
    if (!e || typeof e != 'object') return {}
    var r = ''
    var c = util.getPropertyValue(e, this._conf.code) || e.stat || e.status || e.code || e.success
    var u = util.getPropertyValue(e, this._conf.msg) || e.msg || e.message || e.subMsg || e.errorMsg || e.ret || e.errorResponse || ''
    typeof u == 'object' && (c = c || u.code, u = u.msg || u.message || u.info || u.ret || JSON.stringify(u))
    return {
      code: c,
      msg: u,
      response: util.pick(10000) ? JSON.stringify(e).substr(0, 256) : ''
    }
  }
})
MiniProgramLogger._super = reporter, MiniProgramLogger._root = reporter._root, reporter.MiniProgramLogger = MiniProgramLogger
var miniProgramLogger = MiniProgramLogger
var STORAGE_MINIPROGRAM_ALIPAY_UID_KEY = 'STORAGE_MINIPROGRAM_ALIPAY_UID'
var AlipayLogger = function (t) {
  return MiniProgramLogger.call(this, t), this
}
AlipayLogger.prototype = util.createObject(MiniProgramLogger.prototype), util.ext(MiniProgramLogger._root.dftCon, {
  sendRequest: function (t, e, a) {
    if (typeof my != 'undefined' && my && typeof my.request == 'function') {
      try {
        var o; var r = 'GET'
        e && (r = 'POST', o = JSON.stringify(e)), my.request({
          url: t,
          method: r,
          data: o,
          dataType: 'json',
          fail: function (t) {
            util.warn('[cloudMonitor] sendRequest fail', t)
            a && a.err++
          },
          complete: function (_t) {
            a && a.syn--
          }
        })
      } catch (n) {
        util.warn('[cloudMonitor] error in conf sendRequest', n)
      }
    }
  }, getCurrentPage: function () {
    if (typeof getCurrentPages == 'function') {
      try {
        var t = getCurrentPages() || []
        var e = t[t.length - 1]
        return e && e.route || null
      } catch (o) {
        util.warn('[cloudMonitor] error in conf getCurrentPage', o)
      }
    }
  }, getPrePage: function (delta) {
    if (typeof getCurrentPages == 'function') {
      try {
        var t = getCurrentPages() || []
        var e = delta === undefined ? t[t.length - 2] : delta >= t.length ? t[0] : t[t.length - 1 - delta]
        return e && e.route || null
      } catch (o) {
        util.warn('[cloudMonitor] error in conf getCurrentPage', o)
      }
    }
  }
}), util.ext(AlipayLogger.prototype, {
  constructor: AlipayLogger,
  _super: MiniProgramLogger,
  autoSetCommonInfo: function () {
    this.setCommonInfo({
      app: 'mini_alipay'
    }), this.autoSetNetworkType(), this.autoSetUid(), this.autoSystemInfo(), this.autoSetAppId(), this.autoSetSDKVersion(), this.autoSetRunScene()
  }, autoSetUid: function () {
    var t = this
    if (t._conf && t._conf.uid) {
      t.setCommonInfo({
        uid: t._conf.uid
      })
    } else {
      if (typeof my != 'undefined' && my && typeof my.getStorage == 'function') {
        try {
          const data = my.getStorageSync({
            key: STORAGE_MINIPROGRAM_ALIPAY_UID_KEY
          })
          if (data) {
            if (data && data.data && typeof data.data === 'string') {
              t.setCommonInfo({ uid: data.data })
            } else {
              var o = util.uu()
              const e = my.setStorageSync({
                key: STORAGE_MINIPROGRAM_ALIPAY_UID_KEY,
                data: o
              })
              if (e) {
                t.setCommonInfo({
                  uid: o
                })
              } else {
                util.warn('[cloudMonitor] error in setStorage', t)
              }
            }
          } else {
            util.warn('[cloudMonitor] error in getStorage')
          }
        } catch (e) {
          util.warn('[cloudMonitor] error in autoSetUid', e)
        }
      }
    }
  }, autoSystemInfo: function () {
    var t = this
    if (typeof my != 'undefined' && my && typeof my.getSystemInfo == 'function') {
      try {
        my.getSystemInfo({
          success: function (e) {
            e && typeof e.model == 'string' && typeof e.version == 'string' && typeof e.platform == 'string' && typeof e.language == 'string' && t.setCommonInfo({
              mobile: e.model,
              version: e.version,
              platform: e.platform,
              system: e.system,
              resolution: e.windowWidth + '*' + e.windowHeight,
              language: e.language
            })
          }, fail: function (t) {
            util.warn('[cloudMonitor] autoSystemInfo getSystemInfo fail', t)
          }
        })
      } catch (e) {
        util.warn('[cloudMonitor] error in getSystemInfo', e)
      }
    }
  }, autoSetNetworkType: function () {
    var t = this
    if (typeof my != 'undefined' && my && typeof my.getNetworkType == 'function') {
      try {
        my.getNetworkType({
          success: function (e) {
            e && typeof e.networkType == 'string' && t.setCommonInfo({
              net: e.networkType
            })
          }, fail: function (t) {
            util.warn('[cloudMonitor] autoSetNetworkType getNetworkType fail', t)
          }
        })
      } catch (e) {
        util.warn('[cloudMonitor] error in autoSetNetworkType', e)
      }
    }
  }, autoSetAppId: function () {
    var t = this
    if (typeof my != 'undefined' && my && typeof my.getAppIdSync == 'function') {
      try {
        const appIdRes = my.getAppIdSync()
        t.setCommonInfo({ appId: appIdRes.appId })
      } catch (e) {
        util.warn('[cloudMonitor] error in autoSetNetworkType', e)
      }
    }
  }, autoSetSDKVersion: function () {
    var t = this
    if (typeof my != 'undefined' && my && typeof my.SDKVersion == 'string') {
      t.setCommonInfo({
        sdk_version: my.SDKVersion
      })
    }
  }, autoSetRunScene: function () {
    var t = this
    if (typeof my != 'undefined' && my && typeof my.getRunScene == 'function') {
      try {
        my.getRunScene({
          success(e) {
            t._conf.environment = e.envVersion
          }
        })
      } catch (e) {
        util.warn('[cloudMonitor] error in autoSetRunScene', e)
      }
    }
  }, addHook: function () {
    var e = this
    var t = util
    var ca = e._conf.autoReportApi
    var cp = e._conf.autoReportPage

    !e.isHookInstantiated && (function () {
      if (ca) {
        if (typeof my != 'undefined' && my && typeof my.request == 'function') {
          var s = my.request
          var a = Object.getOwnPropertyDescriptor(my, 'request')
          a && a.writable && (my.request = function (i) {
            var a = new Date().getTime()
            var n = i
            if (i && i.url) {
              var o = t.cutUrlSearch(i.url)
              if (!t.checkAPI(o, !0)) {
                return s.call(my, n)
              }
              var u = n && n.headers
              var f = e._conf.extendApi
              u && typeof u == 'object' || (u = {})
              var p = {
                success: function (t) {
                  typeof i.success == 'function' && i.success(t)
                  var s = new Date().getTime()
                  var u = {}
                  if (t.data && (!i.dataType || i.dataType === 'json')) {
                    u = e.parseResponse(t.data)
                    f && (u = util.ext(u, util.safetyCall(f, [i.data, t.data], {})))
                  }
                  e.api(util.ext({
                    api: o,
                    success: !0,
                    time: s - a,
                    code: '',
                    msg: '',
                    response: ''
                  }, u))
                }, fail: function (t) {
                  typeof i.fail == 'function' && i.fail(t)
                  var s = new Date().getTime()
                  var n = ''
                  t && t.status && (n = t.status)
                  n == '' && t.error && (n = t.error)
                  var u = ''
                  var r = f ? util.safetyCall(f, [i.data], {}) : {}
                  t && t.body && (u = (u = JSON.stringify(t.body)).substring(0, 256)), e.api(util.ext({
                    api: o,
                    success: !1,
                    time: s - a,
                    code: n,
                    msg: u
                  }, r))
                }
              }
              n = t.ext({}, n, p)
            }
            return s.call(my, n)
          })
        }
      }
      if (cp && typeof my != 'undefined' && my) {
        /*
        if ("function" == typeof my.call) {
          var c = my.call;
          var a = Object.getOwnPropertyDescriptor(my, "call");
          a && a.writable && (my.call = function (i, j, k) {
            if (i && i == "startApp" && j && j.param && j.param.url) {
              var o = j.param.url;
              o = t.cutUrlSearch(o);
              e._lgPV({
                page: o,
                c3: "c"
              })
              return e.sendHealthOnPageShowOrHide(), c.call(my, i, j, k)
            }

          })
        }
        */
        if (typeof my.navigateTo == 'function') {
          var n = my.navigateTo
          var a = Object.getOwnPropertyDescriptor(my, 'navigateTo')
          a && a.writable && (my.navigateTo = function (i) {
            if (i && i.url) {
              var o = t.cutUrlSearch(t.patchPath(i.url))
              e._lgPV({
                page: o,
                c3: 'nt'
              })
            }
            return e.sendHealthOnPageShowOrHide(), n.call(my, i)
          })
        }
        if (typeof my.navigateBack == 'function') {
          var w = my.navigateBack
          var a = Object.getOwnPropertyDescriptor(my, 'navigateBack')
          a && a.writable && (my.navigateBack = function (i) {
            e._lgPV({
              page: e._conf.getPrePage(i || 1),
              c3: 'nb'
            })
            return e.sendHealthOnPageShowOrHide(), w.call(my, i)
          })
        }
        if (typeof my.redirectTo == 'function') {
          var x = my.redirectTo
          var a = Object.getOwnPropertyDescriptor(my, 'redirectTo')
          a && a.writable && (my.redirectTo = function (i) {
            if (i && i.url) {
              var o = t.cutUrlSearch(t.patchPath(i.url))
              e._lgPV({
                page: o,
                c3: 'rt'
              })
            }
            return e.sendHealthOnPageShowOrHide(), x.call(my, i)
          })
        }
        if (typeof my.switchTab == 'function') {
          var y = my.switchTab
          var a = Object.getOwnPropertyDescriptor(my, 'switchTab')
          a && a.writable && (my.switchTab = function (i) {
            if (i && i.url) {
              var o = t.cutUrlSearch(t.patchPath(i.url))
              e._lgPV({
                page: o,
                spmPre: 'T',
                c3: 'st'
              })
            }
            return e.sendHealthOnPageShowOrHide(), y.call(my, i)
          })
        }
        if (typeof my.reLaunch == 'function') {
          var z = my.reLaunch
          var a = Object.getOwnPropertyDescriptor(my, 'reLaunch')
          a && a.writable && (my.reLaunch = function (i) {
            if (i && i.url) {
              var o = t.cutUrlSearch(t.patchPath(i.url))
              e._lgPV({
                page: o,
                spmPre: 'T',
                c3: 'rl'
              })
            }
            return z.call(my, i)
          })
        }
        if (typeof my.navigateToMiniProgram == 'function') {
          var m = my.navigateToMiniProgram
          var a = Object.getOwnPropertyDescriptor(my, 'navigateToMiniProgram')
          a && a.writable && (my.navigateToMiniProgram = function (i) {
            if (i) {
              var o = i.path || i.appId || '-'
              o = t.cutUrlSearch(o)
              e._lgPV({
                page: o,
                c3: 'ntmp'
              })
            }
            return m.call(my, i)
          })
        }
      }
    }.call(e), e.isHookInstantiated = !0)
    return e
  },
  init: function (t) {
    if (!t || !t.pid) {
      util.warn('[cloudMonitor] not set pid')
    }
    var p; var e = this
    if (t.options) {
      p = t.options.path, t.scene = t.options.scene, delete t.options
    }
    if (!t.ignore) {
      t.ignore = {
        ignoreUrls: [/\.(png|jpg|gif|jpeg)$/, /[\"{}]+/, /\.tfs.alipayobjects.com\.*/]
      }
    }
    this.setConfig(t), this.addHook()
    if (p) {
      e.entrance = util.toHex(p)
      e.onReady(function () {
        e._lg('pv', { spmPre: 'E', spmId: e.entrance || '', scene: e._conf.scene || '', c3: 'init' })
      })
    }
    return this
  }
})
AlipayLogger._super = miniProgramLogger, AlipayLogger._root = miniProgramLogger._root, miniProgramLogger.AlipayLogger = AlipayLogger
// module.exports = new AlipayLogger()

export default new AlipayLogger()
