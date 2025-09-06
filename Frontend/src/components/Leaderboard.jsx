import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trophy, User, Users } from 'lucide-react';

const Leaderboard = ({ onNavigate }) => {
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const intervalRef = useRef(null);

  const getRankColor = (position) => {
    switch(position) {
      case 1: return "border-yellow-500 bg-yellow-500/10";
      case 2: return "border-gray-400 bg-gray-400/10";
      case 3: return "border-orange-500 bg-orange-500/10";
      default: return "border-gray-600 bg-gray-800/50";
    }
  };

  const TeamRow = ({ equipo, position }) => {
    return (
      <div className={`flex items-center justify-between p-3 rounded border backdrop-blur-sm transition-all hover:scale-102 ${getRankColor(position)}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-lg">
            #{position}
          </div>
          
          <div className="w-8 h-8 rounded border-2 border-white/30 overflow-hidden bg-gray-600 flex-shrink-0">
            <img 
              src={equipo.imagen} 
              alt={equipo.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gray-600 flex items-center justify-center"><span class="text-white text-xs font-bold">${equipo.nombre.charAt(0)}</span></div>`;
              }}
            />
          </div>
          
          <div>
            <h3 className="text-white font-bold text-base">{equipo.nombre}</h3>
            <p className="text-gray-400 text-xs font-mono">team_id: {equipo._id.slice(-6)}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-black text-white font-mono">{equipo.puntuacion}</div>
          <div className="text-xs text-gray-400 font-mono">pts</div>
        </div>
      </div>
    );
  };

  const PlayerRow = ({ jugador, position }) => {
    return (
      <div className={`flex items-center justify-between p-3 rounded border backdrop-blur-sm transition-all hover:scale-102 ${getRankColor(position)}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-lg">
            #{position}
          </div>
          
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded border-2 border-white/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">
              {jugador.numero.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-base font-mono">Player #{jugador.numero}</h3>
            <p className="text-gray-400 text-xs font-mono">
              {jugador.equipo?.nombre || 'Sin equipo'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-black text-white font-mono">{jugador.puntuacion}</div>
          <div className="text-xs text-gray-400 font-mono">pts</div>
        </div>
      </div>
    );
  };

  const fetchData = async () => {
    try {
      const [equiposRes, jugadoresRes] = await Promise.all([
        fetch('http://localhost:4000/api/equipos'),
        fetch('http://localhost:4000/api/jugadores')
      ]);
      
      if (equiposRes.ok && jugadoresRes.ok) {
        const equiposData = await equiposRes.json();
        const jugadoresData = await jugadoresRes.json();
        
        const equiposOrdenados = equiposData
          .sort((a, b) => b.puntuacion - a.puntuacion)
          .slice(0, 10);
        const jugadoresOrdenados = jugadoresData
          .sort((a, b) => b.puntuacion - a.puntuacion)
          .slice(0, 10);
        
        setEquipos(equiposOrdenados);
        setJugadores(jugadoresOrdenados);
        
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (isInitialLoad && equipos.length === 0 && jugadores.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="text-green-400 font-mono text-8xl tracking-widest font-black animate-pulse">
            CODER
          </div>
          <div className="text-orange-400 text-xl font-mono tracking-wider">
            CARGANDO_RANKINGS...
          </div>
          <div className="flex space-x-1 justify-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 border border-gray-600 ${
                  i < 5 ? 'bg-green-400' : 'bg-transparent'
                } animate-pulse`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-yellow-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('inicio')}
              className="bg-orange-800 hover:bg-orange-900 text-white p-2 rounded transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-orange-800 rounded flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-black font-bold text-lg">LEADERBOARD</h1>
              <p className="text-orange-900 text-xs font-mono">rankings_realtime_v2025</p>
            </div>
          </div>
          
          <div className="bg-orange-800 text-white px-4 py-2 rounded flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium font-mono">LIVE</span>
          </div>
        </div>
      </header>

      {/* Variable de estado */}
      <div className="px-6 py-2 bg-gray-900 border-b border-gray-700">
        <p className="text-gray-400 font-mono text-sm">
          <span className="text-green-400">$</span> rankings_active: <span className="text-green-400">true</span>
          <span className="ml-4 text-yellow-400">auto_refresh: 3s</span>
        </p>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Ranking de Equipos TOP 10 */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm font-mono ml-4">teams_ranking.js</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-black text-white font-mono">TOP_10_TEAMS</h2>
                </div>
                <div className="text-yellow-300 font-mono text-sm">
                  {equipos.length}/10
                </div>
              </div>

              <div className="space-y-1">
                {Array.from({ length: 10 }).map((_, index) => {
                  const equipo = equipos[index];
                  const position = index + 1;
                  
                  if (equipo) {
                    return (
                      <div key={equipo._id} className={`flex items-center justify-between p-2 rounded border backdrop-blur-sm transition-all hover:scale-102 ${getRankColor(position)}`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 flex items-center justify-center font-mono font-bold text-sm">
                            #{position}
                          </div>
                          
                          <div className="w-6 h-6 rounded border border-white/30 overflow-hidden bg-gray-600 flex-shrink-0">
                            <img 
                              src={equipo.imagen} 
                              alt={equipo.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gray-600 flex items-center justify-center"><span class="text-white text-xs font-bold">${equipo.nombre.charAt(0)}</span></div>`;
                              }}
                            />
                          </div>
                          
                          <div>
                            <h3 className="text-white font-bold text-sm">{equipo.nombre}</h3>
                            <p className="text-gray-400 text-xs font-mono">team_id: {equipo._id.slice(-6)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-black text-white font-mono">{equipo.puntuacion}</div>
                          <div className="text-xs text-gray-400 font-mono">pts</div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`empty-team-${index}`} className="flex items-center justify-between p-2 rounded border border-gray-700 bg-gray-800/30 opacity-30">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 flex items-center justify-center font-mono font-bold text-sm text-gray-500">
                            #{position}
                          </div>
                          <div className="w-6 h-6 rounded border border-gray-600 bg-gray-700"></div>
                          <div>
                            <h3 className="text-gray-500 font-bold text-sm font-mono">---</h3>
                            <p className="text-gray-600 text-xs font-mono">empty_slot</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-gray-500 font-mono">0</div>
                          <div className="text-xs text-gray-600 font-mono">pts</div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          {/* Ranking de Jugadores TOP 10 */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm font-mono ml-4">players_ranking.js</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-black text-white font-mono">TOP_10_PLAYERS</h2>
                </div>
                <div className="text-blue-300 font-mono text-sm">
                  {jugadores.length}/10
                </div>
              </div>

              <div className="space-y-1">
                {Array.from({ length: 10 }).map((_, index) => {
                  const jugador = jugadores[index];
                  const position = index + 1;
                  
                  if (jugador) {
                    return (
                      <div key={jugador._id} className={`flex items-center justify-between p-2 rounded border backdrop-blur-sm transition-all hover:scale-102 ${getRankColor(position)}`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 flex items-center justify-center font-mono font-bold text-sm">
                            #{position}
                          </div>
                          
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded border border-white/30 flex items-center justify-center">
                            <span className="text-white text-xs font-bold font-mono">
                              {jugador.numero.toString().padStart(2, '0')}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-white font-bold text-sm font-mono">Player #{jugador.numero}</h3>
                            <p className="text-gray-400 text-xs font-mono">
                              {jugador.equipo?.nombre || 'Sin equipo'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-black text-white font-mono">{jugador.puntuacion}</div>
                          <div className="text-xs text-gray-400 font-mono">pts</div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`empty-player-${index}`} className="flex items-center justify-between p-2 rounded border border-gray-700 bg-gray-800/30 opacity-30">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 flex items-center justify-center font-mono font-bold text-sm text-gray-500">
                            #{position}
                          </div>
                          <div className="w-6 h-6 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-bold font-mono">--</span>
                          </div>
                          <div>
                            <h3 className="text-gray-500 font-bold text-sm font-mono">Player #---</h3>
                            <p className="text-gray-600 text-xs font-mono">empty_slot</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-gray-500 font-mono">0</div>
                          <div className="text-xs text-gray-600 font-mono">pts</div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;