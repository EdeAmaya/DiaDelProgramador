import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useDataSquidGames = () => {
    const API_EQUIPOS = "http://localhost:4000/api/equipos";
    const API_JUGADORES = "http://localhost:4000/api/jugadores";
    
    const [activeTab, setActiveTab] = useState("list");
    const [equipos, setEquipos] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Estados para formularios de equipos
    const [equipoId, setEquipoId] = useState("");
    const [nombreEquipo, setNombreEquipo] = useState("");
    const [imagenEquipo, setImagenEquipo] = useState("");
    const [puntuacionEquipo, setPuntuacionEquipo] = useState("");

    // Estados para formularios de jugadores
    const [jugadorId, setJugadorId] = useState("");
    const [numeroJugador, setNumeroJugador] = useState("");
    const [equipoJugador, setEquipoJugador] = useState("");
    const [puntuacionJugador, setPuntuacionJugador] = useState("");

    // Función para obtener equipos
    const fetchEquipos = async () => {
        try {
            const response = await fetch(API_EQUIPOS);
            if (!response.ok) {
                throw new Error("Error al obtener equipos");
            }
            const data = await response.json();
            setEquipos(data.sort((a, b) => b.puntuacion - a.puntuacion));
        } catch (error) {
            console.error("Error fetching equipos:", error);
            toast.error("Error al cargar equipos");
        }
    };

    // Función para obtener jugadores
    const fetchJugadores = async () => {
        try {
            const response = await fetch(API_JUGADORES);
            if (!response.ok) {
                throw new Error("Error al obtener jugadores");
            }
            const data = await response.json();
            setJugadores(data.sort((a, b) => b.puntuacion - a.puntuacion));
        } catch (error) {
            console.error("Error fetching jugadores:", error);
            toast.error("Error al cargar jugadores");
        }
    };

    // Función principal para obtener todos los datos
    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchEquipos(), fetchJugadores()]);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Guardar nuevo equipo
    const saveEquipo = async (e) => {
        e.preventDefault();
        
        if (!nombreEquipo || !imagenEquipo || !puntuacionEquipo) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            const newEquipo = {
                nombre: nombreEquipo,
                imagen: imagenEquipo,
                puntuacion: parseInt(puntuacionEquipo)
            };

            const response = await fetch(API_EQUIPOS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEquipo),
            });

            if (!response.ok) {
                throw new Error("Error al registrar equipo");
            }

            toast.success('Equipo registrado exitosamente');
            clearEquipoForm();
            fetchEquipos();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al registrar equipo");
        }
    };

    // Eliminar equipo
    const deleteEquipo = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este equipo?")) {
            return;
        }

        try {
            const response = await fetch(`${API_EQUIPOS}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar equipo");
            }

            toast.success('Equipo eliminado exitosamente');
            fetchEquipos();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al eliminar equipo");
        }
    };

    // Preparar equipo para edición
    const updateEquipo = (equipo) => {
        setEquipoId(equipo._id);
        setNombreEquipo(equipo.nombre);
        setImagenEquipo(equipo.imagen);
        setPuntuacionEquipo(equipo.puntuacion.toString());
        setActiveTab("form");
    };

    // Editar equipo
    const handleEditEquipo = async (e) => {
        e.preventDefault();

        if (!nombreEquipo || !imagenEquipo || !puntuacionEquipo) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            const editEquipo = {
                nombre: nombreEquipo,
                imagen: imagenEquipo,
                puntuacion: parseInt(puntuacionEquipo)
            };

            const response = await fetch(`${API_EQUIPOS}/${equipoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editEquipo),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar equipo");
            }

            toast.success('Equipo actualizado exitosamente');
            clearEquipoForm();
            setActiveTab("list");
            fetchEquipos();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar equipo");
        }
    };

    // Guardar nuevo jugador
    const saveJugador = async (e) => {
        e.preventDefault();
        
        if (!numeroJugador || !equipoJugador || !puntuacionJugador) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            const newJugador = {
                numero: parseInt(numeroJugador),
                equipo: equipoJugador,
                puntuacion: parseInt(puntuacionJugador)
            };

            const response = await fetch(API_JUGADORES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newJugador),
            });

            if (!response.ok) {
                throw new Error("Error al registrar jugador");
            }

            toast.success('Jugador registrado exitosamente');
            clearJugadorForm();
            fetchJugadores();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al registrar jugador");
        }
    };

    // Eliminar jugador
    const deleteJugador = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este jugador?")) {
            return;
        }

        try {
            const response = await fetch(`${API_JUGADORES}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar jugador");
            }

            toast.success('Jugador eliminado exitosamente');
            fetchJugadores();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al eliminar jugador");
        }
    };

    // Preparar jugador para edición
    const updateJugador = (jugador) => {
        setJugadorId(jugador._id);
        setNumeroJugador(jugador.numero.toString());
        setEquipoJugador(jugador.equipo._id);
        setPuntuacionJugador(jugador.puntuacion.toString());
        setActiveTab("form");
    };

    // Editar jugador
    const handleEditJugador = async (e) => {
        e.preventDefault();

        if (!numeroJugador || !equipoJugador || !puntuacionJugador) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            const editJugador = {
                numero: parseInt(numeroJugador),
                equipo: equipoJugador,
                puntuacion: parseInt(puntuacionJugador)
            };

            const response = await fetch(`${API_JUGADORES}/${jugadorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editJugador),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar jugador");
            }

            toast.success('Jugador actualizado exitosamente');
            clearJugadorForm();
            setActiveTab("list");
            fetchJugadores();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar jugador");
        }
    };

    // Limpiar formulario de equipos
    const clearEquipoForm = () => {
        setEquipoId("");
        setNombreEquipo("");
        setImagenEquipo("");
        setPuntuacionEquipo("");
    };

    // Limpiar formulario de jugadores
    const clearJugadorForm = () => {
        setJugadorId("");
        setNumeroJugador("");
        setEquipoJugador("");
        setPuntuacionJugador("");
    };

    // Cargar datos iniciales y configurar actualización automática
    useEffect(() => {
        fetchData();
        
        // Actualización automática cada 5 segundos (como Mario Kart)
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return {
        // Estados generales
        activeTab,
        setActiveTab,
        equipos,
        jugadores,
        loading,
        lastUpdate,

        // Estados de formularios equipos
        equipoId,
        nombreEquipo,
        setNombreEquipo,
        imagenEquipo,
        setImagenEquipo,
        puntuacionEquipo,
        setPuntuacionEquipo,

        // Estados de formularios jugadores
        jugadorId,
        numeroJugador,
        setNumeroJugador,
        equipoJugador,
        setEquipoJugador,
        puntuacionJugador,
        setPuntuacionJugador,

        // Funciones de equipos
        fetchEquipos,
        saveEquipo,
        deleteEquipo,
        updateEquipo,
        handleEditEquipo,
        clearEquipoForm,

        // Funciones de jugadores
        fetchJugadores,
        saveJugador,
        deleteJugador,
        updateJugador,
        handleEditJugador,
        clearJugadorForm,

        // Funciones generales
        fetchData
    };
};

export default useDataSquidGames;