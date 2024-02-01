import { atom } from 'nanostores';

interface CurrentStatus {
  room: string;
  username: string;
  active: boolean;
  socketId?: string;
  notificationToken: string;
};

export const currentStatus = atom<CurrentStatus>({
  room: '',
  username: '',
  active: false,
  socketId: '',
  notificationToken: '',
});