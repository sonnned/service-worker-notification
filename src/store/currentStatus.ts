import { atom } from 'nanostores';

interface CurrentStatus {
  room: string;
  username: string;
  active: boolean;
  socketId?: string;
  notificationToken: string;
  email: string;
  phone_number: string;
  image: string;
  id: string;
  admin: boolean;
};

export const currentStatus = atom<CurrentStatus>({
  room: '',
  username: '',
  active: false,
  socketId: '',
  notificationToken: '',
  email: '',
  phone_number: '',
  image: '',
  id: '',
  admin: false,
});