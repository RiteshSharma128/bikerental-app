import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: { phone: '', firstName: '', lastName: '', email: '' },
  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
