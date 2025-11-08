import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { SchoolColorsProvider } from './contexts/SchoolColorsContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SchoolColorsProvider>
        <App />
      </SchoolColorsProvider>
    </ThemeProvider>
  </StrictMode>,
)
