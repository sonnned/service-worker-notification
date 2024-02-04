import { useEffect } from "preact/hooks";
import { allUsersStatus } from "../store/allUsersStatus";
import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";
import { messagesStatus } from "../store/messagesStatus";

const UsersList = () => {
  const $allUsersStatus = useStore(allUsersStatus);
  const $currentStatus = useStore(currentStatus);
  const $messagesStatus = useStore(messagesStatus);

  const fetchApi = async (url: string) => {
    try {
      const response = await fetch(`http://localhost:3000/${url}/${currentStatus.get().admin}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      allUsersStatus.set({
        users: json.data,
        usersLoaded: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApiRoom = async (url: string) => {
    currentStatus.set({
      ...currentStatus.get(),
      room: "",
    });
    messagesStatus.set({
      messages: [],
      messagesLoaded: false,
    });
    try {
      const response = await fetch(`http://localhost:3000/room/${url}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      currentStatus.set({
        ...currentStatus.get(),
        room: json.data.id,
      });
      messagesStatus.set({
        messages: json.data.messages,
        messagesLoaded: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!allUsersStatus.get().usersLoaded && currentStatus.get().email) {
      fetchApi("users");
    }
  }, [allUsersStatus.get().usersLoaded, currentStatus.get().email])

  return <div>
    {allUsersStatus.get().usersLoaded ? (
      <div class="flex flex-col w-full max-w-sm p-4 rounded-xl text-neutral-900 font-medium">
        {allUsersStatus.get().users.map((user) => {
          const roomLink = user.admin ? `${user.id}+${currentStatus.get().id}` : `${currentStatus.get().id}+${user.id}`;
          return (
            <div onClick={() => fetchApiRoom(roomLink)} key={user.id} class="flex justify-start items-center p-2 space-x-3 ring-2 rounded-lg ring-black cursor-pointer hover:bg-neutral-800 ease-in-out duration-500 hover:bg-opacity-80 hover:text-white">
              <img src={user.image} alt={`${user.id} image`} class="w-8 h-8 rounded-full" />
              <div>{user.username}</div>
              <p class={`w-2 h-2 rounded-full ${user.active ? "bg-green-500" : "bg-red-500"}`}></p>
            </div>
          );
        }
        )}
      </div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
}

export default UsersList;