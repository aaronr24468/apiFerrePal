import { Router } from "express";
import { editCredit, getInfoCredit, getListCustomers, infoCustomer, installmentCredit, installmentHistory, newCreditC, newCustomerC, payoutCredit } from "../controllers/creditController.mjs";

export const router = Router();


router.post('/new/customer', newCustomerC);

router.post('/new/credit', newCreditC);

router.get('/list/customers', getListCustomers);

router.get('/info/customer/:id', infoCustomer);

router.get('/info/credit/:id', getInfoCredit)

router.put('/edit/credit', editCredit);

router.post('/installment', installmentCredit);

router.post('/payout', payoutCredit);

router.post('/installment/history', installmentHistory)