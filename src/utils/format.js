// 显示人民币，默认保留两位
export function rmb(n){
  const v = Number(n || 0);
  return "￥" + v.toFixed(2);
}
