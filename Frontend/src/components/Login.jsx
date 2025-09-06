import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header similar al diseño principal */}
      <header className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-800 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">SQUID_GAMES.exe</h1>
              <p className="text-pink-200 text-xs font-mono">v2025.programmer_day</p>
            </div>
          </div>
          
          <div className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">ACCESS_REQUIRED</span>
          </div>
        </div>
      </header>

      {/* Variable de estado */}
      <div className="px-6 py-2 bg-gray-900 border-b border-gray-700">
        <p className="text-gray-400 font-mono text-sm">
          <span className="text-green-400">$</span> authenticated: <span className="text-red-400">false</span>
        </p>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Iconos geométricos */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            {/* Icono diamante rosa */}
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 transform rotate-45 rounded-lg flex items-center justify-center shadow-lg">
              <div className="transform -rotate-45">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Icono círculo verde */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Icono triángulo azul */}
            <div className="relative">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-14 border-l-transparent border-r-transparent border-b-blue-500" 
                   style={{
                     borderLeftWidth: '32px',
                     borderRightWidth: '32px', 
                     borderBottomWidth: '56px',
                     filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                   }}>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                <div className="text-white text-sm font-bold">⚡</div>
              </div>
            </div>
          </div>

          {/* Títulos */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2">
              <span className="text-pink-500">SQUID</span> <span className="text-green-500">GAMES</span>
            </h1>
            <div className="text-white text-2xl font-bold mb-4">×</div>
            <h2 className="text-2xl font-black text-purple-500 mb-6">
              DÍA DEL PROGRAMADOR
            </h2>
            <div className="text-red-400 font-mono text-lg">
              ACCESO RESTRINGIDO
            </div>
          </div>

          {/* Formulario de Login */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            {/* Header del formulario */}
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm font-mono ml-4">auth_login.js</span>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">
                    // Email del programador
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-600 rounded px-4 py-3 text-white font-mono focus:border-green-400 focus:outline-none"
                      placeholder="usuario@empresa.com"
                      required
                    />
                  </div>
                </div>

                {/* Campo Password */}
                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">
                    // Contraseña de acceso
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-600 rounded px-4 py-3 text-white font-mono focus:border-green-400 focus:outline-none pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/50 border border-red-500 rounded p-3">
                    <p className="text-red-300 font-mono text-sm">ERROR: {error}</p>
                  </div>
                )}

                {/* Botón de Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded font-mono font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>AUTENTICANDO...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      <span>ACCEDER AL SISTEMA</span>
                    </>
                  )}
                </button>
              </form>

              {/* Código de ejemplo */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-gray-400 font-mono text-xs">
                  <div className="text-green-400">if(credentials.valid) &#123;</div>
                  <div className="ml-4 text-white">grantAccess();</div>
                  <div className="text-green-400">&#125;</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 font-mono text-sm">
              Solo programadores autorizados • Sistema seguro
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;