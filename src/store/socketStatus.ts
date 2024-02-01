import { atom } from 'nanostores';
import type { Socket } from 'socket.io-client';

interface SocketStatus {
  socket: Socket | null;
  isConnected: boolean;
};

export const socketStatus = atom<SocketStatus>({
  socket: null,
  isConnected: false,
});
