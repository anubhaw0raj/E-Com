import React, { useEffect, useRef, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { User } from "../models";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const location = useLocation();
  const alertShown = useRef<boolean>(false); // prevent multiple alerts

  useEffect(() => {
    if (!user && !alertShown.current) {
      alert("Login required to access this page");
      alertShown.current = true; // mark alert as shown
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
