import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import { validateEnv } from './config/env'
import App from './App'

const { warnings } = validateEnv()
if (!import.meta.env.DEV && warnings.length) {
  warnings.forEach(w => console.warn(`[env] ${w}`))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
