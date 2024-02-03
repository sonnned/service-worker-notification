import { useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import useConnectSocket from "../hooks/useConnectSocket";
import { socketStatus } from "../store/socketStatus";
import { currentStatus } from "../store/currentStatus";
import { messagesStatus } from "../store/messagesStatus";

interface FormInput {
  username: string;
  room: string;
  password: string;
  email: string;
}

const JoinRoomForm = () => {
  const [formInput, setFormInput] = useState<FormInput>({
    username: "",
    room: "",
    password: "",
    email: "",
  });
  const $socketStatus = useStore(socketStatus);
  const $currentStatus = useStore(currentStatus);
  const $messagesStatus = useStore(messagesStatus);
  const { isConnected } = useConnectSocket();
  // console.log($socketStatus, $currentStatus, $messagesStatus);

  const change = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormInput({ ...formInput, [target.name]: target.value });
  };

  const submit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!formInput.room || !formInput.username || !formInput.password || !formInput.email) return;

    if (isConnected) {
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formInput.username,
          password: formInput.password,
          email: formInput.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          currentStatus.set({
            username: formInput.username,
            socketId: data.socketId || '',
            room: formInput.room,
            active: true,
            notificationToken: '',
            id: data.id,
            email: formInput.email,
            image: data.image || '',
            phone_number: data.phone_number || '',
          });
        })
        .catch((err) => {
          console.error(err);
        });
      socketStatus.get().socket?.emit("user-active", {
        username: formInput.username,
        email: formInput.email,
        password: formInput.password,
      });
      // socketStatus.get().socket?.emit("join", formInput.room);

      // currentStatus.set({
      //   ...currentStatus.get(),
      //   room: formInput.room,
      // });

      // messagesStatus.set({
      //   messages: [],
      //   messagesLoaded: false,
      // });
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
        Password
      </label>
      <input
        class="border border-pretty rounded-md p-2 mb-4"
        type="password"
        name="password"
        id="password"
        value={formInput.password}
        onChange={change}
      />
      <label class="text-pretty text-sm font-medium mb-2" for="room">
        Email
      </label>
      <input
        class="border border-pretty rounded-md p-2 mb-4"
        type="email"
        name="email"
        id="email"
        value={formInput.email}
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
