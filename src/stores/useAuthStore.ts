import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const defaultGuestUser: User = {
  id: 'guest-1',
  name: 'Guest Explorer',
  email: 'guest@resumatch.local',
  role: 'Candidate',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: defaultGuestUser,
  isLoading: false,
  
  login: async (email: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 'user-1',
        name: email.split('@')[0] || 'User',
        email,
        role: 'Candidate',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      }
    });
  },
  
  logout: () => {
    // Return to guest-access mode
    set({ isAuthenticated: true, user: defaultGuestUser });
  },
}));

