import { atom } from 'nanostores';

export interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  image: string;
  active: boolean;
  socketId: string;
  admin: boolean;
}

interface AllUsersStatus {
  users: User[];
  usersLoaded: boolean;
}

export const allUsersStatus = atom<AllUsersStatus>({
  users: [],
  usersLoaded: false,
});