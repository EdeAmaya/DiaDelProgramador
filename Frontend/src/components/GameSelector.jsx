// src/components/GameSelector.jsx
import React, { useState, useEffect } from "react";

const GameSelector = ({ onNavigate }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gamePhase, setGamePhase] = useState('selection');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [hiddenPlayers, setHiddenPlayers] = useState(new Set());
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scoreToAdd] = useState(5);
  const [stats, setStats] = useState({
    equipos: 0,
    jugadores: 0,
    totalParticipantes: 0
  });

  // Componente para mostrar la imagen del equipo
  const TeamImage = ({ equipo, size = "w-12 h-12 sm:w-16 sm:h-16" }) => {
    const isCloudinaryUrl = equipo.imagen && (
      equipo.imagen.includes('cloudinary.com') || 
      equipo.imagen.includes('res.cloudinary.com') ||
      equipo.imagen.startsWith('http')
    );

    if (isCloudinaryUrl) {
      return (
        <div className={`${size} mx-auto rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg bg-gray-600`}>
          <img 
            src={equipo.imagen} 
            alt={equipo.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Error cargando imagen:', equipo.imagen);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl sm:text-3xl text-white"
            style={{ display: 'none' }}
          >
            👥
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-3xl sm:text-4xl">{equipo.imagen || '👥'}</div>
      );
    }
  };

  // Lista de juegos
  const games = [
    { id: 1, name: "Luz Roja, Luz Verde", teams: 1, icon: "🚦", color: "from-green-600 to-green-800" },
    { id: 2, name: "Los verdaderos Botón rojo", teams: 2, icon: "🔴", color: "from-red-600 to-red-800" },
    { id: 3, name: "Figmanary", teams: 2, icon: "🎨", color: "from-purple-600 to-purple-800" },
    { id: 4, name: "BUGGLEE", teams: 2, icon: "🐛", color: "from-orange-600 to-orange-800" },
    { id: 5, name: "Salta cuerda", teams: 1, icon: "🤸", color: "from-blue-600 to-blue-800" },
    { id: 6, name: "Equis cero gigante en equipos", teams: 2, icon: "⭕", color: "from-cyan-600 to-cyan-800" },
    { id: 7, name: "Trabalenguas", teams: 1, icon: "👅", color: "from-pink-600 to-pink-800" },
    { id: 8, name: "Decisión no inteligente", teams: 2, icon: "🤔", color: "from-gray-600 to-gray-800" },
    { id: 9, name: "Teléfono Descompuesto", teams: 2, icon: "📞", color: "from-indigo-600 to-indigo-800" },
    { id: 10, name: "Campo minado", teams: 2, icon: "💣", color: "from-red-800 to-black" },
    { id: 11, name: "Pasa la bola", teams: 2, icon: "⚽", color: "from-green-600 to-green-800" },
    { id: 12, name: "Adivina el lenguaje", teams: 2, icon: "🔤", color: "from-yellow-600 to-yellow-800" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [equiposRes, jugadoresRes] = await Promise.all([
        fetch('http://localhost:4000/api/equipos'),
        fetch('http://localhost:4000/api/jugadores')
      ]);
      
      if (equiposRes.ok && jugadoresRes.ok) {
        const equiposData = await equiposRes.json();
        const jugadoresData = await jugadoresRes.json();
        
        setEquipos(equiposData);
        setJugadores(jugadoresData);
        setStats({
          equipos: equiposData.length,
          jugadores: jugadoresData.length,
          totalParticipantes: equiposData.length + jugadoresData.length
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setGamePhase('team-selection');
    setSelectedTeams([]);
    setSelectedPlayers([]);
  };

  const handleTeamSelection = (equipo) => {
    if (selectedGame.teams === 1) {
      setSelectedTeams([equipo]);
      const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id && !hiddenPlayers.has(j._id));
      setSelectedPlayers(teamPlayers);
    } else {
      if (selectedTeams.find(t => t._id === equipo._id)) {
        setSelectedTeams(selectedTeams.filter(t => t._id !== equipo._id));
      } else if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, equipo]);
      }
    }
  };

  const startScoring = () => {
    if (selectedGame.teams === 1 && selectedTeams.length === 1) {
      setGamePhase('scoring');
    } else if (selectedGame.teams === 2 && selectedTeams.length === 2) {
      setGamePhase('scoring');
    }
  };

  const addPointsToPlayer = async (jugador) => {
    try {
      const response = await fetch(`http://localhost:4000/api/jugadores/${jugador._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero: jugador.numero,
          equipo: jugador.equipo._id,
          puntuacion: jugador.puntuacion + scoreToAdd
        }),
      });

      if (response.ok) {
        const equipo = selectedTeams[0];
        const equipoResponse = await fetch(`http://localhost:4000/api/equipos/${equipo._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: equipo.nombre,
            imagen: equipo.imagen,
            puntuacion: equipo.puntuacion + scoreToAdd
          }),
        });

        if (equipoResponse.ok) {
          setHiddenPlayers(prev => new Set([...prev, jugador._id]));
          setSelectedPlayers(prev => prev.filter(p => p._id !== jugador._id));
          alert(`+${scoreToAdd} puntos para Jugador #${jugador.numero} y su equipo!`);
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error adding points:", error);
      alert("Error al sumar puntos");
    }
  };

  const addPointsToTeam = async (equipoGanador) => {
    try {
      const teamPlayers = jugadores.filter(j => j.equipo._id === equipoGanador._id);
      
      const playerUpdates = teamPlayers.map(jugador => 
        fetch(`http://localhost:4000/api/jugadores/${jugador._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numero: jugador.numero,
            equipo: jugador.equipo._id,
            puntuacion: jugador.puntuacion + scoreToAdd
          }),
        })
      );

      const equipoUpdate = fetch(`http://localhost:4000/api/equipos/${equipoGanador._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: equipoGanador.nombre,
          imagen: equipoGanador.imagen,
          puntuacion: equipoGanador.puntuacion + 50
        }),
      });

      await Promise.all([...playerUpdates, equipoUpdate]);
      
      alert(`¡${equipoGanador.nombre} ganó! +50 puntos para el equipo y +${scoreToAdd} para cada uno de sus ${teamPlayers.length} miembros!`);
      fetchData();
    } catch (error) {
      console.error("Error adding team points:", error);
      alert("Error al sumar puntos al equipo");
    }
  };

  const resetToGameSelection = () => {
    setSelectedGame(null);
    setGamePhase('selection');
    setSelectedTeams([]);
    setSelectedPlayers([]);
    setHiddenPlayers(new Set());
  };

  const resetSelection = () => {
    setGamePhase('team-selection');
    setSelectedTeams([]);
    setSelectedPlayers([]);
    setHiddenPlayers(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-6 sm:border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 sm:mb-8"></div>
          <h1 className="text-2xl sm:text-4xl font-black text-purple-500">CARGANDO...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 text-white relative overflow-hidden">
      {/* Header responsive */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 py-4 sm:py-8 shadow-2xl border-b-2 sm:border-b-4 border-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
              <button
                onClick={() => gamePhase === 'selection' ? onNavigate('inicio') : resetToGameSelection()}
                className="bg-black text-purple-500 p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <span className="text-lg sm:text-2xl">←</span>
              </button>
              <div className="bg-black text-purple-500 p-2 sm:p-4 rounded-full shadow-lg border-2 sm:border-4 border-purple-400">
                <span className="text-2xl sm:text-3xl">{selectedGame ? selectedGame.icon : '🎮'}</span>
              </div>
              <div className="bg-black text-yellow-500 p-2 sm:p-4 rounded-full shadow-lg border-2 sm:border-4 border-yellow-400">
                <span className="text-2xl sm:text-3xl">💻</span>
              </div>
              <div className="bg-black text-green-500 p-2 sm:p-4 rounded-full shadow-lg border-2 sm:border-4 border-green-400">
                <span className="text-2xl sm:text-3xl">⚔️</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 via-yellow-500 to-green-400 bg-clip-text text-transparent drop-shadow-2xl">
              {gamePhase === 'selection' ? 'SELECCIONAR JUEGO' : 
               gamePhase === 'team-selection' ? 'SELECCIONAR EQUIPOS' : 
               'ASIGNAR PUNTUACIÓN'}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-200 font-bold mb-2">
              {gamePhase === 'selection' ? 'Elige tu desafío' : 
               selectedGame ? `${selectedGame.name} - ${selectedGame.teams} equipo(s) - ${scoreToAdd} pts por jugador` : ''}
            </p>
            <div className="inline-block bg-black bg-opacity-50 px-3 sm:px-6 py-1 sm:py-2 rounded-full border border-purple-500">
              <p className="text-purple-300 font-mono text-xs sm:text-sm">
                ⚠️ {stats.totalParticipantes} programadores registrados • {stats.equipos} equipos activos ⚠️
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Fase 1: Selección de Juegos */}
        {gamePhase === 'selection' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
            {games.map((game) => (
              <div
                key={game.id}
                className={`bg-gradient-to-br ${game.color} p-4 sm:p-8 rounded-2xl border-2 sm:border-4 border-white border-opacity-30 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
                onClick={() => handleGameSelect(game)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center space-y-3 sm:space-y-6">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{game.icon}</div>
                  
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2">
                    {game.name}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-lg">
                    <span className="text-lg sm:text-2xl">👥</span>
                    <span className="font-bold text-white">
                      {game.teams} Equipo{game.teams > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <button className="w-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white py-2 sm:py-4 rounded-lg font-black text-sm sm:text-lg transition-all border border-white border-opacity-30">
                    JUGAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fase 2: Selección de Equipos */}
        {gamePhase === 'team-selection' && (
          <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-red-400 mb-2 sm:mb-4">
                {selectedGame.teams === 1 ? 'SELECCIONA 1 EQUIPO' : 'SELECCIONA 2 EQUIPOS'}
              </h2>
              <p className="text-white text-base sm:text-lg">
                Equipos seleccionados: {selectedTeams.length}/{selectedGame.teams}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {equipos.map((equipo) => {
                const isSelected = selectedTeams.find(t => t._id === equipo._id);
                const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                const availablePlayers = teamPlayers.filter(j => !hiddenPlayers.has(j._id));
                
                return (
                  <div
                    key={equipo._id}
                    className={`p-4 sm:p-6 rounded-2xl border-2 sm:border-4 shadow-xl cursor-pointer transform transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-green-600 to-green-800 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-400 hover:scale-105'
                    }`}
                    onClick={() => handleTeamSelection(equipo)}
                  >
                    <div className="text-center space-y-2 sm:space-y-4">
                      <TeamImage equipo={equipo} />
                      <h3 className="text-lg sm:text-2xl font-black text-white">{equipo.nombre}</h3>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                          <span className="text-base sm:text-xl">🏆</span>
                          <span className="text-yellow-400 font-bold text-sm sm:text-base">{equipo.puntuacion} pts</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                          <span className="text-base sm:text-xl">👥</span>
                          <span className="text-blue-400 font-bold text-sm sm:text-base">
                            {availablePlayers.length}/{teamPlayers.length} disponibles
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-green-500 text-white py-1 sm:py-2 rounded-lg font-black text-sm sm:text-base">
                          ✅ SELECCIONADO
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Jugadores disponibles */}
            {selectedGame.teams === 1 && selectedPlayers.length > 0 && (
              <div className="bg-black bg-opacity-50 p-4 sm:p-6 rounded-2xl border border-blue-500">
                <h3 className="text-xl sm:text-2xl font-black text-blue-400 mb-3 sm:mb-4 text-center">
                  JUGADORES DISPONIBLES ({selectedPlayers.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {selectedPlayers.map((jugador) => (
                    <div key={jugador._id} className="bg-blue-600 p-2 sm:p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-2xl font-black">#{jugador.numero}</div>
                      <div className="text-xs sm:text-sm text-blue-200">{jugador.puntuacion} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jugadores ya puntuados */}
            {selectedGame.teams === 1 && hiddenPlayers.size > 0 && selectedTeams.length > 0 && (
              <div className="bg-gray-800 bg-opacity-50 p-4 sm:p-6 rounded-2xl border border-gray-500">
                <h3 className="text-xl sm:text-2xl font-black text-gray-400 mb-3 sm:mb-4 text-center">
                  JUGADORES QUE YA RECIBIERON PUNTOS ({hiddenPlayers.size})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {jugadores.filter(j => j.equipo._id === selectedTeams[0]?._id && hiddenPlayers.has(j._id)).map((jugador) => (
                    <div key={jugador._id} className="bg-gray-600 p-2 sm:p-4 rounded-lg text-center opacity-50">
                      <div className="text-lg sm:text-2xl font-black">#{jugador.numero}</div>
                      <div className="text-xs sm:text-sm text-gray-300">{jugador.puntuacion} pts</div>
                      <div className="text-xs text-green-400 mt-1">✅ Puntuado</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de control */}
            <div className="text-center space-y-2 sm:space-y-4">
              {((selectedGame.teams === 1 && selectedTeams.length === 1 && selectedPlayers.length > 0) || 
                (selectedGame.teams === 2 && selectedTeams.length === 2)) && (
                <button
                  onClick={startScoring}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-base sm:text-xl shadow-lg transform hover:scale-105 transition-all"
                >
                  INICIAR PUNTUACIÓN
                </button>
              )}

              {selectedGame.teams === 1 && hiddenPlayers.size > 0 && (
                <div>
                  <button
                    onClick={resetSelection}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg shadow-lg transform hover:scale-105 transition-all"
                  >
                    🔄 NUEVA RONDA
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fase 3: Asignación de Puntuación */}
        {gamePhase === 'scoring' && (
          <div className="space-y-4 sm:space-y-8">
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-400">
                🏆 ASIGNAR PUNTUACIÓN 🏆
              </h2>
              <div className="bg-black bg-opacity-50 p-3 sm:p-4 rounded-lg inline-block">
                <p className="text-white font-bold text-sm sm:text-base">
                  Puntos por jugador: <span className="text-yellow-400 text-lg sm:text-2xl">{scoreToAdd}</span>
                  {selectedGame.teams === 2 && <span className="text-green-400 block text-sm sm:text-lg">+ 50 puntos para el equipo ganador</span>}
                </p>
              </div>
            </div>

            {/* Puntuación individual */}
            {selectedGame.teams === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-black text-center text-green-400">
                  SELECCIONA JUGADORES GANADORES
                </h3>
                {selectedPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {selectedPlayers.map((jugador) => (
                      <div key={jugador._id} className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6 rounded-2xl border-2 sm:border-4 border-blue-400">
                        <div className="text-center space-y-3 sm:space-y-4">
                          <div className="text-3xl sm:text-4xl">👤</div>
                          <h4 className="text-lg sm:text-xl font-black text-white">Jugador #{jugador.numero}</h4>
                          <div className="text-yellow-400 font-bold text-sm sm:text-base">{jugador.puntuacion} pts</div>
                          <button
                            onClick={() => addPointsToPlayer(jugador)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                          >
                            <span className="text-base sm:text-xl">➕</span>
                            <span>+{scoreToAdd} PUNTOS</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-4xl sm:text-6xl text-gray-400 mb-4">🎯</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Todos los jugadores ya recibieron puntos</h3>
                    <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Inicia una nueva ronda para que puedan volver a participar</p>
                    <button
                      onClick={resetSelection}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                      🔄 NUEVA RONDA
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Puntuación por equipos */}
            {selectedGame.teams === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-black text-center text-green-400">
                  SELECCIONA EQUIPO GANADOR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  {selectedTeams.map((equipo) => {
                    const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                    
                    return (
                      <div key={equipo._id} className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 sm:p-8 rounded-2xl border-2 sm:border-4 border-purple-400">
                        <div className="text-center space-y-3 sm:space-y-6">
                          <TeamImage equipo={equipo} size="w-16 h-16 sm:w-20 sm:h-20" />
                          <h4 className="text-2xl sm:text-3xl font-black text-white">{equipo.nombre}</h4>
                          <div className="space-y-1 sm:space-y-2">
                            <div className="text-yellow-400 font-bold text-lg sm:text-xl">{equipo.puntuacion} pts</div>
                            <div className="text-purple-200 text-sm sm:text-base">{teamPlayers.length} jugadores</div>
                          </div>
                          
                          <div className="bg-black bg-opacity-30 p-2 sm:p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                              {teamPlayers.map((jugador) => (
                                <div key={jugador._id} className="text-center">
                                  <div className="text-xs sm:text-sm font-bold">#{jugador.numero}</div>
                                  <div className="text-xs text-purple-200">{jugador.puntuacion}pts</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addPointsToTeam(equipo)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 rounded-lg font-black text-sm sm:text-lg flex items-center justify-center space-x-1 sm:space-x-2"
                          >
                            <span className="text-base sm:text-xl">🏆</span>
                            <span className="hidden sm:inline">GANADOR (+50 pts equipo, +{scoreToAdd} c/jugador)</span>
                            <span className="sm:hidden">GANADOR</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botones de control */}
            <div className="text-center space-y-2 sm:space-y-4">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setGamePhase('team-selection')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg"
                >
                  ← CAMBIAR EQUIPOS
                </button>
                <button
                  onClick={resetToGameSelection}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg"
                >
                  🎮 CAMBIAR JUEGO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer simplificado */}
      {gamePhase === 'selection' && (
        <div className="relative z-10 bg-black bg-opacity-50 mt-8 sm:mt-12 py-4 sm:py-8 border-t-2 sm:border-t-4 border-purple-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <button
                onClick={() => onNavigate('inicio')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ← VOLVER AL INICIO
              </button>
              
              <div className="text-center">
                <p className="text-purple-300 font-mono text-sm sm:text-lg font-bold">
                  {games.length} JUEGOS DISPONIBLES • DÍA DEL PROGRAMADOR 2024
                </p>
              </div>
              
              <button
                onClick={() => onNavigate('leaderboard')}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                🏆 RANKINGS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelector;