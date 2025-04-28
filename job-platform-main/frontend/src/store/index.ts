import { create } from 'zustand';
import { Job, Application, User } from '../types';

// Define the store type
interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  token: string | null;
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// Load token from localStorage
const tokenFromStorage = localStorage.getItem('token') || null;
const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

export const useStore = create<Store>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  currentUser: userFromStorage,  // Initialize currentUser from localStorage (if it exists)
  token: tokenFromStorage,       // Initialize token from localStorage
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
    } else {
      localStorage.removeItem('user');  // Clear user from localStorage
    }
    set({ currentUser: user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token); // Persist token to localStorage
    } else {
      localStorage.removeItem('token');  // Clear token from localStorage
    }
    set({ token });
  },
}));
