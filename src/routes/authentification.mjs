import { Router } from "express";
import { checkAuth, infoUser, logOut } from "../controllers/authentificationController.mjs";


export const router = Router();

router.get('/', checkAuth);

router.post('/logout', logOut);

router.get('/info/user', infoUser)