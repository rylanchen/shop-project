import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

export default function App(){
  // 这里把路由包在错误边界里——项目上线后你总会遇到奇奇怪怪的报错，
  // 有个兜底比“白屏+一脸懵”强多了。
  return (
    <div className="app">
      <Header />
      <div className="container">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
      <footer>© {new Date().getFullYear()} 市集 · 做点实用的</footer>
    </div>
  );
}
