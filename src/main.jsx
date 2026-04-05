import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import 'flag-icons/css/flag-icons.min.css'
import { GlobalLoaderProvider } from '@/contexts/LoadingContext'
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: '70be1517-f7b7-40e1-b265-5a023f015bc9',
    safari_web_id: 'web.onesignal.auto.2358eea7-3e97-4fb7-b492-b25c712616ac',
    notifyButton: { enable: false },
  });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalLoaderProvider>
    <App />
  </GlobalLoaderProvider>
)
