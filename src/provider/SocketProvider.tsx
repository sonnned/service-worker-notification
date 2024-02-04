import { useEffect } from "preact/hooks";
import useConnectSocket from "../hooks/useConnectSocket";
import { socketStatus } from "../store/socketStatus";
import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";
import { allUsersStatus } from "../store/allUsersStatus";
import { messagesStatus } from "../store/messagesStatus";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface UserActive {
  id?: string;
  socketId: string;
}

interface UserInactive {
  id?: string;
  socketId: string;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const {isConnected} = useConnectSocket();
  const $socketStatus = useStore(socketStatus);
  const $currentStatus = useStore(currentStatus);
  const $allUsersStatus = useStore(allUsersStatus);
  const $messagesStatus = useStore(messagesStatus);

  useEffect(() => {
    if (isConnected) {
      if (currentStatus.get().id) {
        socketStatus.get().socket?.emit('user-active', currentStatus.get().id)
        socketStatus.get().socket?.on(`user-active-${currentStatus.get().id}`, ({
          socketId
        }: UserActive) => {
          currentStatus.set({
            ...currentStatus.get(),
            socketId
          })
        })

        if (allUsersStatus.get().usersLoaded) {
          socketStatus.get().socket?.on('user-active',({
            id, socketId
          }: UserActive) => {
            allUsersStatus.get().users.forEach((_) => {
              allUsersStatus.set({
                users: allUsersStatus.get().users.map((user) => {
                  if (user.id === id) {
                    user.socketId = socketId,
                    user.active = true
                  }
                  return user
                }),
                usersLoaded: true
              })
            })
          })
          socketStatus.get().socket?.on('user-inactive',({id, socketId}: UserInactive) => {
            allUsersStatus.get().users.forEach((_) => {
              allUsersStatus.set({
                users: allUsersStatus.get().users.map((user) => {
                  if (user.id === id) {
                    user.socketId = socketId,
                    user.active = false
                  }
                  return user
                }),
                usersLoaded: true
              })
            })
          })
        }

        if (currentStatus.get().room) {
          socketStatus.get().socket?.emit('room', currentStatus.get().room)
          socketStatus.get().socket?.on('message', ({data}) => {
            messagesStatus.set({
              messages: [...messagesStatus.get().messages, data],
              messagesLoaded: true
            })
          })
        }
      }
    }
  }, [isConnected, currentStatus.get().id, currentStatus.get().room, allUsersStatus.get().usersLoaded, currentStatus.get().room, messagesStatus.get().messagesLoaded])

  return (
    <>
      {children}
    </>
  );
}

export default SocketProvider;