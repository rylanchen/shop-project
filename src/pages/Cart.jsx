import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart.js";
import { useAuth } from "../store/auth.js";
import { rmb } from "../utils/format.js";

/**
 * 购物车组件
 * 显示用户已添加的商品，支持修改数量、移除商品和清空购物车
 * 使用路由守卫确保只有登录用户可以访问
 */
export default function Cart(){
  // 从购物车hook中获取购物车相关状态和方法
  const { items, update, remove, clear, total } = useCart();
  // 获取用户认证token
  const { token } = useAuth();
  // 获取导航功能
  const nav = useNavigate();

  // 简单路由守卫：没登录就拦回登录页
  useEffect(() => {
    if (!token){
      nav(`/login?redirect=/cart`);
    }
  }, [token, nav]);

  if (!token) return null; // 等重定向

  if (items.length === 0){
    return <div>购物车还是空的，去逛逛吧。</div>;
  }

  return (
    <div>
      <h2>购物车</h2>
      <div style={{display:"grid", gap:12}}>
        {items.map(i => (
          <div key={i.id} style={{display:"grid", gridTemplateColumns:"64px 1fr auto", gap:12, alignItems:"center", background:"#fff", border:"1px solid #e8e8e8", borderRadius:12, padding:8}}>
            <img src={i.thumbnail || "/placeholder.png"} alt={i.title} width="64" height="64" style={{objectFit:"cover", borderRadius:8}} />
            <div>
              <div style={{fontWeight:600}}>{i.title}</div>
              <div className="meta">{rmb(i.price)}</div>
            </div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              <button className="btn" onClick={()=>update(i.id, Math.max(1, i.qty - 1))}>-</button>
              <span>{i.qty}</span>
              <button className="btn" onClick={()=>update(i.id, Math.min(99, i.qty + 1))}>+</button>
              <button className="btn" onClick={()=>remove(i.id)}>移除</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16}}>
        <button className="btn" onClick={clear}>清空</button>
        <div style={{fontSize:18}}>合计：<strong>{rmb(total())}</strong></div>
      </div>
    </div>
  );
}
