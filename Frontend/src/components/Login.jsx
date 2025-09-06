import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular verificación con credenciales del backend
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('isAuthenticated', 'true');
        onLogin(true);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Elementos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-red-400 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-32 right-10 w-18 h-18 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Símbolos de código flotantes */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-red-300 opacity-10 animate-pulse font-mono">{"{"}</div>
        <div className="absolute top-3/4 right-1/4 text-6xl text-red-300 opacity-10 animate-pulse font-mono">{"}"}</div>
        <div className="absolute top-1/2 left-1/6 text-4xl text-red-300 opacity-10 animate-bounce font-mono">;</div>
        <div className="absolute top-1/3 right-1/6 text-4xl text-red-300 opacity-10 animate-bounce font-mono">()</div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-full shadow-2xl border-4 border-red-400">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-4 rounded-full shadow-2xl border-4 border-pink-400">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
            SQUID GAMES
          </h1>
          <h2 className="text-2xl font-bold text-red-300 mb-2">×</h2>
          <h3 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DÍA DEL PROGRAMADOR 2025
          </h3>
          
          <div className="mt-6 p-4 bg-black bg-opacity-50 rounded-xl border-2 border-red-500">
            <p className="text-lg text-red-300 font-mono">
              if (authenticated) access(); else deny();
            </p>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="bg-black bg-opacity-70 p-8 rounded-2xl border-4 border-red-500 shadow-2xl">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-black text-red-400 mb-2">
              ACCESO RESTRINGIDO
            </h4>
            <p className="text-white">
              Solo programadores autorizados pueden acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label className="block text-white font-bold mb-2">
                Email del Programador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border-2 border-red-400 rounded-lg text-white focus:border-red-300 focus:outline-none"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo Password */}
            <div>
              <label className="block text-white font-bold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border-2 border-red-400 rounded-lg text-white focus:border-red-300 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-3">
                <p className="text-red-300 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-lg font-black text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>VERIFICANDO...</span>
                </div>
              ) : (
                'ACCEDER AL SISTEMA'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full border border-red-500">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-red-300 font-mono text-sm">
                Sistema seguro • Acceso autorizado únicamente
              </p>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de partículas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;