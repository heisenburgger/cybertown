import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/base.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from '@/pages/home'
import { Profile } from '@/pages/profile'
import { AuthRedirect } from '@/pages/auth-redirect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: import.meta.env.DEV === false,
    }
  }
})

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth-redirect", element: <AuthRedirect /> },
  { path: "/profile", element: <Profile /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
