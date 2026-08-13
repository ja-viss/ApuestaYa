import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    const w = window;
    if (w && 'caches' in w) {
      w.caches.keys().then((names) => {
        return Promise.all(names.map((name) => w.caches.delete(name)));
      }).finally(() => {
        w.location.reload();
      });
    } else if (w) {
      w.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', color: '#ec4899' }}>
            Apuesta Ya • Error de Carga
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '400px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Se ha detectado una versión desactualizada o un fallo temporal de caché en el navegador.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              backgroundColor: '#ec4899',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            Limpiar Caché y Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Registrar o actualizar Service Worker para PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.update();
    }).catch(err => {
      console.warn('Service Worker registration failed: ', err);
    });
  });
}

