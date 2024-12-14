import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Toaster position="top-right" />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
