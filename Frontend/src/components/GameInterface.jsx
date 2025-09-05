// src/components/GameInterface.jsx
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const GameInterface = ({ onNavigate }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gamePhase, setGamePhase] = useState('selection'); // 'selection', 'team-selection', 'scoring'
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scoreToAdd, setScoreToAdd] = useState(10);

  // Lista de juegos con configuración
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

  // Cargar datos del backend
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
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar juego y pasar a selección de equipos
  const selectGame = (game) => {
    setSelectedGame(game);
    setGamePhase('team-selection');
    setSelectedTeams([]);
    setSelectedPlayers([]);
  };

  // Manejar selección de equipos
  const handleTeamSelection = (equipo) => {
    if (selectedGame.teams === 1) {
      setSelectedTeams([equipo]);
      // Para juegos de 1 equipo, cargar todos los jugadores del equipo
      const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
      setSelectedPlayers(teamPlayers);
    } else {
      // Para juegos de 2 equipos
      if (selectedTeams.find(t => t._id === equipo._id)) {
        setSelectedTeams(selectedTeams.filter(t => t._id !== equipo._id));
      } else if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, equipo]);
      }
    }
  };

  // Iniciar fase de puntuación
  const startScoring = () => {
    if (selectedGame.teams === 1 && selectedTeams.length === 1) {
      setGamePhase('scoring');
    } else if (selectedGame.teams === 2 && selectedTeams.length === 2) {
      setGamePhase('scoring');
    }
  };

  // Sumar puntos individuales (juegos de 1 equipo)
  const addPointsToPlayer = async (jugador) => {
    try {
      // Actualizar puntuación del jugador
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
        // Actualizar puntuación del equipo
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
          toast.success(`+${scoreToAdd} puntos para Jugador #${jugador.numero} y su equipo!`);
          fetchData(); // Recargar datos
        }
      }
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error("Error al sumar puntos");
    }
  };

  // Sumar puntos a equipo completo (juegos de 2 equipos)
  const addPointsToTeam = async (equipoGanador) => {
    try {
      // Obtener todos los jugadores del equipo ganador
      const teamPlayers = jugadores.filter(j => j.equipo._id === equipoGanador._id);
      
      // Actualizar puntuaciones de todos los jugadores del equipo
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

      // Actualizar puntuación del equipo
      const equipoUpdate = fetch(`http://localhost:4000/api/equipos/${equipoGanador._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: equipoGanador.nombre,
          imagen: equipoGanador.imagen,
          puntuacion: equipoGanador.puntuacion + (scoreToAdd * teamPlayers.length)
        }),
      });

      // Ejecutar todas las actualizaciones
      await Promise.all([...playerUpdates, equipoUpdate]);
      
      toast.success(`¡${equipoGanador.nombre} ganó! +${scoreToAdd} puntos para todos sus ${teamPlayers.length} miembros!`);
      fetchData(); // Recargar datos
    } catch (error) {
      console.error("Error adding team points:", error);
      toast.error("Error al sumar puntos al equipo");
    }
  };

  // Reiniciar selección
  const resetSelection = () => {
    setSelectedGame(null);
    setGamePhase('selection');
    setSelectedTeams([]);
    setSelectedPlayers([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-4xl font-black text-purple-500">CARGANDO JUEGOS...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 py-6 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => gamePhase === 'selection' ? onNavigate('games') : resetSelection()}
              className="bg-black text-purple-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <span className="text-2xl">←</span>
            </button>
            <div className="bg-black text-purple-500 p-4 rounded-full shadow-lg">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-wide">
                {gamePhase === 'selection' ? 'SELECCIONAR JUEGO' : 
                 gamePhase === 'team-selection' ? 'SELECCIONAR EQUIPOS' : 
                 'ASIGNAR PUNTUACIÓN'}
              </h1>
              <p className="text-purple-200 text-lg font-medium">
                {selectedGame ? `${selectedGame.name} - ${selectedGame.teams} equipo(s)` : 'Elige tu desafío'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Fase 1: Selección de Juego */}
        {gamePhase === 'selection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className={`bg-gradient-to-br ${game.color} p-6 rounded-2xl border-4 border-red-400 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300`}
                onClick={() => selectGame(game)}
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl">{game.icon}</div>
                  <h3 className="text-2xl font-black text-white">{game.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">👥</span>
                    <span className="font-bold">{game.teams} Equipo(s)</span>
                  </div>
                  <button className="w-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white py-3 rounded-lg font-bold transition-all">
                    JUGAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fase 2: Selección de Equipos */}
        {gamePhase === 'team-selection' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-red-400 mb-4">
                {selectedGame.teams === 1 ? 'SELECCIONA 1 EQUIPO' : 'SELECCIONA 2 EQUIPOS'}
              </h2>
              <p className="text-white text-lg">
                Equipos seleccionados: {selectedTeams.length}/{selectedGame.teams}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipos.map((equipo) => {
                const isSelected = selectedTeams.find(t => t._id === equipo._id);
                const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                
                return (
                  <div
                    key={equipo._id}
                    className={`p-6 rounded-2xl border-4 shadow-xl cursor-pointer transform transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-green-600 to-green-800 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-400 hover:scale-105'
                    }`}
                    onClick={() => handleTeamSelection(equipo)}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-4xl">{equipo.imagen}</div>
                      <h3 className="text-2xl font-black text-white">{equipo.nombre}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xl">🏆</span>
                          <span className="text-yellow-400 font-bold">{equipo.puntuacion} pts</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xl">👥</span>
                          <span className="text-blue-400 font-bold">{teamPlayers.length} jugadores</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-green-500 text-white py-2 rounded-lg font-black">
                          ✓ SELECCIONADO
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mostrar jugadores del equipo seleccionado (solo para juegos de 1 equipo) */}
            {selectedGame.teams === 1 && selectedPlayers.length > 0 && (
              <div className="bg-black bg-opacity-50 p-6 rounded-2xl border-2 border-blue-500">
                <h3 className="text-2xl font-black text-blue-400 mb-4 text-center">
                  JUGADORES PARTICIPANTES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPlayers.map((jugador) => (
                    <div key={jugador._id} className="bg-blue-600 p-4 rounded-lg text-center">
                      <div className="text-2xl font-black">#{jugador.numero}</div>
                      <div className="text-sm text-blue-200">{jugador.puntuacion} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para continuar */}
            {((selectedGame.teams === 1 && selectedTeams.length === 1) || 
              (selectedGame.teams === 2 && selectedTeams.length === 2)) && (
              <div className="text-center">
                <button
                  onClick={startScoring}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg transform hover:scale-105 transition-all"
                >
                  INICIAR PUNTUACIÓN
                </button>
              </div>
            )}
          </div>
        )}

        {/* Fase 3: Asignación de Puntuación */}
        {gamePhase === 'scoring' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-yellow-400">
                🏆 ASIGNAR PUNTUACIÓN 🏆
              </h2>
              <div className="bg-black bg-opacity-50 p-4 rounded-lg inline-block">
                <label className="text-white font-bold mr-4">Puntos a sumar:</label>
                <input
                  type="number"
                  value={scoreToAdd}
                  onChange={(e) => setScoreToAdd(parseInt(e.target.value) || 0)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg w-24 text-center font-bold"
                  min="1"
                />
              </div>
            </div>

            {/* Puntuación para juegos de 1 equipo (individual) */}
            {selectedGame.teams === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-center text-green-400">
                  SELECCIONA JUGADORES GANADORES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedPlayers.map((jugador) => (
                    <div key={jugador._id} className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-2xl border-4 border-blue-400">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">👤</div>
                        <h4 className="text-xl font-black text-white">Jugador #{jugador.numero}</h4>
                        <div className="text-yellow-400 font-bold">{jugador.puntuacion} pts</div>
                        <button
                          onClick={() => addPointsToPlayer(jugador)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2"
                        >
                          <span className="text-xl">➕</span>
                          <span>+{scoreToAdd} PUNTOS</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Puntuación para juegos de 2 equipos */}
            {selectedGame.teams === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-center text-green-400">
                  SELECCIONA EQUIPO GANADOR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedTeams.map((equipo) => {
                    const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                    
                    return (
                      <div key={equipo._id} className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 rounded-2xl border-4 border-purple-400">
                        <div className="text-center space-y-6">
                          <div className="text-6xl">{equipo.imagen}</div>
                          <h4 className="text-3xl font-black text-white">{equipo.nombre}</h4>
                          <div className="space-y-2">
                            <div className="text-yellow-400 font-bold text-xl">{equipo.puntuacion} pts</div>
                            <div className="text-purple-200">{teamPlayers.length} jugadores</div>
                          </div>
                          
                          {/* Lista de jugadores del equipo */}
                          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-2">
                              {teamPlayers.map((jugador) => (
                                <div key={jugador._id} className="text-center">
                                  <div className="text-sm font-bold">#{jugador.numero}</div>
                                  <div className="text-xs text-purple-200">{jugador.puntuacion}pts</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addPointsToTeam(equipo)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-black text-lg flex items-center justify-center space-x-2"
                          >
                            <span className="text-xl">🏆</span>
                            <span>EQUIPO GANADOR (+{scoreToAdd * teamPlayers.length} pts total)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botón para terminar el juego */}
            <div className="text-center">
              <button
                onClick={resetSelection}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg"
              >
                TERMINAR JUEGO
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toaster para notificaciones */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#7c3aed',
            color: '#fff',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
          },
        }}
      />
    </div>
  );
};

export default GameInterface;