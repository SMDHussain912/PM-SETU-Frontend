import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import './styles/pages.css'
import App from './App.jsx'
import { PrefsProvider } from './context/PrefsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrefsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrefsProvider>
  </StrictMode>,
)
