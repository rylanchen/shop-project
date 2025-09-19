import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFav = create()(persist((set, get) => ({
  ids: [],
  toggle(id){
    const setIds = new Set(get().ids);
    if (setIds.has(id)){ setIds.delete(id); } else { setIds.add(id); }
    set({ ids: Array.from(setIds) });
  },
  has(id){ return get().ids.includes(id); }
}), { name: "fav_v1" }));
