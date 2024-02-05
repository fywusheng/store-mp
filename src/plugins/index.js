import monitor from "./alipayLogger";
import { setCMHookFunc } from "./cloudMonitorHelper.js";
import { _cmHookFunc } from "./cm_hook";

export  function monitorInIt(options) {
  monitor.init({
      pid: "aoufua6q5cdlvi79ioj4xw==",
      options: options,
      sample: 1,
      autoReportApi: true,
      autoReportPage: true,
      // Http请求返回数据中状态码字段名称
      code: ["msg"],
      // Http返回数据中的error message字段名称
      msg: ["msg"],
      // 小程序版本号
      miniVersion: "1.5.3",
    });
  // 设置光华平台hook函数
  setCMHookFunc(_cmHookFunc);

}