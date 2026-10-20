import { Navigate } from "react-router-dom";
import { getStoredAdmin } from "../api/auth";

function PublicRoute({ children }) {
  const admin = getStoredAdmin();

  if (admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;