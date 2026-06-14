import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsuario } from '../../services/api';

const UserContext = createContext(null);

const LOCAL_DELTA_KEY = 'carepoints_local_delta';

function getLocalDelta() {
  return parseInt(localStorage.getItem(LOCAL_DELTA_KEY) || '0', 10);
}

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
  const [user, setUser] = useState({ ...DEFAULT_USER, points: DEFAULT_USER.points + getLocalDelta() });

  useEffect(() => {
    fetchUsuario()
      .then((data) => {
        const localDelta = getLocalDelta();
        setUser((prev) => ({
          ...prev,
          streak: data.streak,
          points: data.carepoints + localDelta,
          nivel: data.nivel,
          name: data.nome,
          avatar: data.avatar,
        }));
      })
      .catch(() => {});
  }, []);

  const login = (userData) => {
    setUser({ ...DEFAULT_USER, ...userData, isAuthenticated: true });
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  const updatePoints = (delta) => {
    setUser((prev) => ({ ...prev, points: prev.points + delta }));
    const current = getLocalDelta();
    localStorage.setItem(LOCAL_DELTA_KEY, String(current + delta));
  };

  // Usa saldo vindo do servidor sem alterar o localDelta (evita dupla dedução em resgates)
  const setServerPoints = (serverPoints) => {
    const localDelta = getLocalDelta();
    setUser((prev) => ({ ...prev, points: serverPoints + localDelta }));
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
