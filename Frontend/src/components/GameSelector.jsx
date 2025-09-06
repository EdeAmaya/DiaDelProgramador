import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Users,
  Trophy,
  Play,
  Target,
  Palette,
  Bug,
  Activity,
  XCircle,
  MessageCircle,
  Phone,
  Bomb,
  Zap,
  Type,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  RotateCcw
} from 'lucide-react';

const CustomModal = ({ isOpen, onClose, type = 'info', title, message, onConfirm }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      case 'confirm':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {getIcon()}
          </div>
          
          <h3 className="text-2xl font-black text-white font-mono">{title}</h3>
          <p className="text-gray-300 text-lg font-mono">{message}</p>
          
          <div className="flex space-x-4">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded font-mono font-bold transition-all"
                >
                  SÍ
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded font-mono font-bold transition-all"
                >
                  NO
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded font-mono font-bold transition-all"
              >
                ENTENDIDO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameSelector = ({ onNavigate }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gamePhase, setGamePhase] = useState('selection');
  const [gameMode, setGameMode] = useState(null);
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

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const TeamImage = ({ equipo, size = "w-12 h-12" }) => {
    const isCloudinaryUrl = equipo.imagen && (
      equipo.imagen.includes('cloudinary.com') || 
      equipo.imagen.includes('res.cloudinary.com') ||
      equipo.imagen.startsWith('http')
    );

    if (isCloudinaryUrl) {
      return (
        <div className={`${size} mx-auto rounded border-2 border-white/30 overflow-hidden bg-gray-600`}>
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
      );
    } else {
      return (
        <div className={`${size} bg-gray-600 rounded border-2 border-white/30 flex items-center justify-center mx-auto`}>
          <Users className="w-6 h-6 text-white" />
        </div>
      );
    }
  };

  const games = [
    { id: 1, name: "Luz Roja, Luz Verde", teams: 1, icon: Target, color: "border-green-500" },
    { id: 2, name: "Los verdaderos Botón rojo", teams: 2, icon: Play, color: "border-red-500" },
    { id: 3, name: "Figmanary", teams: 2, icon: Palette, color: "border-purple-500" },
    { id: 4, name: "BUGGLEE", teams: 2, icon: Bug, color: "border-orange-500" },
    { id: 5, name: "Salta cuerda", teams: 1, icon: Activity, color: "border-blue-500" },
    { id: 6, name: "Equis cero gigante en equipos", teams: 2, icon: XCircle, color: "border-cyan-500" },
    { id: 7, name: "Trabalenguas", teams: 1, icon: MessageCircle, color: "border-pink-500" },
    { id: 8, name: "Decisión no inteligente", teams: 2, icon: Target, color: "border-gray-500" },
    { id: 9, name: "Teléfono Descompuesto", teams: 2, icon: Phone, color: "border-indigo-500" },
    { id: 10, name: "Campo minado", teams: 2, icon: Bomb, color: "border-red-600" },
    { id: 11, name: "Pasa la bola", teams: 2, icon: Zap, color: "border-green-600" },
    { id: 12, name: "Adivina el lenguaje", teams: 2, icon: Type, color: "border-yellow-500" }
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
      showModal('error', 'ERROR_CONEXION', 'No se pudieron cargar los datos del servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedTeams([]);
    setSelectedPlayers([]);
    setHiddenPlayers(new Set());
    setGameMode(null);
    
    if (game.teams === 1) {
      setGamePhase('team-selection');
    } else {
      setGamePhase('mode-selection');
    }
  };

  const handleModeSelection = (mode) => {
    setGameMode(mode);
    setGamePhase('team-selection');
  };

  const handleTeamSelection = (equipo) => {
    const effectiveTeams = selectedGame.teams === 1 ? 1 : gameMode;
    
    if (effectiveTeams === 1) {
      setSelectedTeams([equipo]);
      const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id && !hiddenPlayers.has(j._id));
      setSelectedPlayers(teamPlayers);
    } else if (effectiveTeams === 2) {
      if (selectedTeams.find(t => t._id === equipo._id)) {
        setSelectedTeams(selectedTeams.filter(t => t._id !== equipo._id));
      } else if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, equipo]);
      } else {
        setSelectedTeams([selectedTeams[0], equipo]);
      }
    }
  };

  const startScoring = () => {
    const effectiveTeams = selectedGame.teams === 1 ? 1 : gameMode;
    
    if (effectiveTeams === 1 && selectedTeams.length === 1) {
      setGamePhase('scoring');
    } else if (effectiveTeams === 2 && selectedTeams.length === 2) {
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
          showModal('success', 'PUNTOS_ASIGNADOS', `+${scoreToAdd} puntos para Player #${jugador.numero}`);
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error adding points:", error);
      showModal('error', 'ERROR', 'No se pudieron asignar los puntos.');
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
      
      showModal('success', 'EQUIPO_GANADOR', `${equipoGanador.nombre} ganó! +50 pts para equipo, +${scoreToAdd} por jugador`);
      
      await fetchData();
      setSelectedTeams([]);
      setSelectedPlayers([]);
      setHiddenPlayers(new Set());
      setGamePhase('team-selection');
      
    } catch (error) {
      console.error("Error adding team points:", error);
      showModal('error', 'ERROR', 'No se pudieron asignar los puntos al equipo.');
    }
  };

  const resetToGameSelection = () => {
    setSelectedGame(null);
    setGamePhase('selection');
    setGameMode(null);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="text-green-400 font-mono text-8xl tracking-widest font-black animate-pulse">
            CODER
          </div>
          <div className="text-orange-400 text-xl font-mono tracking-wider">
            CARGANDO_JUEGOS...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => gamePhase === 'selection' ? onNavigate('inicio') : resetToGameSelection()}
              className="bg-purple-800 hover:bg-purple-900 text-white p-2 rounded transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-purple-800 rounded flex items-center justify-center">
              {selectedGame ? (
                <selectedGame.icon className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">
                {gamePhase === 'selection' ? 'GAMES_MENU' : 
                 gamePhase === 'mode-selection' ? 'SELECT_MODE' :
                 gamePhase === 'team-selection' ? 'SELECT_TEAMS' : 
                 'ASSIGN_POINTS'}
              </h1>
              <p className="text-purple-200 text-xs font-mono">
                {selectedGame ? `${selectedGame.name.toLowerCase().replace(/\s+/g, '_')}` : 'game_selector_v2025'}
              </p>
            </div>
          </div>
          
          <div className="bg-purple-800 text-white px-4 py-2 rounded flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium font-mono">{stats.totalParticipantes} ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Variable de estado */}
      <div className="px-6 py-2 bg-gray-900 border-b border-gray-700">
        <p className="text-gray-400 font-mono text-sm">
          <span className="text-green-400">$</span> game_mode: <span className="text-blue-400">"{gamePhase}"</span>
          {selectedGame && <span className="ml-4 text-yellow-400">selected: "{selectedGame.name}"</span>}
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Game Selection */}
        {gamePhase === 'selection' && (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm font-mono ml-4">games_list.js</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => {
                    const IconComponent = game.icon;
                    return (
                      <div
                        key={game.id}
                        className={`bg-gray-800 hover:bg-gray-700 p-6 rounded border-2 ${game.color} cursor-pointer transform hover:scale-105 transition-all duration-300`}
                        onClick={() => handleGameSelect(game)}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center mx-auto">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-white font-mono">
                            {game.name}
                          </h3>
                          
                          <div className="flex items-center justify-center space-x-2 text-sm font-mono">
                            <Users className="w-4 h-4" />
                            <span className="text-gray-300">
                              {game.teams} equipo{game.teams > 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-mono font-bold transition-all">
                            EJECUTAR
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        {gamePhase === 'mode-selection' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-green-400 font-mono mb-4">
                SELECT_GAME_MODE
              </h2>
              <p className="text-gray-300 font-mono">
                function {selectedGame?.name.toLowerCase().replace(/\s+/g, '_')}(teams) &#123;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div
                className="bg-gray-800 hover:bg-gray-700 border-2 border-blue-500 p-8 rounded cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => handleModeSelection(1)}
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-mono">MODO_INDIVIDUAL</h3>
                  <p className="text-gray-300 font-mono text-sm">
                    // Un equipo, puntos individuales
                  </p>
                  <div className="bg-gray-900 p-4 rounded border border-gray-600">
                    <p className="text-blue-300 font-mono text-sm">
                      +{scoreToAdd} pts por jugador ganador
                    </p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-mono font-bold transition-all">
                    SELECCIONAR
                  </button>
                </div>
              </div>

              <div
                className="bg-gray-800 hover:bg-gray-700 border-2 border-purple-500 p-8 rounded cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => handleModeSelection(2)}
              >
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xl font-black font-mono">VS</span>
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white font-mono">MODO_COMPETENCIA</h3>
                  <p className="text-gray-300 font-mono text-sm">
                    // Dos equipos enfrentados
                  </p>
                  <div className="bg-gray-900 p-4 rounded border border-gray-600">
                    <p className="text-purple-300 font-mono text-sm">
                      +50 pts equipo + {scoreToAdd} por jugador
                    </p>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-mono font-bold transition-all">
                    SELECCIONAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Selection */}
        {gamePhase === 'team-selection' && (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm font-mono ml-4">team_selector.js</span>
                </div>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-green-400 font-mono mb-4">
                    {(selectedGame?.teams === 1 || gameMode === 1) ? 'SELECT_ONE_TEAM' : 'SELECT_TWO_TEAMS'}
                  </h2>
                  <p className="text-gray-300 font-mono">
                    selected_teams.length: <span className="text-yellow-400">{selectedTeams.length}</span> / <span className="text-blue-400">{(selectedGame?.teams === 1 || gameMode === 1) ? 1 : 2}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipos.map((equipo) => {
                    const isSelected = selectedTeams.find(t => t._id === equipo._id);
                    const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                    const availablePlayers = teamPlayers.filter(j => !hiddenPlayers.has(j._id));
                    
                    return (
                      <div
                        key={equipo._id}
                        className={`p-6 rounded border-2 cursor-pointer transform transition-all duration-300 ${
                          isSelected 
                            ? 'bg-green-800 border-green-500 scale-105' 
                            : 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:scale-105'
                        }`}
                        onClick={() => handleTeamSelection(equipo)}
                      >
                        <div className="text-center space-y-4">
                          <TeamImage equipo={equipo} />
                          <h3 className="text-xl font-bold text-white font-mono">{equipo.nombre}</h3>
                          <div className="space-y-2 font-mono text-sm">
                            <div className="flex items-center justify-center space-x-2">
                              <Trophy className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400">{equipo.puntuacion} pts</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <Users className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400">
                                {availablePlayers.length}/{teamPlayers.length} disponibles
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="bg-green-600 text-white py-2 rounded font-mono font-bold text-sm">
                              ✓ SELECCIONADO
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(selectedGame?.teams === 1 || gameMode === 1) && selectedPlayers.length > 0 && (
                  <div className="mt-8 bg-gray-800 border border-gray-600 p-6 rounded">
                    <h3 className="text-xl font-bold text-blue-400 mb-4 text-center font-mono">
                      PLAYERS_AVAILABLE: {selectedPlayers.length}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedPlayers.map((jugador) => (
                        <div key={jugador._id} className="bg-gray-700 border border-gray-600 p-3 rounded text-center">
                          <div className="text-lg font-bold text-white font-mono">#{jugador.numero}</div>
                          <div className="text-xs text-gray-400 font-mono">{jugador.puntuacion}pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center mt-8">
                  {(((selectedGame?.teams === 1 || gameMode === 1) && selectedTeams.length === 1 && selectedPlayers.length > 0) || 
                    (gameMode === 2 && selectedTeams.length === 2)) && (
                    <button
                      onClick={startScoring}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded font-mono font-bold text-xl transition-all flex items-center justify-center space-x-2 mx-auto"
                    >
                      <Play className="w-6 h-6" />
                      <span>INICIAR_PUNTUACION</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Phase */}
        {gamePhase === 'scoring' && (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm font-mono ml-4">scoring_system.js</span>
                </div>
              </div>

              <div className="p-6">
                <div className="text-center space-y-4 mb-8">
                  <h2 className="text-2xl font-black text-yellow-400 font-mono">
                    ASIGNAR_PUNTUACION
                  </h2>
                  <div className="bg-gray-800 border border-gray-600 p-4 rounded inline-block">
                    <p className="text-white font-mono">
                      points_per_player: <span className="text-yellow-400">{scoreToAdd}</span>
                      {gameMode === 2 && <span className="text-green-400 block">team_bonus: 50</span>}
                    </p>
                  </div>
                </div>

                {/* Individual Scoring */}
                {(selectedGame?.teams === 1 || gameMode === 1) && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center text-green-400 font-mono">
                      SELECT_WINNERS
                    </h3>
                    {selectedPlayers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedPlayers.map((jugador) => (
                          <div key={jugador._id} className="bg-gray-800 border-2 border-blue-500 p-6 rounded">
                            <div className="text-center space-y-4">
                              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mx-auto">
                                <Users className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="text-lg font-bold text-white font-mono">Player #{jugador.numero}</h4>
                              <div className="text-yellow-400 font-bold font-mono">{jugador.puntuacion} pts</div>
                              <button
                                onClick={() => addPointsToPlayer(jugador)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-mono font-bold transition-all flex items-center justify-center space-x-2"
                              >
                                <Plus className="w-4 h-4" />
                                <span>+{scoreToAdd} PUNTOS</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 font-mono text-lg mb-4">
                          // Todos los jugadores ya recibieron puntos
                        </div>
                        <button
                          onClick={resetSelection}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded font-mono font-bold transition-all flex items-center justify-center space-x-2 mx-auto"
                        >
                          <RotateCcw className="w-5 h-5" />
                          <span>NUEVA_RONDA</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Scoring */}
                {gameMode === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center text-green-400 font-mono">
                      SELECT_WINNING_TEAM
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedTeams.map((equipo) => {
                        const teamPlayers = jugadores.filter(j => j.equipo._id === equipo._id);
                        
                        return (
                          <div key={equipo._id} className="bg-gray-800 border-2 border-purple-500 p-8 rounded">
                            <div className="text-center space-y-6">
                              <TeamImage equipo={equipo} size="w-20 h-20" />
                              <h4 className="text-2xl font-bold text-white font-mono">{equipo.nombre}</h4>
                              <div className="space-y-2">
                                <div className="text-yellow-400 font-bold text-xl font-mono">{equipo.puntuacion} pts</div>
                                <div className="text-gray-300 font-mono">{teamPlayers.length} jugadores</div>
                              </div>
                              
                              <div className="bg-gray-900 border border-gray-600 p-4 rounded">
                                <div className="grid grid-cols-3 gap-2">
                                  {teamPlayers.map((jugador) => (
                                    <div key={jugador._id} className="text-center">
                                      <div className="text-sm font-bold text-white font-mono">#{jugador.numero}</div>
                                      <div className="text-xs text-gray-400 font-mono">{jugador.puntuacion}pts</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => addPointsToTeam(equipo)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded font-mono font-bold text-lg transition-all flex items-center justify-center space-x-2"
                              >
                                <Trophy className="w-5 h-5" />
                                <span>GANADOR</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      setGamePhase('team-selection');
                      setSelectedTeams([]);
                      setSelectedPlayers([]);
                      setHiddenPlayers(new Set());
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded font-mono font-bold text-lg transition-all"
                  >
                    PUNTUACION_FINALIZADA
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSelector;