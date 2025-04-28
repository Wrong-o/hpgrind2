import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authStore from '../store/authStore';

const RoleProtectedRoute = ({ children, requiredPermission }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = authStore((state) => state.token);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/check-permission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ permission: requiredPermission })
        });

        console.log("Response:", response);
        if (response.ok) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkPermission();
    } else {
      setLoading(false);
      setHasPermission(false);
    }
  }, [token, requiredPermission]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!hasPermission) {
    return <Navigate to="/main-menu" replace />;
  }

  return children;
};

export default RoleProtectedRoute; 