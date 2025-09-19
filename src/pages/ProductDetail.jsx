import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/request.js";
import { rmb } from "../utils/format.js";
import { useCart } from "../store/cart.js";
import { useFav } from "../store/fav.js";
import { useRecent } from "../store/recent.js";

/**
 * 商品详情页面组件
 * 展示商品详细信息，包括图片、标题、价格、描述等
 * 提供收藏和加入购物车功能
 */
export default function ProductDetail(){
  // 从URL参数中获取商品ID
  const { id } = useParams();
  // 商品数据状态
  const [p, setP] = useState(null);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 购物车添加功能
  const add = useCart(s => s.add);
  // 收藏功能
  const { toggle, has } = useFav(s => ({ toggle: s.toggle, has: s.has }));
  // 最近浏览记录功能
  const pushRecent = useRecent(s => s.push);

  // 使用Effect获取商品数据
  useEffect(() => {
    let alive = true; // 用于组件卸载时取消请求
    setLoading(true);
    api.getProduct(id).then(data => {
      if (!alive) return; // 组件已卸载则不再处理数据
      setP(data);
      // 注意：这里为了统一展示结构，做一层映射
      const item = {
        id: data.id,
        title: data.title,
        price: data.price,
        brand: data.brand,
        category: data.category,
        thumbnail: data.thumbnail || "/placeholder.png",
        description: data.description ?? "",
        stock: data.stock ?? 0
      };
      // 添加到最近浏览记录
      pushRecent({ id: item.id, title: item.title });
    }).finally(()=> alive && setLoading(false)); // 请求完成时更新加载状态
    return () => { alive = false; }; // 清理函数
  }, [id, pushRecent]);

  // 加载中显示骨架屏
  if (loading) return <div className="skeleton" />;
  // 商品不存在时显示提示
  if (!p) return <div>没找到这个商品。</div>;

  // 商品详情展示
  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
      {/* 商品图片展示 */}
      <div>
        <img src={p.thumbnail || "/placeholder.svg"} alt={p.title} style={{width:"100%", borderRadius:12}} />
      </div>
      {/* 商品信息展示 */}
      <div>
        <h2 style={{margin:"4px 0"}}>{p.title}</h2>
        {/* 商品元信息 */}
        <div className="meta">{p.brand} · {p.category} · 库存 {p.stock} 件</div>
        {/* 商品价格 */}
        <div className="price" style={{fontSize:24, marginTop:8}}>{rmb(p.price)}</div>
        {/* 商品描述 */}
        <p style={{lineHeight:1.6}}>{p.description || "这个商家比较实在，没整太多文案。"}</p>

        {/* 操作按钮 */}
        <div className="actions" style={{marginTop:12}}>
          {/* 收藏按钮 */}
          <button className="btn" onClick={()=>toggle(p.id)} aria-pressed={has(p.id)}>
            {has(p.id) ? "❤️ 已收藏" : "🤍 收藏"}
          </button>
          {/* 加入购物车按钮 */}
          <button className="btn btn--primary" onClick={()=>add(p, 1)}>加入购物车</button>
        </div>
      </div>
    </div>
  );
}
