import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means visitante

  const login = (email, password) => {
    // Mock login
    if (email && password) {
      setUser({
        id: 1,
        name: 'Demo',
        surname: 'User',
        email,
        city: 'Buenos Aires',
      });
      return true;
    }
    return false;
  };

  const register = (data) => {
    // Mock register
    setUser({
      id: 2,
      name: data.name,
      surname: data.surname,
      email: data.email,
      city: data.city,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
