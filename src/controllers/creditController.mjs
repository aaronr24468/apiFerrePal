import { getInfoCustomer, getListC, newCredit, newCustomer } from "../models/creditModels.mjs";
import {AppError} from '../services/appError.mjs';


export const newCustomerC = async(req, res, next) =>{
    try {
        const {name, phone, address} = req.body;

        const answer = await newCustomer(name, phone, address);

        if(!answer) throw new AppError('no se pudo registar el usuario', 403);
        
        res.json({ok: true, message: 'success'})
    } catch (error) {
        next(error)
    }
}

export const newCreditC = async(req, res, next) =>{
    try {
        const {id_customer, amount, description} = req.body;

        const answer = await newCredit(id_customer, amount, description);

        //acomodar que tenemos que mandar el due_date (fecha limite para el credito) en mysql y mandarlo desde el front

        if(!answer) throw new AppError("No se pudo crear el registro del credito", 403);

        res.json({ok: true, message: 'success'});
    } catch (error) {
        next(error)
    }
}

export const getListCustomers = async(req, res, next) =>{
    try {
        const list = await getListC();
        if(list.length === 0) throw new AppError('No tienen clientes');
        res.json({ok: true, message: 'Success', data: list})
    } catch (error) {
        next(error)
    }
}

export const infoCustomer = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const data = await getInfoCustomer(id);
        res.json({ok: true, message: 'Success', customer: data.customer, credits: data.credits})
    } catch (error) {
        next(error)
    }
}