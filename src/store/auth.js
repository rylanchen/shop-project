import { create } from "zustand";
import { persist } from "zustand/middleware";

// 简单够用的“假登录”。等真接后端再换。
export const useAuth = create()(persist(
  (set, get) => ({
    token: null,
    user: null,
    async login(username, password){
      await new Promise(r => setTimeout(r, 300));
      const token = btoa(username + ":" + password);
      set({ token, user: { name: username } });
    },
    logout(){ set({ token: null, user: null }); },
    get isAuthed(){ return !!get().token; }
  }),
  {
    name: "auth_v2",
    partialize: (s) => ({ token: s.token, user: s.user }),
  }
));
