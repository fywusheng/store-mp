<script setup>
import { onShow, onLaunch } from "@dcloudio/uni-app";
import { checkUpdate } from "@/utils/uni";
import { isIphoneHair, uuid } from "@/utils/utils";
import { monitorInIt } from "@/plugins/index";

onLaunch((options) => {
  //  支付宝监控初始化
  // monitorInIt(options);
  // 重置是否弹窗
  // uni.setStorageSync("index_pop", true);
  // 将用户授权流量播放音频的操作重置
  // uni.setStorageSync("network", false);
  const deviceInfo = uni.getSystemInfoSync();
  App.systemInfo = deviceInfo;
  App.isIphoneHair = isIphoneHair(deviceInfo);
  if (!uni.getStorageSync("deviceNumber")) {
    uni.setStorageSync("deviceNumber", uuid());
  }
});

onShow(() => {
  checkUpdate();
});
</script>

<style lang="scss">
@import "@/styles/index.scss";
</style>
