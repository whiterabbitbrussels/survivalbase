import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyLang, langFromPath } from './i18n'

applyLang(langFromPath(window.location.pathname))
document.documentElement.lang = langFromPath(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
