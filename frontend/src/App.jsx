import './App.scss'
import Profile from './components/profile/profile'
import Menu from './components/menu/menu'
import Auto from './components/auto/auto'
import Politic from './components/politic/politic'
import Story from './components/story/story'
import Support from './components/support/support'
import {
  BrowserRouter, Route, Routes, Navigate
}
  from 'react-router-dom'
import Registration from './components/registration/registration'

function App() {
  return (

    <BrowserRouter>
      <Menu />
      <container>
        <Routes>
          <Route path="/Profile" element={
            <ProtectedRoute >
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/Auto" element={
            <ProtectedRoute >
              <Auto />
            </ProtectedRoute>
          } />
          <Route path="/Story" element={
            <ProtectedRoute >
              <Story />
            </ProtectedRoute>
          } />
          <Route path="/Politic" element={
            <ProtectedRoute >
              <Politic />
            </ProtectedRoute>
          } />
          <Route path="/Support" element={
            <ProtectedRoute >
              <Support />
            </ProtectedRoute>
          } />
          <Route path="/Registration" element={
              <Registration />
          } />
        </Routes>
      </container>
    </BrowserRouter>

  )
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/Registration" />;
};



export default App
