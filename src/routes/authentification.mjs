import { Router } from "express";
import { checkAuth, infoUser, logOut } from "../controllers/authentificationController.mjs";
import {checkRolAdmin} from '../middleware/checkRol.mjs'


export const router = Router();

router.get('/',checkRolAdmin, checkAuth);

router.post('/logout', logOut);

router.get('/info/user', infoUser)