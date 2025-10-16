import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true }) // sends httpOnly cookie
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  return isAuth ? children : <Navigate to="/" replace />;
}
