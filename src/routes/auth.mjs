import { Router } from "express";
import { LoginUser, registerUser } from "../controllers/authController.mjs";

export const router = Router();

router.post('/register', registerUser);

router.post('/login', LoginUser);

