/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);

   useEffect(() => {
      const storedUser = localStorage.getItem('invoiceUser');
      if (storedUser) setUser(JSON.parse(storedUser));
   }, []);

   const login = userData => {
      localStorage.setItem('invoiceUser', JSON.stringify(userData));
      setUser(userData);
   };

   const logout = () => {
      localStorage.removeItem('invoiceUser');
      setUser(null);
   };

   return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
