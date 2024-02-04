import { type ReactNode, useEffect, useRef } from "preact/compat";
import useConnectSocket from "../hooks/useConnectSocket";
import { useStore } from "@nanostores/preact";
import { socketStatus } from "../store/socketStatus";
import { currentStatus } from "../store/currentStatus";

interface Notification {
  children: ReactNode;
}

const NotificationProvider = ({ children }: Notification) => {
  const $socketStatus = useStore(socketStatus);
  const $currentStatus = useStore(currentStatus);
  const { isConnected } = useConnectSocket();
  const audioUrl = "/sounds/notification.mp3";
  const audioRef = useRef<HTMLAudioElement>(null);

  const serviceWorker = ({ title, body }: { title: string; body: string }) => {
    navigator.serviceWorker.register("sw.js");
    return Notification.requestPermission((result) => {
      if (result === "granted") {
        if (audioRef.current) {
          console.log("play");
          audioRef.current.play();
        }
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            body,
          });
        });
      }
    });
  };

  useEffect(() => {
    if (isConnected) {
      if (currentStatus.get().id) {
        socketStatus
        .get()
        .socket?.on(
          `notification-${currentStatus.get().id}`,
          ({ title, body }: { title: string; body: string }) => {
            serviceWorker({ title, body });
          }
        );
      }
    }
  }, [isConnected, currentStatus.get().id]);

  return (
    <body class="bg-gray-100 text-neutral-900 font-sans antialiased">
      <audio ref={audioRef} autoPlay={false} src={audioUrl} muted={false}></audio>
      {children}
    </body>
  );
};

export default NotificationProvider;
