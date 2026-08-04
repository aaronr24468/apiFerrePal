import { Router } from "express";
import { getListCustomers, infoCustomer, newCreditC, newCustomerC } from "../controllers/creditController.mjs";

export const router = Router();


router.post('/new/customer', newCustomerC);

router.post('/new/credit', newCreditC);

router.get('/list/customers', getListCustomers);

router.get('/info/customer/:id', infoCustomer)
