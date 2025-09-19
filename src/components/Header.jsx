import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart.js";
import { useAuth } from "../store/auth.js";

/**
 * 页面头部组件
 * 显示网站标题、导航链接和用户状态
 */
export default function Header(){
  // 使用购物车状态钩子获取商品数量
  const count = useCart(s => s.count());
  // 使用认证状态钩子获取用户信息和认证状态
  const { isAuthed, user, logout } = useAuth(s => ({ isAuthed: !!s.token, user: s.user, logout: s.logout }));
  // 使用导航钩子进行页面跳转
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="header__bar container">
        <div className="header__brand">市集</div>
        <nav className="header__nav">
          <NavLink to="/" end>首页</NavLink>
          <NavLink to="/cart">购物车 {count > 0 ? `(${count})` : ""}</NavLink>
          {isAuthed ? (
            <>
              <span style={{alignSelf:"center", color:"#666"}}>你好，{user?.name}</span>
              <a href="#" onClick={(e)=>{e.preventDefault(); logout(); nav("/");}}>退出</a>
            </>
          ) : (
            <NavLink to="/login">登录</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
