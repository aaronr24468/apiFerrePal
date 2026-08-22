import { AppError } from "../services/appError.mjs"

export const checkRolAdmin = (req, res, next) =>{
    try {
        const rol = req.auth.rol
        if(rol !== 'Admin') throw new AppError('No tienes permisos', 402)
        next();
    } catch (error) {
        next(error)
    }
}