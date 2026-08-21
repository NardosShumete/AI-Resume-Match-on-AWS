import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  
  login: async (email: string) => {
    set({ isLoading: true });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        name: 'Demo User',
        email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      }
    });
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
