// src/components/SquidGames/Leaderboard.jsx
import React from "react";
import useDataSquidGames from "../hooks/useData";

const Leaderboard = ({ onNavigate }) => {
  const {
    equipos,
    jugadores,
    loading,
    lastUpdate
  } = useDataSquidGames();

  const [activeTab, setActiveTab] = React.useState("equipos");

  const getRankIcon = (position) => {
    switch(position) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "💻";
    }
  };

  const getRankBadge = (position) => {
    switch(position) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case 3: return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100";
      default: return "bg-gradient-to-r from-red-600 to-red-800 text-white";
    }
  };

  const TeamCard = ({ equipo, position }) => (
    <div className={`${getRankBadge(position)} p-6 rounded-2xl border-4 ${position <= 3 ? 'border-yellow-400 shadow-2xl' : 'border-red-400 shadow-lg'} transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
      {/* Efecto de brillo para top 3 */}
      {position <= 3 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
      )}
      
      <div className="relative z-10 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="text-6xl">{getRankIcon(position)}</div>
          <div className="text-center mt-2">
            <span className="text-2xl font-black">#{position}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl">{equipo.imagen}</span>
            <h3 className="text-2xl font-black">{equipo.nombre}</h3>
          </div>
          <div className="text-3xl font-black">
            {equipo.puntuacion.toLocaleString()} pts
          </div>
          <div className="text-sm opacity-75 font-mono">
            Team Status: ACTIVE
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold opacity-75">
            EQUIPO
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );

  const PlayerCard = ({ jugador, position }) => (
    <div className={`${getRankBadge(position)} p-6 rounded-2xl border-4 ${position <= 3 ? 'border-yellow-400 shadow-2xl' : 'border-red-400 shadow-lg'} transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
      {/* Efecto de brillo para top 3 */}
      {position <= 3 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
      )}
      
      <div className="relative z-10 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="text-6xl">{getRankIcon(position)}</div>
          <div className="text-center mt-2">
            <span className="text-2xl font-black">#{position}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">{jugador.equipo?.imagen || "👤"}</span>
            <div>
              <h3 className="text-xl font-black">Jugador #{jugador.numero.toString().padStart(3, '0')}</h3>
              <p className="text-sm opacity-75">{jugador.equipo?.nombre || 'Sin equipo'}</p>
            </div>
          </div>
          <div className="text-3xl font-black">
            {jugador.puntuacion.toLocaleString()} pts
          </div>
          <div className="text-sm opacity-75 font-mono">
            Individual Score
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold opacity-75">
            PLAYER
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-yellow-500 animate-pulse">
              ACTUALIZANDO RANKINGS...
            </h1>
            <p className="text-white font-mono text-lg">
              Calculando puntuaciones en tiempo real
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 text-black py-8 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('inicio')}
                className="bg-black text-yellow-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <span className="text-2xl">←</span>
              </button>
              <div className="bg-black text-yellow-500 p-4 rounded-full shadow-lg">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-wide">
                  LEADERBOARD
                </h1>
                <p className="text-yellow-200 text-lg font-medium">
                  Rankings en Tiempo Real • Squid Games x Día del Programador
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-mono">LIVE</span>
              </div>
              <p className="text-yellow-200 font-mono text-sm">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Pestañas */}
        <div className="bg-black bg-opacity-50 rounded-2xl border-4 border-red-500 mb-8">
          <div className="flex">
            <button
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all duration-300 relative rounded-l-xl ${
                activeTab === "equipos"
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-black shadow-lg"
                  : "text-yellow-400 hover:bg-red-600 hover:bg-opacity-50"
              }`}
              onClick={() => setActiveTab("equipos")}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">🥇</span>
                <span>RANKING EQUIPOS</span>
                <span className="bg-black bg-opacity-30 px-2 py-1 rounded-full text-sm">
                  {equipos.length}
                </span>
              </div>
            </button>
            
            <button
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all duration-300 relative rounded-r-xl ${
                activeTab === "jugadores"
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-black shadow-lg"
                  : "text-yellow-400 hover:bg-red-600 hover:bg-opacity-50"
              }`}
              onClick={() => setActiveTab("jugadores")}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">👤</span>
                <span>RANKING INDIVIDUAL</span>
                <span className="bg-black bg-opacity-30 px-2 py-1 rounded-full text-sm">
                  {jugadores.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Contenido */}
        {activeTab === "equipos" && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-yellow-400 mb-2">
                🏆 RANKING DE EQUIPOS 🏆
              </h2>
              <p className="text-red-300 font-mono">
                Puntuación acumulada por equipos de desarrollo
              </p>
            </div>
            
            {equipos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl text-red-400 mb-4">📊</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">No hay equipos registrados</h3>
                <p className="text-red-300">¡Sé el primero en registrar un equipo!</p>
              </div>
            ) : (
              equipos.map((equipo, index) => (
                <TeamCard key={equipo._id} equipo={equipo} position={index + 1} />
              ))
            )}
          </div>
        )}

        {activeTab === "jugadores" && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-yellow-400 mb-2">
                👑 RANKING INDIVIDUAL 👑
              </h2>
              <p className="text-red-300 font-mono">
                Los mejores programadores individuales
              </p>
            </div>
            
            {jugadores.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl text-red-400 mb-4">👤</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">No hay jugadores registrados</h3>
                <p className="text-red-300">¡Los juegos están esperando por ti!</p>
              </div>
            ) : (
              jugadores.map((jugador, index) => (
                <PlayerCard key={jugador._id} jugador={jugador} position={index + 1} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-black bg-opacity-50 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl text-green-400">👥</div>
              <div className="text-2xl font-black text-white">{jugadores.length}</div>
              <div className="text-red-300 font-mono text-sm">Programadores</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-red-400">🎯</div>
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-red-300 font-mono text-sm">Desafíos Activos</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-purple-400">🔥</div>
              <div className="text-2xl font-black text-white">
                {equipos[0]?.puntuacion?.toLocaleString() || "0"}
              </div>
              <div className="text-red-300 font-mono text-sm">Puntuación Máxima</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-4 bg-red-900 bg-opacity-50 px-6 py-3 rounded-full border border-red-500">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-red-300 font-mono text-sm">
                Sistema de ranking en tiempo real • Actualización automática cada 5 segundos
              </p>
              <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Partículas de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;