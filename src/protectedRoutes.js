import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // check the auth user object with token
    const AuthUser = localStorage.getItem('AuthUser');
    if (!AuthUser) return <Navigate to={'/enter-the-floor'} />
    return children;
}

export default ProtectedRoute;