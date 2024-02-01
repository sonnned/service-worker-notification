import { useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import useConnectSocket from "../hooks/useConnectSocket";
import { socketStatus } from "../store/socketStatus";
import { currentStatus } from "../store/currentStatus";
import { messagesStatus } from "../store/messagesStatus";

interface FormInput {
  username: string;
  room: string;
}

const JoinRoomForm = () => {
  const [formInput, setFormInput] = useState<FormInput>({
    username: "",
    room: "",
  });
  const $socketStatus = useStore(socketStatus);
  const $currentStatus = useStore(currentStatus);
  const $messagesStatus = useStore(messagesStatus);
  const { isConnected } = useConnectSocket();

  const change = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormInput({ ...formInput, [target.name]: target.value });
  };

  const submit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!formInput.room || !formInput.username) return;

    if (isConnected) {
      socketStatus.get().socket?.emit("user-active", formInput.username);
      socketStatus.get().socket?.emit("join", formInput.room);

      currentStatus.set({
        ...currentStatus.get(),
        room: formInput.room,
      });

      messagesStatus.set({
        messages: [],
        messagesLoaded: false,
      });
    }
  };

  return isConnected ? (
    <form
      class="flex flex-col w-full max-w-sm p-4 bg-neutral-300 rounded-xl shadow-lg text-neutral-900 font-medium border border-neutral-400"
      onSubmit={submit}
    >
      <label class="text-pretty text-sm font-medium mb-2" for="username">
        Username
      </label>
      <input
        class="border border-pretty rounded-md p-2 mb-4"
        type="text"
        name="username"
        id="username"
        value={formInput.username}
        onChange={change}
      />
      <label class="text-pretty text-sm font-medium mb-2" for="room">
        Room
      </label>
      <input
        class="border border-pretty rounded-md p-2 mb-4"
        type="text"
        name="room"
        id="room"
        value={formInput.room}
        onChange={change}
      />
      <button
        class="bg-pretty text-white rounded-md p-2 bg-neutral-900 hover:bg-neutral-950 font-semibold text-lg"
        type="submit"
      >
        Join
      </button>
    </form>
  ) : null;
};

export default JoinRoomForm;
