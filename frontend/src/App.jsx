import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AppRouter from './router/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Footer from './components/Footer.jsx';

export default function App() {
  return (
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
  );
}
