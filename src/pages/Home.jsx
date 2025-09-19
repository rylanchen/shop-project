import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { debounce } from "../utils/debounce.js";
import { api } from "../utils/request.js";

/**
 * 首页组件
 * 展示商品列表，支持搜索和分页功能
 */
export default function Home(){
  // 状态管理：加载状态、商品列表、搜索关键词、当前页码
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8; // 每页显示数量

  // 输入防抖：手感更稳一点
  const doSearch = useMemo(() => debounce((v) => {
    setQ(v.trim());
    setPage(1); // 切换搜索时回到第一页
  }, 400), []);

  // 组件挂载时获取商品列表
  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.listProducts().then(data => {
      if (!alive) return;
      setList(data);
    }).finally(()=> alive && setLoading(false));
    return () => { alive = false; }; // 组件卸载时取消请求
  }, []);

  // 根据搜索关键词过滤商品列表
  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    return list.filter(p => !q || p.title.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower));
  }, [list, q]);

  // 计算分页相关数据
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // 页码的边界处理，别把用户卡死在空页上
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div>
      {/* 搜索栏 */}
      <div className="searchbar">
        <input className="input" placeholder="搜索商品或品牌（中文/拼音都行）" onChange={(e)=>doSearch(e.target.value)} />
      </div>

      {/* 商品列表 */}
      <div className="grid">
        {loading ? (
          // 加载中显示骨架屏
          Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          // 正常显示商品卡片
          pageItems.map(p => <ProductCard key={p.id} p={p} />)
        )}
      </div>

      {/* 无搜索结果提示 */}
      {!loading && total === 0 && <div style={{padding:"20px 0"}}>没搜到，换个词试试？</div>}

      {/* 分页控件 */}
      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:16}}>
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>上一页</button>
        <span style={{alignSelf:"center"}}>{page} / {totalPages}</span>
        <button className="btn" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))}>下一页</button>
      </div>
    </div>
  );
}
