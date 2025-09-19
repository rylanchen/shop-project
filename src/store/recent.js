import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRecent = create()(persist(
  (set, get) => ({
    list: [], // {id,title,at}
    push(item){
      const dedup = get().list.filter(x => x.id !== item.id);
      set({ list: [{ ...item, at: Date.now() }, ...dedup].slice(0, 12) });
    }
  }),
  {
    name: "recent_v2",
    partialize: (s) => ({ list: s.list }),
  }
));
