import { atom } from 'nanostores';

export interface User {
  username: string;
  socketId: string;
  active: boolean;
}

interface AllUsersStatus {
  users: User[];
  usersLoaded: boolean;
}

export const allUsersStatus = atom<AllUsersStatus>({
  users: [],
  usersLoaded: false,
});