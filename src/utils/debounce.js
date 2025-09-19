// 手搓一个简洁的防抖，够用就行，别引第三方
export function debounce(fn, wait = 300){
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
