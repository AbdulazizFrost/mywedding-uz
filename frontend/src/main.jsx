import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n'
import App from './App.jsx'

// Intercept fetch to add Bearer token for Safari/mobile where cookies might be blocked
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('token');
  
  if (token && typeof resource === 'string' && resource.includes('/api/')) {
    config = config || {};
    const headers = new Headers(config.headers || {});
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    config.headers = headers;
  }
  
  const response = await originalFetch(resource, config);
  
  // Auto-logout if token is invalid
  if (response.status === 401 && typeof resource === 'string' && !resource.includes('/auth/login') && !resource.includes('/auth/register')) {
    localStorage.removeItem('token');
  }
  
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
