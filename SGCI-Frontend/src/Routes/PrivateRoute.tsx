import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../Service/authService';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
