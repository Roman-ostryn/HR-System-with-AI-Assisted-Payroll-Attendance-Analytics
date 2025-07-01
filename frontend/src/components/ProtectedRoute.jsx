import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      // Verificamos si el token ha cambiado
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    // Escuchamos los cambios en el localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup para evitar posibles memory leaks
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;