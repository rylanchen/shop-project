import { Link } from "react-router-dom";
import { useCart } from "../store/cart.js";
import { useFav } from "../store/fav.js";
import { rmb } from "../utils/format.js";

export default function ProductCard({ p }){
  const add = useCart(s => s.add);
  const { toggle, has } = useFav(s => ({ toggle: s.toggle, has: s.has }));

  return (
    <div className="card">
      <Link to={`/product/${p.id}`}>
        <img className="card__cover" src={p.thumbnail} alt={p.title} loading="lazy"
          onError={(e)=>{ e.currentTarget.src="/placeholder.svg"; }}
        />
      </Link>
      <div className="card__body">
        <div>
          <span className="badge">{p.brand}</span>
        </div>
        <Link to={`/product/${p.id}`} style={{textDecoration:"none", color:"inherit"}}>
          <div title={p.title} style={{fontWeight:600, lineHeight:1.2}}>{p.title}</div>
        </Link>
        <div className="meta">{p.category} · 库存 {p.stock} 件 {p.weight ? ("· 重量 " + p.weight) : ""}</div>
        <div className="price">{rmb(p.price)}</div>
        <div className="actions">
          <button className="btn" onClick={()=>toggle(p.id)} aria-pressed={has(p.id)}>
            {has(p.id) ? "❤️ 已收藏" : "🤍 收藏"}
          </button>
          <button className="btn btn--primary" onClick={()=>add(p, 1)}>加入购物车</button>
        </div>
      </div>
    </div>
  );
}
