import { connection } from '../services/mysqlConnection.mjs';

export const newCustomer = async (full_name, phone_Number, address) => {
    const query = 'INSERT INTO customers(full_name, phone_Number, address) values(?,?,?)';
    const [answer] = await connection.query(query, [full_name, phone_Number, address]);
    return (answer.affectedRows === 1);
}

export const newCredit = async (id_customer, amount, description) => {
    const query = 'INSERT INTO credit(id_customer, amount, description) values(?,?,?)';
    const [answer] = await connection.query(query, [id_customer, amount, description])
    return (answer.affectedRows === 1);
}

export const getListC = async () => {
    const query = `SELECT c.id, 
    c.full_name, 
    c.phone_Number, 
    c.address, 
    count(d.id_customer) as total_creditos 
    FROM customers c LEFT JOIN credit d on c.id=d.id_customer GROUP BY c.id`;
    const [list] = await connection.query(query);
    return (list)
}

export const getInfoCustomer = async (id) => {
    const [customer] = await connection.query(`SELECT * FROM customers WHERE id=?`, [id]);
    const [credits] = await connection.query(`SELECT 
    c.id,
    c.id_customer,
    c.create_at, 
    c.amount, 
    coalesce(sum(h.installment_amount), 0, 2) as Installment, 
    c.description, 
    c.status,
    c.updated_at
    FROM credit c LEFT JOIN  installment_history h on c.id = h.id_credit WHERE c.id_customer=? GROUP BY c.id`, [id]);

    return ({ customer, credits })
}

export const getInfoC = async (id) => {
    const query = `SELECT 
    c.id,
    c.id_customer,
    c.create_at, 
    c.amount, 
    coalesce(sum(h.installment_amount), 0, 2) as Installment, 
    c.description, 
    c.status,
    c.updated_at
    FROM credit c LEFT JOIN  installment_history h on c.id = h.id_credit WHERE c.id=? GROUP BY c.id`
    const [data] = await connection.query(query, [id])
    return (data)
}

export const editCreditCustomer = async (amount, description, id) => {

    const connect = await connection.getConnection();

    try {    

        await connect.beginTransaction();

        const query = `INSERT INTO update_Credit(id_credit, amount, description_update)values(?,?,?)`;
        const [responseInsert] = await connect.query(query, [id, amount, description])

        const query2 = `UPDATE credit SET amount=amount+?, description=? WHERE id=?`;
        const [response] = await connect.query(query2, [amount, description, id])

        if (responseInsert.affectedRows === 1 && response.affectedRows === 1) {
            await connect.commit();
            return true
        } else {
            await connect.rollback();
            return false
        }

    } catch (error) {
        await connect.rollback();
        throw error
    }finally{
        connect.release();
    }

}

export const installmentCreditCustomer = async (id_credit, id_customer, amount, status) => {
    const query = `INSERT INTO installment_history(
    id_credit, 
    id_customer,
    installment_amount,
    pay_status
    ) values(?,?,?,?)`;
    const [answer] = await connection.query(query, [id_credit, id_customer, amount, status])
    return (answer.affectedRows === 1);
}

export const payoutCreditCustomerStatus = async (id_credit) => {
    const query = 'UPDATE credit SET status=? WHERE id=?';
    const [answer] = await connection.query(query, ['Pagado', id_credit])
    return (answer.affectedRows === 1)
}

export const getHistoryInstallments = async(id_credit, id_customer) =>{
    const query =  'SELECT * FROM installment_history WHERE id_credit=? AND id_customer=?';
    const [data] = await connection.query(query, [id_credit, id_customer])
    return(data)
}