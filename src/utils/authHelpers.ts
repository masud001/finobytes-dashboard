export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

export const getAuthRole = (): string | null => {
  return localStorage.getItem('auth-role');
};

export const getAuthUser = (): any | null => {
  const user = localStorage.getItem('auth-user');
  return user ? JSON.parse(user) : null;
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token);
};

export const setAuthRole = (role: string): void => {
  localStorage.setItem('auth-role', role);
};

export const setAuthUser = (user: any): void => {
  localStorage.setItem('auth-user', JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-role');
  localStorage.removeItem('auth-user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getAuthRole();
};
