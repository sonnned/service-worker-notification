import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";
import { useEffect, useState } from "preact/hooks";
import { messagesStatus, type MessageStatus } from "../store/messagesStatus";
import { socketStatus } from "../store/socketStatus";

const Chat = () => {
  const $currentStatus = useStore(currentStatus);
  const $messagesStatus = useStore(messagesStatus);
  const [message, setMessage] = useState<string>("");
  const $socketStatus = useStore(socketStatus);

  const change = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setMessage(target.value);
  };

  const submit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!message || !currentStatus.get().room || !currentStatus.get().id) return;

    if (socketStatus.get().isConnected) {
      socketStatus.get().socket?.emit('message', {
        content: message,
        content_type: 'text',
        conversation_id: currentStatus.get().room,
        sender_id: currentStatus.get().id
      })
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
        ) : null}
      </div>
      <div>
        <div>
          {messagesStatus.get().messagesLoaded
            ? messagesStatus.get().messages.map((message) => (
                <div class="flex gap-2">
                  <p class="font-bold">{message.sender_id}</p>
                  <p>{message.content}</p>
                </div>
              ))
            : null}
        </div>
        {messagesStatus.get().messagesLoaded ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
