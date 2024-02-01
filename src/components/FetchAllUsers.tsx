import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { allUsersStatus, type User } from "../store/allUsersStatus";
import useConnectSocket from "../hooks/useConnectSocket";
import { socketStatus } from "../store/socketStatus";
import { currentStatus } from "../store/currentStatus";

interface UpdateSocketIdProps {
  oldSocketId: string;
  newSocketId: string;
}

interface UserActiveProps {
  username: string;
  socketId: string;
  active: boolean;
}

const FetchAllUsers = () => {
  const $allUsersStatus = useStore(allUsersStatus);
  const $socketStatus = useStore(socketStatus);
  const $currentStatus = useStore(currentStatus);
  const { isConnected } = useConnectSocket();

  const fetchAllUsers = async () => {
    const response = await fetch("http://localhost:3000/users");
    const data = await response.json();

    allUsersStatus.set({
      ...allUsersStatus.get(),
      users: data.reverse(),
      usersLoaded: true,
    });
  };

  useEffect(() => {
    if (!allUsersStatus.get().usersLoaded) {
      fetchAllUsers();
    }
  }, [allUsersStatus.get().usersLoaded]);

  useEffect(() => {
    if (isConnected) {
      socketStatus
        .get()
        .socket?.on(
          "update-socket-id",
          ({ oldSocketId, newSocketId }: UpdateSocketIdProps) => {
            const users = allUsersStatus.get().users?.map((user: User) => {
              if (user.socketId === oldSocketId) {
                currentStatus.set({
                  ...currentStatus.get(),
                  socketId: newSocketId,
                  username: user.username,
                });

                return {
                  ...user,
                  socketId: newSocketId,
                  active: true,
                };
              }

              return user;
            });

            allUsersStatus.set({
              ...allUsersStatus.get(),
              users,
            });
          }
        );

      socketStatus
        .get()
        .socket?.on(
          "user-active",
          ({ username, socketId, active }: UserActiveProps) => {
            currentStatus.set({
              ...currentStatus.get(),
              socketId,
              username,
              active,
            });

            allUsersStatus.set({
              ...allUsersStatus.get(),
              users: [
                {
                  username,
                  socketId,
                  active,
                },
                ...allUsersStatus.get().users,
              ],
            });
          }
        );

      socketStatus.get().socket?.on("user-inactive", (socketId) => {
        const users = allUsersStatus.get().users?.map((user: User) => {
          if (user.socketId === socketId) {
            return {
              ...user,
              active: false,
            };
          }

          return user;
        });

        allUsersStatus.set({
          ...allUsersStatus.get(),
          users,
        });
      });
    }
  }, [isConnected]);

  return (
    <ul class="flex flex-col w-max max-w-sm rounded-xl text-neutral-900 font-medium">
      {$allUsersStatus.users?.map((user: User) => (
        <li class="flex items-center justify-between py-2 space-x-3">
          <span class="text-sm">{user.username}</span>
          <span class="text-sm text-neutral-600 underline font-bold">
            {user.socketId}
          </span>
          <span class="text-sm text-neutral-700">
            {user.active ? "Active" : "Inactive"}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FetchAllUsers;
