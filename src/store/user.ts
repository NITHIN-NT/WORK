import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthorized: boolean;
  isRevoked: boolean;
  setUser: (user: User | null, profile?: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthorized: (isAuthorized: boolean) => void;
}



export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthorized: false,
  isRevoked: false,
  setUser: (user, profile = null) => set({ 
    user, 
    profile, 
    isAuthorized: profile?.status === 'Active',
    isRevoked: profile?.status === 'Revoked',
    isLoading: false 
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthorized: (isAuthorized) => set({ isAuthorized }),
}));


