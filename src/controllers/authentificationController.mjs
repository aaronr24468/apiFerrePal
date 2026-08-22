import { authenticateUser, getInfoUser } from "../models/authentificationModel..mjs";
import { AppError } from "../services/appError.mjs";

export const checkAuth = async(req, res, next) =>{
    try {
        const id = req.auth.id;
        
        const answer = await authenticateUser(id);
        
        if(!answer) throw new AppError('Usuario no valido')

        res.json({ok: true, message: 'success'})
    } catch (error) {
        next(error)
    }
}

export const infoUser = async(req, res, next) =>{
    try {   
        const id = req.auth.id;
        const user = await getInfoUser(id)
        const username = user[0].username;
        res.json({ok: true, message: 'User Success', user: user})
    } catch (error) {
        next(error)
    }
}

export const logOut = (req, res, next) =>{
    try {
        res.clearCookie('creditToken',{
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true
        })
        res.json({ok:true, message: 'success'})
    } catch (error) {
        next(error)
    }
}