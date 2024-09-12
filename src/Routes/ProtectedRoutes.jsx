import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  try {
    // Decode the JWT payload manually
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decodedToken = JSON.parse(jsonPayload);

    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    if (decodedToken.exp < currentTime) {
      // If the token has expired, redirect to the login page
      localStorage.removeItem('token'); // Optionally remove the expired token
      return <Navigate to="/login" />;
    }
  } catch (error) {
    // If there's an error decoding the token, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the token is valid and not expired, render the protected component
  return children;
};

export default ProtectedRoute;