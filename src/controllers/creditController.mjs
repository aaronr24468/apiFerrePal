import { editCreditCustomer, getHistoryInstallments, getInfoC, getInfoCustomer, getListC, getListProductCredit, installmentCreditCustomer, newCredit, newCustomer, payoutCreditCustomerStatus } from "../models/creditModels.mjs";
import {AppError} from '../services/appError.mjs';


export const newCustomerC = async(req, res, next) =>{
    try {
        const {name, phone, address} = req.body;

        if(!name.length || !phone.length || !address.length){
            throw new AppError('Faltan datos', 403)
        }

        const answer = await newCustomer(name, phone, address);

        if(!answer) throw new AppError('no se pudo registar el usuario', 403);
        
        res.json({ok: true, message: 'success'})
    } catch (error) {
        next(error)
    }
}

export const newCreditC = async(req, res, next) =>{
    try {
        const {id_customer, listSelected, totalCredit} = req.body;

        console.log(listSelected, totalCredit)

        const answer = await newCredit(id_customer, listSelected, totalCredit);

        //acomodar que tenemos que mandar el due_date (fecha limite para el credito) en mysql y mandarlo desde el front

        if(!answer) throw new AppError("Parece que ocurrio un error al registrar el credito", 403);

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
        const customerInfo = data.customer[0]
        res.json({ok: true, message: 'Success', customer: customerInfo, credits: data.credits.reverse()})
    } catch (error) {
        next(error)
    }
}

export const getInfoCredit = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const data = await getInfoC(id);
        const products = await getListProductCredit(id)//obtenemos la informacion de los productos 
        products.forEach((element) =>{ //ciclamos para separar el texto en array para cada imagen y seleccionamos solo el index 0
            const arrImages = element.images.split(',')
            element.image = arrImages[0]
        })
        const credit = data[0]
        res.json({ok: true, message: 'Success', info: credit, listP: products})
    } catch (error) {
        next(error)
    }
}

export const editCredit = async(req, res, next) =>{
    try {
        const {id, amount, description} = req.body
        const answer = await editCreditCustomer(amount, description, id);
        if(!answer) throw new AppError('Error al actualizar datos', 403);
        res.json({ok: true, message: 'Se agregaron productos con exito'});
    } catch (error) {
        next(error)
    }
}

export const installmentCredit = async(req, res, next) =>{
    try {
        const{id_credit, id_customer, amount} = req.body;

        if(!amount.length || amount == '0') throw new AppError('Se necesita digitar un valor', 402)

        const numberInput = !isNaN(Number(amount));

        if(!numberInput) throw new AppError('La cantidad no es numerico', 408)

        const creditData = await getInfoC(id_credit)

        const credit = creditData[0]

        const total_debt = Number(credit.amount) - Number(credit.Installment);

        if(Number(amount) > total_debt || (total_debt - Number(amount)) === 0) throw new AppError('No puedes abonar mas de lo que se debe o liquidar', 405)

        if(!amount.length) throw new AppError('Falta cantidad', 403);

        const answer = await installmentCreditCustomer(id_credit, id_customer, amount, 'Abono')

        if(!answer) throw new AppError('Error al guardar abono, intentelo de nuevo', 401);
        res.json({ok: true, message: 'Success'})
    } catch (error) {
        next(error)
    }
}

export const payoutCredit = async(req, res, next) =>{
    try {
        const{id_credit, id_customer} = req.body;
        const creditData = await getInfoC(id_credit);
        const credit = creditData[0]
        const total_amount = Number(credit.amount) - Number(credit.Installment);
        console.log(total_amount)
        const answer = await installmentCreditCustomer(id_credit, id_customer, total_amount, 'Liquidado');
        if(!answer) throw new AppError('Error al liquidar cuenta', 403);
        console.log(id_credit)
        const statusCredit = await payoutCreditCustomerStatus(id_credit);
        if(!statusCredit) throw new AppError('Error al cambiar status del credito', 405)
        res.json({ok: true, message: 'Success'})
    } catch (error) {
        next(error)
    }
}

export const installmentHistory = async(req, res, next) =>{
    try {
        const{id_credit, id_customer} = req.body;
        console.log(id_credit, id_customer)
        const history = await getHistoryInstallments(id_credit,id_customer);
        if(history.length === 0) throw new AppError('No existen registros', 403);
        res.json({ok: true, message: 'Success', data: history})
    } catch (error) {
        next(error)
    }
}