import NotificationProvider from './provider/NotificationProvider'
import JoinRoomForm from './components/JoinRoomForm'
import FetchAllUsers from './components/FetchAllUsers'
import Chat from './components/Chat'

export function App() {
  return (
    <NotificationProvider>
		<main class="h-screen w-screen flex flex-row p-6">
			<div class="w-max flex justify-start items-start flex-col">
				<JoinRoomForm />
				<div class="flex flex-col w-full max-w-sm p-4 rounded-xl text-neutral-900 font-medium">
					<FetchAllUsers />
				</div>
			</div>
			<div class="w-full px-4">
				<Chat />
			</div>
		</main>
	</NotificationProvider>
  )
}
