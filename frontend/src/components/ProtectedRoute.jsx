// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const alertShown = useRef(false); // prevent multiple alerts

  useEffect(() => {
    if (!user && !alertShown.current) {
      alert("Login required to access this page");
      alertShown.current = true; // mark alert as shown
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
