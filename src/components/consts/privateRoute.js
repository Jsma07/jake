import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/iniciarSesion" />;
};

export default PrivateRoute;
