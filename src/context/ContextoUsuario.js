import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crea el contexto
export const UserContext = createContext();

// Crea el proveedor del contexto
export const UserProvider = ({ children }) => {
  // Estado inicial del usuario y permisos
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Función para iniciar sesión y establecer el usuario
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  // Función para cerrar sesión y limpiar el usuario
  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Efecto para cargar el usuario desde el almacenamiento local al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token cargado del localStorage:', token);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      axios.get('http://localhost:5000/api/usuario')
        .then(response => {
          console.log('Datos del usuario:', response.data);
          setUser(response.data.user);
          setPermissions(response.data.permisos);
        })
        .catch(error => {
          console.error('Error al cargar los datos del usuario:', error);
          logout();
        });
    }
  }, []);
  
  return (
    <UserContext.Provider value={{ user, permissions, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  return useContext(UserContext);
};