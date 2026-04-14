import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import { getRuntimeConfig, validateEnv } from './config/env'
import { PasswordGate } from './components/PasswordGate'
import App from './App'
import { Analytics } from '@vercel/analytics/react'

const { warnings } = validateEnv()
const runtimeConfigTarget = window as Window & {
  __VERO_RUNTIME_CONFIG__?: ReturnType<typeof getRuntimeConfig>
}
runtimeConfigTarget.__VERO_RUNTIME_CONFIG__ = getRuntimeConfig()
if (!import.meta.env.DEV && warnings.length) {
  warnings.forEach(w => console.warn(`[env] ${w}`))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PasswordGate>
        <App />
        <Analytics />
      </PasswordGate>
    </BrowserRouter>
  </StrictMode>,
)
