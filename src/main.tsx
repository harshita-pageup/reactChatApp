import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { Dashboard } from './pages/dashboard/Dashboard'
import Chats from './pages/Chats'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/chats' element={<Chats />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>  
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)