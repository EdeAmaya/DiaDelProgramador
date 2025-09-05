import {Schema, model} from "mongoose";

const EquiposSchema = new Schema({
    nombre: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        require: true
    },
    puntuacion: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Equipos", EquiposSchema);