import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.js";

/**
 * 登录组件
 * 提供用户登录功能，包括用户名和密码输入，登录状态处理和页面跳转
 */
export default function Login(){
  // 使用React的useState钩子管理用户名、密码和加载状态
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  // 使用自定义的useAuth钩子获取登录方法和token
  const { login, token } = useAuth();
  // 使用React Router的useNavigate和useLocation钩子处理导航和获取URL参数
  const nav = useNavigate();
  const loc = useLocation();

  // 已登录就没必要再停留
  useEffect(() => {
    if (token) nav("/");
  }, [token, nav]);

  /**
   * 表单提交处理函数
   * @param {Object} e - 表单提交事件对象
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setLoading(true); // 设置加载状态为true
    try{
      await login(u, p); // 调用登录函数，传入用户名和密码
      const usp = new URLSearchParams(loc.search); // 从URL查询参数中创建URLSearchParams对象
      const to = usp.get("redirect") || "/"; // 获取重定向URL，如果不存在则默认跳转到首页
      nav(to); // 执行页面导航
    }finally{
      setLoading(false); // 无论成功或失败，最终都将加载状态设置为false
    }
  };

  return (
    <div style={{maxWidth:360, margin:"24px auto", background:"#fff", border:"1px solid #e8e8e8", borderRadius:12, padding:16}}>
      <h2 style={{marginTop:0}}>登录</h2>
      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="用户名（随便填）" value={u} onChange={e=>setU(e.target.value)} />
        <input className="input" type="password" placeholder="密码（随便填）" value={p} onChange={e=>setP(e.target.value)} />
        <button className="btn btn--primary" disabled={loading}>{loading ? "登录中…" : "登录"}</button>
      </form>
      <div className="meta" style={{marginTop:8}}>本页面只是示意，没接后端，别当真。</div>
    </div>
  );
}
