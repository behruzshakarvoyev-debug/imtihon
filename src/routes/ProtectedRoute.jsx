import { Navigate } from "react-router-dom";
import { getStoredAdmin } from "../api/auth";

function ProtectedRoute({ children }) {
  const admin = getStoredAdmin();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;