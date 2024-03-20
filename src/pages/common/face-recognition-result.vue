<template>
  <view></view>
</template>

<script>
export default {
  onLoad(e) {
    uni.$emit("faceRecognitionFinished", e);
    uni.navigateBack();
  },
};
</script>

<style></style>
