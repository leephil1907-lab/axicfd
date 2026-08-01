import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { FirebaseProvider } from '@/providers/FirebaseProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <FirebaseProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </FirebaseProvider>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)