import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/base.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from '@/pages'
import { AuthRedirect } from '@/pages/auth-redirect'
import { UserProvider } from './context/UserContext'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth-redirect", element: <AuthRedirect /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
