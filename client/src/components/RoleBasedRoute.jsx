import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If user role is not allowed, redirect to dashboard or login
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;
