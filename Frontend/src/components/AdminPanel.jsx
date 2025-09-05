import React from "react";
import useDataSquidGames from "../hooks/useData";
import { Toaster } from 'react-hot-toast';

const AdminPanel = ({ onNavigate }) => {
  const {
    activeTab,
    setActiveTab,
    equipos,
    jugadores,
    loading,
    // Estados de equipos
    equipoId,
    nombreEquipo,
    setNombreEquipo,
    imagenEquipo,
    setImagenEquipo,
    puntuacionEquipo,
    setPuntuacionEquipo,
    // Estados de jugadores
    jugadorId,
    numeroJugador,
    setNumeroJugador,
    equipoJugador,
    setEquipoJugador,
    puntuacionJugador,
    setPuntuacionJugador,
    // Funciones de equipos
    saveEquipo,
    deleteEquipo,
    updateEquipo,
    handleEditEquipo,
    clearEquipoForm,
    // Funciones de jugadores
    saveJugador,
    deleteJugador,
    updateJugador,
    handleEditJugador,
    clearJugadorForm
  } = useDataSquidGames();

  const EquipoCard = ({ equipo }) => (
    <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-2xl border-4 border-red-400 shadow-xl">
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{equipo.imagen}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">{equipo.nombre}</h3>
          <p className="text-xl text-yellow-300">{equipo.puntuacion} pts</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => updateEquipo(equipo)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => deleteEquipo(equipo._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  const JugadorCard = ({ jugador }) => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-2xl border-4 border-blue-400 shadow-xl">
      <div className="flex items-center space-x-4">
        <div className="text-4xl">👤</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">Jugador #{jugador.numero}</h3>
          <p className="text-lg text-blue-200">{jugador.equipo?.nombre || 'Sin equipo'}</p>
          <p className="text-xl text-yellow-300">{jugador.puntuacion} pts</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => updateJugador(jugador)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => deleteJugador(jugador._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-4xl font-black text-purple-500">CARGANDO PANEL...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white py-8 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('inicio')}
                className="bg-black text-purple-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <span className="text-2xl">←</span>
              </button>
              <div className="bg-black text-purple-500 p-4 rounded-full shadow-lg">
                <span className="text-3xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-wide">PANEL DE ADMINISTRACIÓN</h1>
                <p className="text-purple-200 text-lg font-medium">Gestión de Equipos y Jugadores • Squid Games</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Pestañas principales */}
        <div className="bg-black bg-opacity-50 rounded-2xl border-4 border-red-500 mb-8">
          <div className="flex">
            <button
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all duration-300 relative rounded-l-xl ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "text-purple-400 hover:bg-red-600 hover:bg-opacity-50"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">📋</span>
                <span>VER DATOS</span>
              </div>
            </button>
            
            <button
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all duration-300 relative rounded-r-xl ${
                activeTab === "form"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "text-purple-400 hover:bg-red-600 hover:bg-opacity-50"
              }`}
              onClick={() => {
                setActiveTab("form");
                clearEquipoForm();
                clearJugadorForm();
              }}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">➕</span>
                <span>AGREGAR DATOS</span>
              </div>
            </button>
          </div>
        </div>

        {/* Vista de datos */}
        {activeTab === "list" && (
          <div className="space-y-8">
            {/* Sección de Equipos */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-red-400 mb-2">🏆 EQUIPOS REGISTRADOS 🏆</h2>
                <p className="text-red-300 font-mono">Total: {equipos.length} equipos</p>
              </div>
              
              {equipos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl text-red-400 mb-4">📊</div>
                  <h3 className="text-xl font-bold text-red-400">No hay equipos registrados</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipos.map(equipo => (
                    <EquipoCard key={equipo._id} equipo={equipo} />
                  ))}
                </div>
              )}
            </div>

            {/* Sección de Jugadores */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-blue-400 mb-2">👥 JUGADORES REGISTRADOS 👥</h2>
                <p className="text-blue-300 font-mono">Total: {jugadores.length} jugadores</p>
              </div>
              
              {jugadores.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl text-blue-400 mb-4">👤</div>
                  <h3 className="text-xl font-bold text-blue-400">No hay jugadores registrados</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jugadores.map(jugador => (
                    <JugadorCard key={jugador._id} jugador={jugador} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formularios */}
        {activeTab === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario de Equipos */}
            <div className="bg-gradient-to-br from-red-900 to-red-800 p-8 rounded-2xl border-4 border-red-500">
              <h3 className="text-2xl font-black text-white mb-6 text-center">
                {equipoId ? '✏️ EDITAR EQUIPO' : '➕ NUEVO EQUIPO'}
              </h3>
              
              <form onSubmit={equipoId ? handleEditEquipo : saveEquipo} className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">Nombre del Equipo</label>
                  <input
                    type="text"
                    value={nombreEquipo}
                    onChange={(e) => setNombreEquipo(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-red-400 rounded-lg text-white focus:border-red-300"
                    placeholder="Ej: Team JavaScript"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Imagen (Emoji)</label>
                  <input
                    type="text"
                    value={imagenEquipo}
                    onChange={(e) => setImagenEquipo(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-red-400 rounded-lg text-white focus:border-red-300"
                    placeholder="Ej: 🟨 🟦 🟩"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Puntuación</label>
                  <input
                    type="number"
                    value={puntuacionEquipo}
                    onChange={(e) => setPuntuacionEquipo(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-red-400 rounded-lg text-white focus:border-red-300"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg font-bold"
                  >
                    {equipoId ? '✏️ Actualizar' : '💾 Guardar'}
                  </button>
                  
                  {equipoId && (
                    <button
                      type="button"
                      onClick={() => {
                        clearEquipoForm();
                        setActiveTab("list");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Formulario de Jugadores */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-2xl border-4 border-blue-500">
              <h3 className="text-2xl font-black text-white mb-6 text-center">
                {jugadorId ? '✏️ EDITAR JUGADOR' : '➕ NUEVO JUGADOR'}
              </h3>
              
              <form onSubmit={jugadorId ? handleEditJugador : saveJugador} className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">Número de Jugador</label>
                  <input
                    type="number"
                    value={numeroJugador}
                    onChange={(e) => setNumeroJugador(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-blue-400 rounded-lg text-white focus:border-blue-300"
                    placeholder="Ej: 456"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Equipo</label>
                  <select
                    value={equipoJugador}
                    onChange={(e) => setEquipoJugador(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-blue-400 rounded-lg text-white focus:border-blue-300"
                    required
                  >
                    <option value="">Seleccionar equipo...</option>
                    {equipos.map(equipo => (
                      <option key={equipo._id} value={equipo._id}>
                        {equipo.imagen} {equipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Puntuación</label>
                  <input
                    type="number"
                    value={puntuacionJugador}
                    onChange={(e) => setPuntuacionJugador(e.target.value)}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-blue-400 rounded-lg text-white focus:border-blue-300"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-bold"
                  >
                    {jugadorId ? '✏️ Actualizar' : '💾 Guardar'}
                  </button>
                  
                  {jugadorId && (
                    <button
                      type="button"
                      onClick={() => {
                        clearJugadorForm();
                        setActiveTab("list");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black bg-opacity-50 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-3xl text-red-400">🏆</div>
              <div className="text-2xl font-black text-white">{equipos.length}</div>
              <div className="text-red-300 font-mono text-sm">Equipos</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-blue-400">👥</div>
              <div className="text-2xl font-black text-white">{jugadores.length}</div>
              <div className="text-blue-300 font-mono text-sm">Jugadores</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-green-400">🎯</div>
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-green-300 font-mono text-sm">Juegos</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl text-purple-400">⚙️</div>
              <div className="text-2xl font-black text-white">ADMIN</div>
              <div className="text-purple-300 font-mono text-sm">Panel</div>
            </div>
          </div>
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
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

export default AdminPanel;