// Backend/src/routes/Auth.js
import express from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.route("/login")
.post(AuthController.login)

export default router