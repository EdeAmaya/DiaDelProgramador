// src/components/SquidGames/GameSelector.jsx
import React, { useState, useEffect } from "react";

const GameSelector = ({ onNavigate }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({
    equipos: 0,
    jugadores: 0,
    totalParticipantes: 0
  });

  // Lista de los 12 juegos reales del Día del Programador
  const games = [
    {
      id: 1,
      name: "Luz Roja, Luz Verde",
      subtitle: "Red Light, Green Light",
      description: "Detén tu código cuando aparezca la luz roja",
      difficulty: "NOVATO",
      icon: "🚦",
      color: "from-green-600 to-green-800",
      borderColor: "border-green-400",
      codeSnippet: "while(moving) { if(redLight) break; }",
      status: "ACTIVO"
    },
    {
      id: 2,
      name: "Los verdaderos Botón rojo",
      subtitle: "The Real Red Button",
      description: "¿Te atreves a presionar el botón rojo?",
      difficulty: "FÁCIL",
      icon: "🔴",
      color: "from-red-600 to-red-800",
      borderColor: "border-red-400",
      codeSnippet: "if(courage) pressRedButton();",
      status: "ACTIVO"
    },
    {
      id: 3,
      name: "Figmanary",
      subtitle: "Design Pictionary",
      description: "Adivina los diseños de Figma en tiempo récord",
      difficulty: "MEDIO",
      icon: "🎨",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-400",
      codeSnippet: "design.guess(figma.prototype);",
      status: "ACTIVO"
    },
    {
      id: 4,
      name: "BUGGLEE",
      subtitle: "Bug Hunter Challenge",
      description: "Encuentra y elimina todos los bugs ocultos",
      difficulty: "MEDIO",
      icon: "🐛",
      color: "from-orange-600 to-orange-800",
      borderColor: "border-orange-400",
      codeSnippet: "debug.findAll().eliminate();",
      status: "ACTIVO"
    },
    {
      id: 5,
      name: "Salta cuerda",
      subtitle: "Jump Rope Challenge",
      description: "Salta obstáculos de código sin tropezar",
      difficulty: "DIFÍCIL",
      icon: "🤸",
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-400",
      codeSnippet: "while(jumping) avoid(obstacles);",
      status: "ACTIVO"
    },
    {
      id: 6,
      name: "Equis cero gigante en equipos",
      subtitle: "Giant Team Tic-Tac-Toe",
      description: "Tic-tac-toe estratégico con equipos completos",
      difficulty: "EXTREMO",
      icon: "⭕",
      color: "from-cyan-600 to-cyan-800",
      borderColor: "border-cyan-400",
      codeSnippet: "team.strategy(X, O).win();",
      status: "ACTIVO"
    },
    {
      id: 7,
      name: "Trabalenguas",
      subtitle: "Tongue Twisters",
      description: "Pronuncia correctamente los trabalenguas tech",
      difficulty: "DIFÍCIL",
      icon: "👅",
      color: "from-pink-600 to-pink-800",
      borderColor: "border-pink-400",
      codeSnippet: "speech.pronounce(tonguetwister);",
      status: "ACTIVO"
    },
    {
      id: 8,
      name: "Decisión no inteligente",
      subtitle: "Bad Decision Simulator",
      description: "Toma las peores decisiones de desarrollo posibles",
      difficulty: "MEDIO",
      icon: "🤔",
      color: "from-gray-600 to-gray-800",
      borderColor: "border-gray-400",
      codeSnippet: "if(badIdea) implement(anyway);",
      status: "ACTIVO"
    },
    {
      id: 9,
      name: "Teléfono Descompuesto",
      subtitle: "Broken Telephone",
      description: "Transmite el mensaje de código sin errores",
      difficulty: "DIFÍCIL",
      icon: "📞",
      color: "from-indigo-600 to-indigo-800",
      borderColor: "border-indigo-400",
      codeSnippet: "message.transmit().withoutErrors();",
      status: "ACTIVO"
    },
    {
      id: 10,
      name: "Campo minado",
      subtitle: "Minesweeper Hell",
      description: "Navega el campo minado de código legacy",
      difficulty: "EXTREMO",
      icon: "💣",
      color: "from-red-800 to-black",
      borderColor: "border-red-500",
      codeSnippet: "navigate(minefield).carefully();",
      status: "ACTIVO"
    },
    {
      id: 11,
      name: "Pasa la bola",
      subtitle: "Pass the Ball",
      description: "Pasa el código sin que explote en tus manos",
      difficulty: "EXTREMO",
      icon: "⚽",
      color: "from-green-600 to-green-800",
      borderColor: "border-green-400",
      codeSnippet: "code.pass().before(explosion);",
      status: "ACTIVO"
    },
    {
      id: 12,
      name: "Adivina el lenguaje",
      subtitle: "Guess the Language",
      description: "Identifica el lenguaje de programación en segundos",
      difficulty: "LEGENDARY",
      icon: "🔤",
      color: "from-yellow-600 to-yellow-800",
      borderColor: "border-yellow-400",
      codeSnippet: "identify(language).inSeconds(3);",
      status: "ACTIVO"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "NOVATO": return "text-green-400 bg-green-900";
      case "FÁCIL": return "text-yellow-400 bg-yellow-900";
      case "MEDIO": return "text-blue-400 bg-blue-900";
      case "DIFÍCIL": return "text-orange-400 bg-orange-900";
      case "EXTREMO": return "text-red-400 bg-red-900";
      case "LEGENDARY": return "text-purple-400 bg-purple-900";
      default: return "text-gray-400 bg-gray-900";
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setIsAnimating(true);
    
    setTimeout(() => {
      alert(`🎮 INICIANDO JUEGO 🎮\n\n${game.name}\n\nDescripción: ${game.description}\nDificultad: ${game.difficulty}\n\n¡Prepárate para el desafío!`);
      setIsAnimating(false);
      setSelectedGame(null);
    }, 2000);
  };

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
            totalParticipantes: equiposData.length + jugadoresData.length
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    
    // Actualización en tiempo real cada 10 segundos
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 text-white relative overflow-hidden">
      {/* Elementos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl text-red-300 opacity-20 animate-bounce font-mono">{"<>"}</div>
        <div className="absolute top-20 right-20 text-3xl text-green-300 opacity-20 animate-pulse font-mono">function()</div>
        <div className="absolute bottom-20 left-20 text-5xl text-blue-300 opacity-20 animate-spin font-mono slow-spin">{"{}"}</div>
        <div className="absolute bottom-10 right-10 text-3xl text-yellow-300 opacity-20 animate-bounce font-mono delay-1000">[]</div>
        <div className="absolute top-1/2 left-1/4 text-2xl text-purple-300 opacity-20 animate-pulse font-mono">while(true)</div>
        <div className="absolute top-1/3 right-1/3 text-2xl text-cyan-300 opacity-20 animate-bounce font-mono delay-500">if/else</div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-8 shadow-2xl border-b-4 border-red-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => onNavigate('inicio')}
                className="bg-black text-red-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <span className="text-2xl">←</span>
              </button>
              <div className="bg-black text-red-500 p-4 rounded-full shadow-lg border-4 border-red-400">
                <span className="text-3xl">🎮</span>
              </div>
              <div className="bg-black text-yellow-500 p-4 rounded-full shadow-lg border-4 border-yellow-400">
                <span className="text-3xl">💻</span>
              </div>
              <div className="bg-black text-green-500 p-4 rounded-full shadow-lg border-4 border-green-400">
                <span className="text-3xl">⚔️</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-400 via-yellow-500 to-green-400 bg-clip-text text-transparent drop-shadow-2xl">
              SELECCIÓN DE JUEGOS
            </h1>
            <p className="text-2xl text-red-200 font-bold mb-2">
              12 Desafíos del Día del Programador
            </p>
            <div className="inline-block bg-black bg-opacity-50 px-6 py-2 rounded-full border-2 border-red-500">
              <p className="text-red-300 font-mono">
                ⚠️ {stats.totalParticipantes} programadores registrados • {stats.equipos} equipos activos ⚠️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de juegos */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`group bg-gradient-to-br ${game.color} p-6 rounded-2xl border-4 ${game.borderColor} shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer relative overflow-hidden ${
                selectedGame?.id === game.id ? 'animate-pulse ring-4 ring-yellow-400' : ''
              }`}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => handleGameSelect(game)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-opacity duration-500"></div>
              
              {/* Contenido de la carta */}
              <div className="relative z-10 space-y-4">
                {/* Header de la carta */}
                <div className="flex items-center justify-between">
                  <div className="text-5xl group-hover:animate-bounce">{game.icon}</div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">#{game.id.toString().padStart(2, '0')}</div>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-yellow-300 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-bold">
                    {game.subtitle}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-white text-sm leading-relaxed">
                  {game.description}
                </p>

                {/* Código de ejemplo */}
                <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-600">
                  <code className="text-green-400 text-xs font-mono">
                    {game.codeSnippet}
                  </code>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-300">{game.status}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>🎯</span>
                    <span className="font-bold">LISTO</span>
                  </div>
                </div>

                {/* Botón de acción (aparece al hover) */}
                {hoveredGame === game.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-2xl transition-all duration-300">
                    <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-black text-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-400">
                      🎮 INICIAR JUEGO
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de carga */}
      {isAnimating && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 border-8 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{selectedGame.icon}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-red-500">
                INICIANDO {selectedGame.name.toUpperCase()}
              </h2>
              <p className="text-xl text-white font-mono">
                Preparando entorno de desarrollo...
              </p>
              <div className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-red-500">
                <code className="text-green-400 font-mono">
                  {selectedGame.codeSnippet}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas globales con datos reales */}
      <div className="relative z-10 bg-black bg-opacity-50 mt-12 py-8 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <div className="text-4xl text-red-400">🎯</div>
              <div className="text-3xl font-black text-white">{games.length}</div>
              <div className="text-red-300 font-mono text-sm">Juegos Disponibles</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl text-yellow-400">👥</div>
              <div className="text-3xl font-black text-white">{stats.jugadores}</div>
              <div className="text-red-300 font-mono text-sm">Programadores</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl text-green-400">⚡</div>
              <div className="text-3xl font-black text-white">{stats.equipos}</div>
              <div className="text-red-300 font-mono text-sm">Equipos Activos</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl text-purple-400">🔥</div>
              <div className="text-3xl font-black text-white">{stats.totalParticipantes}</div>
              <div className="text-red-300 font-mono text-sm">Total Participantes</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-4 bg-red-900 bg-opacity-50 px-8 py-4 rounded-full border-2 border-red-500">
              <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-red-300 font-mono text-lg font-bold">
                SISTEMA OPERATIVO • TODOS LOS JUEGOS DISPONIBLES • DÍA DEL PROGRAMADOR 2024
              </p>
              <span className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con navegación */}
      <div className="relative z-10 bg-gradient-to-r from-black via-red-900 to-black py-8 mt-12 border-t-4 border-red-500">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <button
              onClick={() => onNavigate('inicio')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-gray-400"
            >
              ← VOLVER AL INICIO
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('leaderboard')}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-6 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-yellow-400"
              >
                🏆 RANKINGS
              </button>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm font-mono">
              Squid Games × Día del Programador 2024 • Desarrollado por programadores supervivientes
            </p>
          </div>
        </div>
      </div>

      {/* Efectos de partículas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-ping ${
              i % 4 === 0 ? 'w-1 h-1 bg-red-400' :
              i % 4 === 1 ? 'w-2 h-2 bg-yellow-400' :
              i % 4 === 2 ? 'w-1 h-1 bg-green-400' :
              'w-1 h-1 bg-blue-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .slow-spin {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
};

export default GameSelector;