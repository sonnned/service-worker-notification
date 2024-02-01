import { atom } from "nanostores";

export interface MessageStatus {
  message: string;
  username: string;
  room: string;
};

interface MessagesStatus {
  messages: MessageStatus[];
  messagesLoaded: boolean;
}

export const messagesStatus = atom<MessagesStatus>({
  messages: [],
  messagesLoaded: false
});