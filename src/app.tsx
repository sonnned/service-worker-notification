import NotificationProvider from "./provider/NotificationProvider";
import JoinRoomForm from "./components/JoinRoomForm";
import FetchAllUsers from "./components/FetchAllUsers";
import Chat from "./components/Chat";
import AuthForm from "./components/AuthForm";
import RouterProvider from "./provider/RouterProvider";
import { NavLink, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <RouterProvider>
      <NotificationProvider>
        <main class="h-screen w-screen flex flex-row p-6">
          {/* <div class="w-max flex justify-start items-start flex-col">
            <JoinRoomForm />
            <div class="flex flex-col w-full max-w-sm p-4 rounded-xl text-neutral-900 font-medium">
              <FetchAllUsers />
            </div>
          </div>
          <div class="w-full px-4">
            <Chat />
          </div> */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AuthForm key='login' variant="login" />
                  <NavLink to="/register">Register</NavLink>
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <AuthForm key='register' variant="register" />
                  <NavLink to="/">Login</NavLink>
                </>
              }
            />
						<Route path="/chat" element={
							<>
              Hola
							{/* <JoinRoomForm /> */}
							</>
						}/>
          </Routes>
        </main>
      </NotificationProvider>
    </RouterProvider>
  );
}
