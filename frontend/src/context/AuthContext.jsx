import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const response = await fetch(API_URL + '/auth/me', {
        credentials: 'include',
      });
      let data = null;
      if (response.ok) {
        data = await response.json();
        setUser(data);
      } else {
        try { data = await response.json(); } catch (e) {}
        if (response.status !== 401 && import.meta.env.DEV) {
           console.error('[fetchMe Error]', response.status, data);
        }
        setUser(null);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[fetchMe Exception]', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
