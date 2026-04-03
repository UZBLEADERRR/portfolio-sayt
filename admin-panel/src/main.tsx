import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('SARVAR.GPT Admin Panel Bootstrap...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element #root not found!');

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('SARVAR.GPT Admin Panel Rendered Successfully.');
} catch (error: any) {
  console.error('CRITICAL ERROR DURING BOOTSTRAP:', error);
  document.body.innerHTML = `
    <div style="background:#0a0515; color:#FF4F6D; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
      <h1 style="font-size:48px; margin-bottom:10px;">⚠️ Admin Panel Error</h1>
      <p style="font-size:18px; color:rgba(255,255,255,0.5);">JavaScript runtime error detected.</p>
      <div style="background:rgba(255,79,109,0.1); padding:20px; border-radius:10px; margin-top:20px; font-size:14px; max-width:600px; overflow:auto; text-align:left; color: white; border: 1px solid rgba(255,255,255,0.1);">
        <strong>Error message:</strong><br/>
        ${error.message}<br/><br/>
        <strong>Stack trace:</strong><br/>
        <code style="font-size:12px; color: rgba(255,255,255,0.4);">${error.stack || 'No stack trace available'}</code>
      </div>
      <button onclick="location.reload()" style="margin-top:20px; padding:12px 24px; background:#9B6DFF; border:none; color:white; border-radius:10px; cursor:pointer; font-weight:bold;">Refresh Page</button>
    </div>
  `;
}
