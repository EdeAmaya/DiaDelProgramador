import express from "express";
import JugadoresController from "../controllers/JugadoresController.js";
const router = express.Router();

router.route("/")
.get(JugadoresController.getJugadores)
.post(JugadoresController.insertJugadores)

router.route("/:id")
.put(JugadoresController.updateJugadores)
.delete(JugadoresController.deleteJugadores)

export default router