# 市集 Rylan Chen的轻电商练手项目
2025/08/26 暂完 待优化

基于 React + Vite + Zustand，用于学习、练习、参考。
docs文件夹里有一个踩坑记录供后续参考。

## 开始
```bash
npm i
npm run dev # http://localhost:5173
```

## 接口
我让AI给了一个公共测试接口，如显示成功，会拉取到接口里的英文商品数据。
但同时我也准备了本地 `mock` 文件夹，网络问题的话，接口会自动回落到本地 `public/mock/products.json`。
接口来自 [dummyjson](https://dummyjson.com/)

## 主要功能
- 商品列表（搜索、防抖、分页、懒加载）
- 商品详情（最近浏览、收藏）
- 购物车（Zustand 持久化）
- 假登录（路由守卫：未登录禁止进入购物车）
- 错误边界 + 骨架屏 + 请求抖动/重试

## 目录大纲
```
src/
  components/
  pages/
  store/
  utils/
  styles.css
public/
  mock/products.json
docs/
  开发踩坑记录.md
```

## 环境变量
复制 `.env.example` 为 `.env.local`
```
VITE_API_BASE=https://dummyjson.com
```


## 后续可以做的
- 服务端分页/筛选、图片上传、评论系统、支付对接（Mock 也行）。
- 基于 localStorage 的“离线兜底缓存”。
