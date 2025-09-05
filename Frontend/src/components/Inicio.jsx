import React, { useState, useEffect } from "react";

const Inicio = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const [stats, setStats] = useState({
    equipos: 0,
    jugadores: 0,
    juegosActivos: 12
  });

  const codeTexts = [
    "console.log('¡Bienvenido al Día del Programador!');",
    "if (survival === true) { win(); }",
    "while (alive) { compete(); }",
    "function survive() { return courage > fear; }"
  ];

  // Cargar estadísticas reales desde tu backend
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
        // Mantener valores por defecto en caso de error
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
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 border-8 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">💻</span>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-red-500 animate-pulse">
              CARGANDO SISTEMA...
            </h1>
            <p className="text-white font-mono text-lg">
              {codeTexts[currentText]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black text-white overflow-hidden relative">
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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 h-screen flex flex-col">
        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 sm:p-4 rounded-full shadow-2xl border-2 sm:border-4 border-red-400">
              <span className="text-2xl sm:text-4xl">👨‍💻</span>
            </div>
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-2 sm:p-4 rounded-full shadow-2xl border-2 sm:border-4 border-pink-400">
              <span className="text-2xl sm:text-4xl">🎮</span>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 sm:p-4 rounded-full shadow-2xl border-2 sm:border-4 border-red-400">
              <span className="text-2xl sm:text-4xl">📺</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-2 sm:mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
            SQUID GAMES
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-red-300 mb-1 sm:mb-2">×</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DÍA DEL PROGRAMADOR
          </h3>
          
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black bg-opacity-50 rounded-xl border-2 border-red-500 inline-block mx-2">
            <p className="text-base sm:text-xl text-red-300 font-mono animate-pulse">
              {codeTexts[currentText]}
            </p>
          </div>
        </div>

        {/* Sección principal */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl w-full px-4">
            {/* Mensaje principal */}
            <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6">
              <div className="bg-black bg-opacity-70 p-4 sm:p-8 rounded-2xl border-2 sm:border-4 border-red-500 shadow-2xl">
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-red-400">
                  🚨 ATENCIÓN PROGRAMADORES 🚨
                </h4>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed">
                  Has sido seleccionado para participar en los juegos más desafiantes del mundo tech.
                  <br className="hidden sm:block" />
                  <span className="text-red-300 font-bold block sm:inline">
                    Solo los mejores desarrolladores sobrevivirán.
                  </span>
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-mono text-sm sm:text-base">Status: ONLINE</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="font-mono text-sm sm:text-base">Equipos: {stats.equipos}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="font-mono text-sm sm:text-base">Jugadores: {stats.jugadores}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de navegación - Solo 2 botones ahora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <button
                onClick={() => onNavigate('leaderboard')}
                className="group bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 p-6 sm:p-8 rounded-2xl border-2 sm:border-4 border-yellow-400 shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="text-4xl sm:text-6xl group-hover:animate-bounce">🏆</div>
                  <h5 className="text-xl sm:text-2xl font-black text-black">LEADERBOARD</h5>
                  <p className="text-yellow-900 font-bold text-sm sm:text-base">
                    Rankings en tiempo real
                  </p>
                  <div className="bg-black bg-opacity-20 p-2 rounded-lg">
                    <code className="text-yellow-200 text-xs sm:text-sm">
                      SELECT TOP FROM developers
                    </code>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 p-6 sm:p-8 rounded-2xl border-2 sm:border-4 border-red-400 shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="text-4xl sm:text-6xl group-hover:animate-spin">⚙️</div>
                  <h5 className="text-xl sm:text-2xl font-black text-white">JUEGOS</h5>
                  <p className="text-red-200 font-bold text-sm sm:text-base">
                    {stats.juegosActivos} desafíos letales
                  </p>
                  <div className="bg-black bg-opacity-30 p-2 rounded-lg">
                    <code className="text-red-200 text-xs sm:text-sm">
                      while(alive) compete()
                    </code>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="inline-flex items-center space-x-2 sm:space-x-4 bg-black bg-opacity-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-500">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <p className="text-red-300 font-mono text-xs sm:text-sm">
              Sistema inicializado • {stats.equipos} equipos • {stats.jugadores} programadores listos
            </p>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          
          <div className="mt-2 sm:mt-4 flex justify-center space-x-4 sm:space-x-8 text-xs text-gray-400">
            <span>📺 = Eliminación</span>
            <span>⬜ = Supervivencia</span>
            <span>🔴 = Peligro</span>
            <span>💻 = Programador</span>
          </div>
        </div>
      </div>

      {/* Efecto de partículas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

export default Inicio;