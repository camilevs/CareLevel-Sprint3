import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsuario } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserContext = createContext(null);

const DEFAULT_USER = {
  id: null,
  name: 'Visitante',
  streak: 5,
  points: 1490,
  nivel: null,
  avatar: null,
  isAuthenticated: false,
};

export function UserProvider({ children }) {
  const { token } = useAuth();
  const [user, setUser] = useState(DEFAULT_USER);

  useEffect(() => {
    if (!token) {
      setUser(DEFAULT_USER);
      return;
    }

    fetchUsuario()
      .then((data) => {
        setUser((prev) => ({
          ...prev,
          streak: data.streak,
          points: data.carepoints,
          nivel: data.nivel,
          name: data.nome,
          avatar: data.avatar,
          isAuthenticated: true,
        }));
      })
      .catch(() => {});
  }, [token]);

  const login = (userData) => {
    setUser({ ...DEFAULT_USER, ...userData, isAuthenticated: true });
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  const updatePoints = (delta) => {
    setUser((prev) => ({ ...prev, points: prev.points + delta }));
  };

  const setServerPoints = (serverPoints) => {
    setUser((prev) => ({ ...prev, points: serverPoints }));
  };

  const updateStreak = (streak) => {
    setUser((prev) => ({ ...prev, streak }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updatePoints, setServerPoints, updateStreak }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de <UserProvider>');
  }
  return context;
}
