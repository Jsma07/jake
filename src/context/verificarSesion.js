import React, { useEffect, useState } from 'react';
import { useUser } from '../context/ContextoUsuario';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, requiredPermissions }) => {
  const { user, permissions } = useUser();
  const [isAccessible, setIsAccessible] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('No has iniciado sesión. Serás redirigido...');
    } else {
      const hasRequiredPermissions = requiredPermissions.some(permission => 
        permissions.includes(permission)
      );

      if (!hasRequiredPermissions) {
        toast.error('No tienes los permisos requeridos. Serás redirigido...');
      }

      setIsAccessible(hasRequiredPermissions);
    }
  }, [user, permissions, requiredPermissions]);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        window.location.href = '/iniciarSesion';
      }, 3000);
      return () => clearTimeout(timer);
    } else if (!isAccessible) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, isAccessible]);

  if (!user || !isAccessible) {
    return null;
  }

  return children;
};

export default PrivateRoute;
