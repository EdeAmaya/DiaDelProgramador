import React, { useState, useEffect } from "react";
import { ArrowUpRight, Trophy, Play } from 'lucide-react';

const Inicio = ({ onNavigate, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const [stats, setStats] = useState({
    equipos: 0,
    jugadores: 0,
    juegosActivos: 12
  });

  const codeTexts = [
    "while(players.length > 1) { eliminate(); }",
    "if(survival === true) { return victory; }",
    "SQUID_GAMES × DIA_DEL_PROGRAMADOR_2025"
  ];

  const loadingTexts = [
    "CONEXION_ESTABLECIDA",
    "SISTEMA_INICIANDO"
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [equiposRes, jugadoresRes] = await Promise.all([
          fetch('http://localhost:4000/api/equipos'),
          fetch('http://localhost:4000/api/jugadores')
        ]);
        
        if (equiposRes.ok && jugadoresRes.ok) {
          const equiposData = await equiposRes.json();
          const jugadoresData = await jugadoresRes.json();
          
          setStats({
            equipos: equiposData.length,
            jugadores: jugadoresData.length,
            juegosActivos: 12
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const timer = setTimeout(() => setIsLoading(false), 3000);
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % codeTexts.length);
    }, 2000);

    fetchStats();

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Logo CODER en estilo pixelado verde */}
          <div className="mb-12">
            <div className="text-green-400 font-mono text-8xl tracking-widest font-black">
              CODER
            </div>
          </div>

          {/* Texto de estado alternante */}
          <div className="text-orange-400 text-xl font-mono tracking-wider">
            {loadingTexts[Math.floor(Date.now() / 2000) % loadingTexts.length]}
          </div>

          {/* Barra de progreso con cuadrados */}
          <div className="flex space-x-1 justify-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 border border-gray-600 ${
                  i < (Date.now() / 100) % 10 ? 'bg-green-400' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Código de ejemplo */}
          <div className="text-green-400 font-mono text-sm mt-8">
            <div>while(players.length &gt; 1) &#123; eliminate(); &#125;</div>
          </div>

          {/* Footer */}
          <div className="text-green-400 font-mono text-sm mt-12">
            SQUID_GAMES × DIA_DEL_PROGRAMADOR_2025
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con diseño exacto de la imagen */}
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
          
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              if (onLogout) onLogout();
              window.location.reload();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">EXIT</span>
          </button>
        </div>
      </header>

      {/* Variable de supervivencia */}
      <div className="px-6 py-2 bg-gray-900 border-b border-gray-700">
        <p className="text-gray-400 font-mono text-sm">
          <span className="text-green-400">$</span> survival: <span className="text-blue-400">true</span>
        </p>
      </div>

      {/* Contenido principal */}
      <main className="px-6 py-12">
        {/* Iconos geométricos centrales */}
        <div className="flex items-center justify-center space-x-8 mb-16">
          {/* Icono diamante rosa */}
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 transform rotate-45 rounded-lg flex items-center justify-center shadow-lg">
            <div className="transform -rotate-45">
              <div className="text-white text-xl font-bold">&lt;/&gt;</div>
            </div>
          </div>
          
          {/* Icono círculo verde */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Icono triángulo azul */}
          <div className="relative">
            <div className="w-0 h-0 border-l-10 border-r-10 border-b-17 border-l-transparent border-r-transparent border-b-blue-500" 
                 style={{
                   borderLeftWidth: '40px',
                   borderRightWidth: '40px', 
                   borderBottomWidth: '70px',
                   filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                 }}>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
              <div className="text-white text-lg font-bold">⚡</div>
            </div>
          </div>
        </div>

        {/* Títulos principales */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4">
            <span className="text-pink-500">SQUID</span>
            <br />
            <span className="text-green-500">GAMES</span>
          </h1>
          <div className="text-white text-3xl font-bold mb-8">×</div>
          <h2 className="text-4xl font-black text-purple-500 mb-8">
            DÍA DEL PROGRAMADOR
          </h2>
        </div>

        {/* Terminal section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            {/* Terminal header */}
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm font-mono ml-4">terminal.js</span>
              </div>
            </div>
            
            {/* Terminal content */}
            <div className="p-6 font-mono text-sm">
              <div className="text-green-400 mb-2">
                <span className="text-gray-500">$</span> node squid_games.js --mode survival
              </div>
              <div className="text-gray-400 mb-2">
                // Solo los mejores desarrolladores sobrevivirán
              </div>
              <div className="text-yellow-400 mb-4">
                <span className="text-gray-500">&gt;</span> Iniciando competencia letal para programadores...
              </div>
              
              {/* Código de ejemplo del terminal */}
              <div className="text-white space-y-1">
                <div>console.log('game_start');</div>
                <div className="text-gray-400 text-right mt-4">
                  {codeTexts[currentText]}
                </div>
                <div className="text-right text-sm text-gray-500 mt-4">
                  SQUID_GAMES × DIA_DEL_PROGRAMADOR_2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer con botones - Agregamos JUEGOS aquí */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-yellow-600 p-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Botón JUEGOS */}
          <button
            onClick={() => onNavigate('games')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black text-xl py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
          >
            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span>JUEGOS</span>
          </button>

          {/* Botón LEADERBOARD */}
          <button
            onClick={() => onNavigate('leaderboard')}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-black text-xl py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
          >
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span>LEADERBOARD</span>
          </button>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-orange-100 font-mono text-sm">
            {stats.juegosActivos} desafíos disponibles • Rankings en tiempo real
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;