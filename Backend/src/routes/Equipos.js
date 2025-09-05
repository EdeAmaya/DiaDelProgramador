import express from "express";
import EquiposController from "../controllers/EquiposController.js";
const router = express.Router();

router.route("/")
.get(EquiposController.getEquipos)
.post(EquiposController.insertEquipos)

router.route("/:id")
.put(EquiposController.updateEquipos)
.delete(EquiposController.deleteEquipos)

export default router