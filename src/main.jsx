import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import '@/styles/flags.css'
import { GlobalLoaderProvider } from '@/contexts/LoadingContext'
import { reloadOnceForNewBuild } from '@/utils/lazyPage'
// a file that loads on demand failed (usually: replaced by a newer deploy) — reload into the new build
window.addEventListener('vite:preloadError', (e) => { if (reloadOnceForNewBuild()) e.preventDefault(); })
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: '9c8b733e-9d73-41bb-b092-ae462aa5cdb1',
    notifyButton: { enable: false },
  });
});

// Anything that crashes the whole app shows what broke and a reload button, instead of a white screen
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[app crash]', error, info?.componentStack); }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div dir="rtl" style={{ minHeight: '100vh', background: '#050d1c', color: '#fff', padding: 24, fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>משהו השתבש בטעינת האפליקציה</div>
        <div dir="ltr" style={{ fontSize: 12, color: '#fca5a5', background: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{String(error?.stack || error?.message || error).slice(0, 900)}</div>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 16px', borderRadius: 12, background: '#facc15', color: '#1a1405', fontWeight: 800, fontSize: 16 }}>טעינה מחדש</button>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <GlobalLoaderProvider>
      <App />
    </GlobalLoaderProvider>
  </AppErrorBoundary>
)
