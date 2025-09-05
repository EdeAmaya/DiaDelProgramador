import {Schema, model} from "mongoose";

const JugadoresSchema = new Schema({
    numero: {
        type: Number,
        require: true,
        unique: true
    },
    equipo: {
        type: Schema.Types.ObjectId,
        ref: "Equipos",
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

export default model("Jugadores", JugadoresSchema);