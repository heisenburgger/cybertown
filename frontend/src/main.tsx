import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import './styles/global.css'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

init({ data })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <Toaster position="top-left" />
  </React.StrictMode>,
)
