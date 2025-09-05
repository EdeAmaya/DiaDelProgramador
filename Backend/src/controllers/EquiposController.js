const equiposController = {};
import equiposModel from "../models/Equipos.js"

// Select 
equiposController.getEquipos = async (req, res) => {
    const equipos = await equiposModel.find()
    res.json(equipos)
};

//insert
equiposController.insertEquipos = async (req, res) => {
    const {nombre, imagen, puntuacion} = req.body;
    const newEquipos = new equiposModel({nombre, imagen, puntuacion})

    await newEquipos.save()
    res.json({message: "Equipo saved"});
};

//delete 
equiposController.deleteEquipos = async (req, res) => {
    await equiposModel.findByIdAndDelete(req.params.id);
    res.json({message: "Equipo Deleted"})
}; 

//update 
equiposController.updateEquipos = async (req, res) => {
    const {nombre, imagen, puntuacion} = req.body;
    const updatedEquipos = await equiposModel.findByIdAndUpdate(req.params.id, {nombre, imagen, puntuacion}, {new: true})

    res.json({message: "Updated Equipo"})
};

export default equiposController;