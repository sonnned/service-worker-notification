import NotificationProvider from "./provider/NotificationProvider";
import Chat from "./components/Chat";
import AuthForm from "./components/AuthForm";
import RouterProvider from "./provider/RouterProvider";
import { NavLink, Route, Routes } from "react-router-dom";
import SessionProvider from "./provider/SessionProvider";
import UsersList from "./components/UsersList";
import SocketProvider from "./provider/SocketProvider";

export function App() {
  return (
    <RouterProvider>
      <NotificationProvider>
        <SocketProvider>
          <SessionProvider>
            <main class="h-screen w-screen p-6">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="flex space-x-3 justify-center items-center">
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                        <NavLink to="/chat">Chat</NavLink>
                      </div>
                    </>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <>
                      <AuthForm key="login" variant="login" />
                      <NavLink to="/register">Register</NavLink>
                    </>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <>
                      <AuthForm key="register" variant="register" />
                      <NavLink to="/">Login</NavLink>
                    </>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <>
                      <NavLink to="/login">Login</NavLink>
                      <NavLink to="/register">Register</NavLink>
                      <NavLink to="/">Home</NavLink>
                      <UsersList />
                      <Chat />
                    </>
                  }
                />
              </Routes>
            </main>
          </SessionProvider>
        </SocketProvider>
      </NotificationProvider>
    </RouterProvider>
  );
}
