import { createContext, useState } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);
  const login = (jwtToken, email) => {
    setToken(jwtToken);
    setUserEmail(email);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('userEmail', email);
  };
  const logout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.clear();
  };
  return (
    <AuthContext.Provider value={{ token, userEmail, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};