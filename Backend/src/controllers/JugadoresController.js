const jugadoresController = {};
import jugadoresModel from "../models/Jugadores.js"

// Select 
jugadoresController.getJugadores = async (req, res) => {
    const jugadores = await jugadoresModel.find().populate("equipo")
    res.json(jugadores)
};

//insert
jugadoresController.insertJugadores = async (req, res) => {
    const {numero, equipo, puntuacion} = req.body;
    const newJugadores = new jugadoresModel({numero, equipo, puntuacion})

    await newJugadores.save()
    res.json({message: "Jugador saved"});
};

//delete 
jugadoresController.deleteJugadores = async (req, res) => {
    await jugadoresModel.findByIdAndDelete(req.params.id);
    res.json({message: "Jugador Deleted"})
}; 

//update 
jugadoresController.updateJugadores = async (req, res) => {
    const {numero, equipo, puntuacion} = req.body;
    const updatedJugadores = await jugadoresModel.findByIdAndUpdate(req.params.id, {numero, equipo, puntuacion}, {new: true})

    res.json({message: "Updated Jugador"})
};

export default jugadoresController;