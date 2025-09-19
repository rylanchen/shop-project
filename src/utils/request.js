// 一个够用的请求封装：带点随机抖动、出错重试、最后退回到本地 mock。
// 不是追求“完美”，而是把真实场景里常见的小问题先兜住。

const API_BASE = import.meta.env.VITE_API_BASE || "https://dummyjson.com";

async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

export async function requestJson(url, { retry = 1, jitter = true, fallback } = {}){
  if (jitter){
    const delay = 200 + Math.random() * 400; // 模拟真实网络：别一闪而过
    await sleep(delay);
  }

  try{
    const res = await fetch(url, { headers: { "Accept": "application/json" }});
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  }catch(err){
    if (retry > 0){
      return requestJson(url, { retry: retry - 1, jitter, fallback });
    }
    if (fallback){
      // 最后兜底：本地 mock 文件
      const res = await fetch(fallback);
      return await res.json();
    }
    throw err;
  }
}

// 业务层的 API：能直读就直读，别提前过度抽象
export const api = {
  async listProducts({ q } = {}){
    // 优先走线上（dummyjson），失败再走本地
    const params = q ? `?limit=100&select=title,price,brand,category,thumbnail,description,stock` : `?limit=100`;
    const url = `${API_BASE}/products${params}`;
    const data = await requestJson(url, { retry: 1, fallback: "/mock/products.json" });
    // 不同数据源结构不同，做个统一
    const list = data.products || data;
    return list.map((p, i) => ({
      id: p.id ?? i + 1,
      title: p.title ?? "无标题",
      price: p.price ?? 0,
      brand: p.brand ?? "未知品牌",
      category: p.category ?? "未分类",
      thumbnail: p.thumbnail || "/placeholder.png",
      description: p.description ?? "",
      stock: p.stock ?? 0,
      weight: p.weight ?? ""
    }));
  },

  async getProduct(id){
    const url = `${API_BASE}/products/${id}`;
    const data = await requestJson(url, { retry: 1, fallback: "/mock/products.json" });
    if (data && data.id) return data;
    // 从本地 mock 里再找一遍
    const local = await requestJson("/mock/products.json");
    return (local.products || []).find(p => String(p.id) === String(id));
  }
};
