import { apiUrl } from '../lib/api.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('adminToken');

    if (!token) {
      navigate('/admin/login', { replace: true });
      setIsLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        console.log('Verifying admin token...');
        const response = await fetch(apiUrl('auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal
        });

        if (!response.ok) {
          console.error('Token verification failed:', response.status, response.statusText);
          throw new Error('Unauthorized');
        }

        console.log('Token verification successful');
        setIsAuthenticated(true);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Token verification aborted');
          return;
        }
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();

    return () => controller.abort();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
