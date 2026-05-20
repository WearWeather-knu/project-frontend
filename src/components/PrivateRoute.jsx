import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ session }) {
  return session ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
