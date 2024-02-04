import { atom } from "nanostores";

export interface MessageStatus {
  content: string;
  content_type: string;
  conversation_id: string;
  sender_id: string;
  id: string;
};

interface MessagesStatus {
  messages: MessageStatus[];
  messagesLoaded: boolean;
}

export const messagesStatus = atom<MessagesStatus>({
  messages: [],
  messagesLoaded: false
});