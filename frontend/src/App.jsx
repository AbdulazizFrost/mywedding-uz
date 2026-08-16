import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AppRouter from './router/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Footer from './components/Footer.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    
    // Auto-reload on chunk mismatch after new deploy
    const isChunkError = error?.message && (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('error loading dynamically imported module') ||
      error.message.includes('Loading chunk')
    );

    if (isChunkError) {
      const storageKey = 'vite_chunk_reload_' + window.location.pathname;
      const reloaded = sessionStorage.getItem(storageKey);
      if (!reloaded) {
        sessionStorage.setItem(storageKey, 'true');
        window.location.reload();
        return;
      }
    }

    this.setState({ errorInfo });
  }

  handleManualReload = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message && (
        this.state.error.message.includes('Failed to fetch dynamically imported module') ||
        this.state.error.message.includes('error loading dynamically imported module')
      );

      return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white border border-sand rounded-3xl p-8 shadow-xl">
            <h2 className="font-serif text-2xl text-charcoal mb-3">
              {isChunkError ? 'Доступно обновление сайта' : 'Упс! Произошла ошибка'}
            </h2>
            <p className="text-sm text-charcoal-light mb-6">
              {isChunkError 
                ? 'Была загружена новая версия приложения. Пожалуйста, обновите страницу для продолжения работы.' 
                : 'Пожалуйста, попробуйте обновить страницу или вернуться на главную.'}
            </p>
            <button
              onClick={this.handleManualReload}
              className="w-full py-3.5 px-6 bg-charcoal text-ivory rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-md"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
