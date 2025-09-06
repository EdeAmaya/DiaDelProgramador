import React, { useState, useEffect } from 'react'
import SquidGames from './components/Pages.jsx'
import Login from './components/Login.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const authStatus = localStorage.getItem('isAuthenticated');
    
    // Solo establecer como autenticado si existe el valor y es exactamente 'true'
    // Pero también verificamos que sea una sesión válida reciente
    if (authStatus === 'true') {
      // Opcional: Verificar si la sesión no ha expirado
      const loginTime = localStorage.getItem('loginTime');
      const currentTime = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      
      if (loginTime && (currentTime - parseInt(loginTime)) < sessionDuration) {
        setIsAuthenticated(true);
      } else {
        // Sesión expirada, limpiar localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loginTime');
        setIsAuthenticated(false);
      }
    } else {
      // No hay sesión válida
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      // Guardar tiempo de login para control de sesión
      localStorage.setItem('loginTime', new Date().getTime().toString());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 border-8 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-4xl font-black text-green-500">SISTEMA_INICIANDO...</h1>
          <p className="text-white font-mono mt-4">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path='/' 
          element={
            isAuthenticated ? (
              <SquidGames onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
      </Routes>
    </Router>
  )
}

export default App