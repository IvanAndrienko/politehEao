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
        const response = await fetch('/api/auth/me', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        setIsAuthenticated(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login', { replace: true });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
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
