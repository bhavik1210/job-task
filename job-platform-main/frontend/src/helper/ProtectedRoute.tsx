import { Navigate } from 'react-router-dom';
import { useStore } from '../store';

interface ProtectedRouteProps {
  allowedRoles: string[]; 
  children: JSX.Element;
}

function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
