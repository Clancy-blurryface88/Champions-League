import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import 'flag-icons/css/flag-icons.min.css'
import { GlobalLoaderProvider } from '@/contexts/LoadingContext'
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: '9c8b733e-9d73-41bb-b092-ae462aa5cdb1',
    notifyButton: { enable: false },
    defaultIcon: '/champions/app-icon.jpg',
  });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalLoaderProvider>
    <App />
  </GlobalLoaderProvider>
)
