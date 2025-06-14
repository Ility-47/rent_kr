import './App.scss';
import Profile from './components/profile/profile';
import Menu from './components/menu/menu';
import Auto from './components/auto/auto';
import Politic from './components/politic/politic';
import Story from './components/story/story';
import Support from './components/support/support';
import Registration from './components/registration/registration';
import AdminLogin from './components/registration/adminLogin';
import AdminPanel from './components/admin/adminPanel';

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation
}
from 'react-router-dom';

// Обёртка для ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/Registration" />;
};

// Компонент App теперь должен быть внутренним, чтобы использовать useLocation
const AppContent = () => {
  const location = useLocation();

  // Страницы, где не нужно показывать меню
  const hideMenuPaths = ['/admin', '/admin/panel'];

  const shouldShowMenu = !hideMenuPaths.includes(location.pathname);

  return (
    <>
      {shouldShowMenu && <Menu />}
      <container>
        <Routes>
          <Route path="/Profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/Auto" element={
            <ProtectedRoute>
              <Auto />
            </ProtectedRoute>
          } />
          <Route path="/Story" element={
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          } />
          <Route path="/Politic" element={
            <ProtectedRoute>
              <Politic />
            </ProtectedRoute>
          } />
          {/* <Route path="/Support" element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } /> */}
          <Route path="/Registration" element={<Registration />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Routes>
      </container>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;