import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TamboProvider } from '@tambo-ai/react'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'
import { dittoComponents } from './tambo/registry.tsx'

const apiKey = import.meta.env.VITE_TAMBO_API_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TamboProvider
        apiKey={apiKey}
        components={dittoComponents}
      >
        <App />
      </TamboProvider>
    </AuthProvider>
  </StrictMode>,
)