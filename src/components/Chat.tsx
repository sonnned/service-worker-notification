import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";
import { useEffect, useState } from "preact/hooks";
import { messagesStatus, type MessageStatus } from "../store/messagesStatus";
import { socketStatus } from "../store/socketStatus";
import useConnectSocket from "../hooks/useConnectSocket";

const Chat = () => {
  const $currentStatus = useStore(currentStatus);
  const $messagesStatus = useStore(messagesStatus);
  const $socketStatus = useStore(socketStatus);
  const { isConnected } = useConnectSocket();
  const [message, setMessage] = useState<string>("");

  const fetchMessagesFromRoom = async (room: string) => {
    const response = await fetch(`http://localhost:3000/${room}/messages/`);
    const data = await response.json();

    messagesStatus.set({
      ...messagesStatus.get(),
      messages: data,
      messagesLoaded: true,
    });
  };

  useEffect(() => {
    if (isConnected) {
      socketStatus
        .get()
        .socket?.on("message", ({ room, message, username }: MessageStatus) => {
          if (room === currentStatus.get().room) {
            messagesStatus.set({
              ...messagesStatus.get(),
              messages: [
                ...messagesStatus.get().messages,
                { username, message, room },
              ],
            });
          }
        });
    }
  }, [isConnected]);

  useEffect(() => {
    if (!messagesStatus.get().messagesLoaded && currentStatus.get().room) {
      fetchMessagesFromRoom(currentStatus.get().room);
    }
  }, [messagesStatus.get().messagesLoaded, currentStatus.get().room]);

  const change = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setMessage(target.value);
  };

  const submit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!message || !currentStatus.get().room || !currentStatus.get().username)
      return;

    if (isConnected) {
      socketStatus.get().socket?.emit("message", {
        username: currentStatus.get().username,
        message,
        room: currentStatus.get().room,
      });
    }

    setMessage("");
  };

  return (
    <div>
      <div class="flex w-full items-center justify-start">
        {currentStatus.get().room ? (
          <h2 class="text-2xl font-medium flex gap-2">
            Chatting in room:<p class="underline">{currentStatus.get().room}</p>
          </h2>
        ) : (
          <h2 class="bg-neutral-600 animate-pulse w-64 h-6 rounded-lg"></h2>
        )}
      </div>
      <div>
        <div>
          {messagesStatus.get().messagesLoaded
            ? messagesStatus.get().messages.map((message) => (
                <div class="flex gap-2">
                  <p class="font-bold">{message.username}</p>
                  <p>{message.message}</p>
                </div>
              ))
            : null}
        </div>
        <form
          onSubmit={submit}
          class="flex flex-row gap-2 items-center justify-center w-full"
        >
          <input
            type="text"
            placeholder="Type a message..."
            name="message"
            value={message}
            onChange={change}
            class="w-[80%] rounded-lg border-2 border-neutral-400 p-2"
          />
          <button class="bg-neutral-900 text-white rounded-lg p-2 w-[20%]">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
