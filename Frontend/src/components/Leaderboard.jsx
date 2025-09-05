// src/components/Leaderboard.jsx
import React from "react";
import useDataSquidGames from "../hooks/useData";

const Leaderboard = ({ onNavigate }) => {
  const {
    equipos,
    jugadores,
    loading
  } = useDataSquidGames();

  const TeamRow = ({ equipo, position }) => {
    return (
      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-brown-600 bg-brown-700 text-white">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold w-8">
            {position}
          </div>
          <div className="w-8 h-8 rounded border-2 border-white overflow-hidden bg-gray-200">
            <img 
              src={equipo.imagen} 
              alt={equipo.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.backgroundColor = '#6b7280';
              }}
            />
          </div>
          <div className="text-lg font-bold">
            {equipo.nombre}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-lg font-bold">
            {equipo.puntuacion}
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded border-2 border-white flex items-center justify-center">
            <span className="text-white text-sm">🏆</span>
          </div>
        </div>
      </div>
    );
  };

  const PlayerRow = ({ jugador, position }) => {
    return (
      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-brown-600 bg-brown-700 text-white">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold w-8">
            {position}
          </div>
          <div className="w-8 h-8 bg-green-600 rounded border-2 border-white flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {jugador.numero.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-lg font-bold">
            Jugador #{jugador.numero}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-lg font-bold">
            {jugador.puntuacion}
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded border-2 border-white flex items-center justify-center">
            <span className="text-white text-sm">🏆</span>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)'
    }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 text-black py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
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
                LEADERBOARD SQUID GAMES
              </h1>
              <p className="text-yellow-200 text-lg font-medium">
                Rankings en Tiempo Real • Día del Programador 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ranking de Equipos */}
          <div className="bg-brown-800 rounded-lg shadow-2xl overflow-hidden border-4 border-brown-600 flex flex-col" style={{ height: '80vh' }}>
            {/* Header del ranking de equipos */}
            <div className="bg-brown-900 px-6 py-4 border-b-4 border-brown-600 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-yellow-400">
                  🏆 RANKING EQUIPOS
                </h2>
                <div className="text-brown-300 font-mono text-sm">
                  {equipos.length} equipos
                </div>
              </div>
            </div>

            {/* Lista de equipos */}
            <div className="flex-1">
              {equipos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl text-brown-400 mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-brown-400 mb-2">No hay equipos registrados</h3>
                  <p className="text-brown-300">¡Sé el primero en registrar un equipo!</p>
                </div>
              ) : (
                equipos.slice(0, 10).map((equipo, index) => (
                  <TeamRow key={equipo._id} equipo={equipo} position={index + 1} />
                ))
              )}
            </div>
          </div>

          {/* Ranking de Jugadores */}
          <div className="bg-brown-800 rounded-lg shadow-2xl overflow-hidden border-4 border-brown-600 flex flex-col" style={{ height: '80vh' }}>
            {/* Header del ranking de jugadores */}
            <div className="bg-brown-900 px-6 py-4 border-b-4 border-brown-600 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-yellow-400">
                  👤 RANKING INDIVIDUAL
                </h2>
                <div className="text-brown-300 font-mono text-sm">
                  {jugadores.length} jugadores
                </div>
              </div>
            </div>

            {/* Lista de jugadores */}
            <div className="flex-1">
              {jugadores.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl text-brown-400 mb-4">👤</div>
                  <h3 className="text-2xl font-bold text-brown-400 mb-2">No hay jugadores registrados</h3>
                  <p className="text-brown-300">¡Los juegos están esperando por ti!</p>
                </div>
              ) : (
                jugadores.slice(0, 10).map((jugador, index) => (
                  <PlayerRow key={jugador._id} jugador={jugador} position={index + 1} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-brown-700 {
          background-color: #8B4513;
        }
        .bg-brown-800 {
          background-color: #654321;
        }
        .bg-brown-900 {
          background-color: #4A2C17;
        }
        .border-brown-600 {
          border-color: #A0522D;
        }
        .text-brown-200 {
          color: #DEB887;
        }
        .text-brown-300 {
          color: #CD853F;
        }
        .text-brown-400 {
          color: #A0522D;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;