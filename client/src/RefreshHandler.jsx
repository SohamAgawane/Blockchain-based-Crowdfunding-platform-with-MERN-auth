import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);

      // Only redirect from public pages
      const publicRoutes = ["/", "/login", "/signup"];

      if (publicRoutes.includes(location.pathname)) {
        navigate("/crowd-funding", { replace: true });
      }
    }
  }, [location.pathname, navigate, setIsAuthenticated]);

  return null;
};

export default RefreshHandler;
