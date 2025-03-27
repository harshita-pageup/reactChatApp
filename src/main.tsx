import { JSX, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import Chats from './pages/Chats'
import { isAuthenticated } from './utils/auth'
import { UserProvider } from './context/UserContext'
import Profile from './pages/Profile'
import { UserListProvider } from './context/UserListContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/chats" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated() ? <Navigate to="/chats" /> : <Signup />} />
      <Route path="/forgot-password" element={isAuthenticated() ? <Navigate to="/chats" /> : <ForgotPassword />} />
      <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <UserListProvider>
        <RouterProvider router={router} />
      </UserListProvider>
    </UserProvider>
  </StrictMode>
)