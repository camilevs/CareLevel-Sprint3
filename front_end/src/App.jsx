import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './Components/UserContext/UserContext';
import RoleGuard from './Components/RoleGuard.jsx';
import Login from './pages/HomePage/Login.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import AdminHome from './pages/HomePage/AdminHome.jsx';
import Unauthorized from './pages/HomePage/Unauthorized.jsx';
import PerfilBeneficiario from './pages/HomePage/PerfilBeneficiario.jsx';
import CareMoodPage from './pages/CareMood/CareMoodPage.jsx';
import JornadaPage from './pages/Jornada/JornadaPage.jsx';
import RecompensasPage from './pages/Recompensas/RecompensasPage.jsx';
import CarePoints from './pages/CarePoints/CarePoints.jsx';
import CarePointsHistorico from './pages/CarePoints/CarePointsHistorico.jsx';

/* Legacy pages – still accessible via direct URL */
import MissoesPage from './pages/Missoes/MissoesPage.jsx';
import RankingPage from './pages/Ranking/RankingPage.jsx';
import Conquistas from './pages/Conquistas/Conquistas.jsx';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/admin/home"
            element={<RoleGuard role="admin"><AdminHome /></RoleGuard>}
          />
          <Route
            path="/home"
            element={<RoleGuard role="user"><HomePage /></RoleGuard>}
          />
          <Route
            path="/perfil"
            element={<RoleGuard role="user"><PerfilBeneficiario /></RoleGuard>}
          />
          <Route
            path="/caremood"
            element={<RoleGuard role="user"><CareMoodPage /></RoleGuard>}
          />
          <Route
            path="/jornada"
            element={<RoleGuard role="user"><JornadaPage /></RoleGuard>}
          />
          <Route
            path="/recompensas"
            element={<RoleGuard role="user"><RecompensasPage /></RoleGuard>}
          />
          <Route
            path="/carepoints"
            element={<RoleGuard role="user"><CarePoints /></RoleGuard>}
          />
          <Route
            path="/carepoints/historico"
            element={<RoleGuard role="user"><CarePointsHistorico /></RoleGuard>}
          />

          {/* Legacy routes preserved */}
          <Route
            path="/missoes"
            element={<RoleGuard role="user"><MissoesPage /></RoleGuard>}
          />
          <Route
            path="/ranking"
            element={<RoleGuard role="user"><RankingPage /></RoleGuard>}
          />
          <Route
            path="/conquistas"
            element={<RoleGuard role="user"><Conquistas /></RoleGuard>}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}
