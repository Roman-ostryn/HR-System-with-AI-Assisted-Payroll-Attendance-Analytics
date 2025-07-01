import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityTimeout = (timeout = 3600000) => {
  const navigate = useNavigate();
  const timeoutIdRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      // Aquí puedes manejar la lógica para cerrar la sesión y redirigir al login
      localStorage.removeItem("authToken");
      navigate("/login");
    }, timeout);
  };

  useEffect(() => {
    const handleActivity = () => resetTimeout();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    resetTimeout(); // Inicia el timeout cuando el componente se monta

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [navigate, timeout]);

  return null; // Este hook no necesita renderizar nada
};

export default useInactivityTimeout;
