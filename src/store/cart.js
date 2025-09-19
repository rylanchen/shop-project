import { create } from "zustand";
import { persist } from "zustand/middleware";

// 购物车只存最小必要信息，价格以“元”为单位
export const useCart = create()(persist(
  (set, get) => ({
    items: [], // {id,title,price,qty,thumbnail}
    add(p, qty = 1){
      const arr = [...get().items];
      const idx = arr.findIndex(i => i.id === p.id);
      if (idx >= 0){
        arr[idx].qty = Math.min(99, arr[idx].qty + qty);
      }else{
        arr.push({ id: p.id, title: p.title, price: p.price, qty, thumbnail: p.thumbnail });
      }
      set({ items: arr });
    },
    remove(id){
      set({ items: get().items.filter(i => i.id !== id) });
    },
    update(id, qty){
      if (qty <= 0) return get().remove(id);
      set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) });
    },
    clear(){ set({ items: [] }); },
    total(){ return get().items.reduce((s, i) => s + i.price * i.qty, 0); },
    count(){ return get().items.reduce((s, i) => s + i.qty, 0); }
  }),
  {
    name: "cart_v2",                         // 升版本，避免读取旧的无函数状态
    partialize: (s) => ({ items: s.items }), // 只持久化数据
  }
));
