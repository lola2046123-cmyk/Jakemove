import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { SkillProvider } from './context/SkillContext.tsx'
import { I18nProvider } from './i18n/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <SkillProvider>
          <App />
        </SkillProvider>
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
)
