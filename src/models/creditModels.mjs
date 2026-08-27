import { connection } from '../services/mysqlConnection.mjs';

export const newCustomer = async (full_name, phone_Number, address) => {
    const query = 'INSERT INTO customers(full_name, phone_Number, address) values(?,?,?)';
    const [answer] = await connection.query(query, [full_name, phone_Number, address]);
    return (answer.affectedRows === 1);
}

export const newCredit = async (id_customer, listSelected, totalCredit) => {
    const connect = await connection.getConnection();
    try {
        await connect.beginTransaction();

        const query = `INSERT INTO credit(id_customer)values(?)`
        const [answer] = await connect.query(query, [id_customer]);

        const id_credit = answer.insertId;
        const affectedR = answer.affectedRows;

        if (affectedR !== 1) {
            await connect.rollback();
            return (false)
        }

        for (const element of listSelected) {
            const query = `INSERT INTO credit_products(id_credit, id_product, quantity) values(?,?,?)`
            const [answerProduct] = await connect.query(query, [id_credit, element.id_product, element.quantity])
        };

        await connect.commit();
        return (true)

    } catch (error) {
        await connect.rollback();
        throw error
    } finally {
        connect.release();
    }
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
    c.status,
    c.updated_at,
    prod.total_amount AS amount,
    COALESCE(inst.total_installment, 0) AS Installment
FROM credit c 
-- Subconsulta para calcular el monto total de productos por crédito
LEFT JOIN (
    SELECT 
    cp.id_credit, 
    SUM(pd.precio * cp.quantity) AS total_amount,
    GROUP_CONCAT(CONCAT(pd.nombre) SEPARATOR ",") AS list_products
    FROM credit_products cp
    INNER JOIN products pd ON cp.id_product = pd.id
    GROUP BY cp.id_credit
) prod ON c.id = prod.id_credit
-- Subconsulta para calcular el total abonado por crédito
LEFT JOIN (
    SELECT id_credit, SUM(installment_amount) AS total_installment
    FROM installment_history
    GROUP BY id_credit
) inst ON c.id = inst.id_credit
WHERE c.id_customer = ?`, [id]);

    return ({ customer, credits })
}

export const getInfoC = async (id) => {
    const query = `SELECT 
    c.id,
    c.id_customer,
    c.create_at, 
    prod.total_amount as amount,
    COALESCE(inst.total_installment, 0) AS Installment,
    prod.list_products,
    c.status,
    c.updated_at
    FROM credit c 
	LEFT JOIN(
		SELECT 
        cp.id_credit,
        SUM(precio * quantity) as total_amount,
        GROUP_CONCAT(CONCAT(pd.nombre, "-- (", cp.quantity," ", pd.unidad_medida,")") SEPARATOR ",") AS list_products
        FROM credit_products as cp
        INNER JOIN products as pd on cp.id_product = pd.id
        GROUP BY cp.id_credit
    ) prod on c.id = prod.id_credit
    LEFT JOIN (
		SELECT id_credit, SUM(installment_amount) as total_installment
        FROM installment_history as ih
        GROUP BY id_credit
    ) inst ON c.id = inst.id_credit
    WHERE c.id=?`
    const [data] = await connection.query(query, [id])
    return (data)
}

export const editCreditCustomer = async (amount, description, id) => {

    const connect = await connection.getConnection();

    try {

        await connect.beginTransaction();

        const query = `INSERT INTO update_credit(id_credit, amount, description_update)values(?,?,?)`;
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
    } finally {
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

export const getHistoryInstallments = async (id_credit, id_customer) => {
    const query = 'SELECT * FROM installment_history WHERE id_credit=? AND id_customer=?';
    const [data] = await connection.query(query, [id_credit, id_customer])
    return (data)
}

export const getListProductCredit = async(id) =>{
    const query2 = `SELECT 
    cp.id,
    cp.id_product,
    pd.nombre,
    pd.codigo_barras,
    cp.quantity,
    cp.quantity as kg,
    pd.unidad_medida,
    pd.precio,
    pd.marca,
    group_concat(ip.url separator ", ") as images
    from credit_products as cp
    LEFT JOIN products as pd on cp.id_product = pd.id
    LEFT JOIN images_products as ip on pd.id = ip.id_product
    where cp.id_credit=?
    group by cp.id;`
    const [info_credit] = await connection.query(query2, [id]) 

    return(info_credit)
}