import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { initialUser } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ai_study_assistant_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
    return initialUser; // Default demo logged-in user
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_study_assistant_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_study_assistant_user');
    }
  }, [user]);

  const login = async (email: string, _pass: string) => {
    if (!email) {
      return { success: false, message: 'Vui lòng nhập email hợp lệ' };
    }
    const loggedUser: User = {
      ...initialUser,
      email: email,
      name: email.split('@')[0].toUpperCase() || 'Sinh Viên',
    };
    setUser(loggedUser);
    return { success: true };
  };

  const register = async (name: string, email: string, _pass: string) => {
    if (!name || !email) {
      return { success: false, message: 'Vui lòng điền đầy đủ họ tên và email' };
    }
    const newUser: User = {
      ...initialUser,
      id: `user_${Date.now()}`,
      name: name,
      email: email,
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        updateUser: updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
