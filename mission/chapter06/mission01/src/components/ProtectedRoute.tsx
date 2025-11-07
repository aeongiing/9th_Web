import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}