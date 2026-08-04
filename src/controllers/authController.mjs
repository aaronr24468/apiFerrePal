import { getUserValidation, registerU } from '../models/authModels.mjs';
import {AppError} from '../services/appError.mjs';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10;

export const registerUser = async(req, res, next) =>{
    try {
        const{username, password} = req.body;
        const rol = 'Admin';
        const encriptPassword = await bcrypt.hash(password, saltRounds)

        const info = await registerU(username, encriptPassword, rol);

        if(!info) throw new AppError('Erro al registrar');

        res.json({ok: true, message: 'Success'})
    } catch (err) {
        next(err)
    }
}

export const LoginUser = async(req, res, next) =>{
    try {
        const data = {
            username: req.body.username,
            password: req.body.password
        }

        if(!data.username || !data.password){
            throw new AppError('Faltan datos', 403)
        }

        const validUser = await getUserValidation(data)

        if(validUser.length === 0) throw new AppError('Usuario no Encontrado');

        const payload = validUser[0];

        const token = jwt.sign(payload, 'secret',{
            expiresIn: "1d"
        });

        res.cookie('creditToken', token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        res.json({ok: true, message: 'Success Login'})

    } catch (error) {
        next(error)
    }
}

