import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css' // Removed as per cleanup plan
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)