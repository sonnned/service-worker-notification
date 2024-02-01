import { io } from "socket.io-client";
import { useEffect, useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { socketStatus } from "../store/socketStatus";

const useConnectSocket = () => {
  const $socketStatus = useStore(socketStatus);

  useEffect(() => {
    if (!socketStatus.get().socket) {
      const newSocket = io("http://localhost:3000");
      socketStatus.set({
        socket: newSocket,
        isConnected: false,
      });
      newSocket.on("connect", () => {
        socketStatus.set({
          ...socketStatus.get(),
          isConnected: true,
        })
      });
    }
  }, [socketStatus.get().socket]);


  return {
    isConnected: socketStatus.get().isConnected,
  };
};

export default useConnectSocket;
