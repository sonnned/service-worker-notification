import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";
import { useEffect } from "preact/hooks";
import { useLocation, useNavigate } from "react-router-dom";

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  const $currentStatus = useStore(currentStatus);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentStatus.get().id) {
      if (location.pathname.includes('login') || location.pathname.includes('register')) {
        navigate('/chat');
      }
    } else {
      if (location.pathname.includes('chat')) {
        navigate('/login');
      }
    }
  }, [currentStatus.get().id, location.pathname])
  return <>{children}</>;
};

export default SessionProvider;
