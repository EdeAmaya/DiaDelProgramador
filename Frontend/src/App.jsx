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
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-4xl font-black text-purple-500">INICIANDO SISTEMA...</h1>
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