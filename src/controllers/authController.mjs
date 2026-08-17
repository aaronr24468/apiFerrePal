import { getUserValidation, registerU } from '../models/authModels.mjs';
import {AppError} from '../services/appError.mjs';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config();

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

        if(validUser.length === 0 ) throw new AppError('Usuario no Encontrado', 403);

        if(data.username !== validUser[0].username) throw new AppError('Usuario no valido', 405)

        const checkPassword = await bcrypt.compare(data.password, validUser[0].password)

        if(!checkPassword) throw new AppError('Contraseña no coincide', 405)

        delete validUser[0].password;
        delete validUser[0].username;

        const payload = validUser[0];

        const token = jwt.sign(payload, `${process.env.SECRETJWT}`,{
            expiresIn: "1d"
        });

        res.cookie('creditToken', token,{
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true
        })

        res.json({ok: true, message: 'Success Login'})

    } catch (error) {
        next(error)
    }
}

