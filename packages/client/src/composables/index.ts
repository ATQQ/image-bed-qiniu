import { ref } from "vue";

export function useIsMobile() {

const isMobile = ref(false)
  var userAgent =
    navigator.userAgent

  // 使用正则表达式检查userAgent字符串是否匹配移动设备
  var mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  // 检查设备是否支持触摸操作
  var isTouchDevice =
    navigator.maxTouchPoints > 0;

  return (
    mobileRegex.test(userAgent) ||
    isTouchDevice
  );
}
