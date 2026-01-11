'use client';

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const setUserRole = (role: 'creator' | 'editor' | 'admin') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role);
  }
};

export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
};

export const setUserData = (data: { email: string; name?: string; id?: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(data));
  }
};

export const getUserData = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const logout = () => {
  removeToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  }
};
