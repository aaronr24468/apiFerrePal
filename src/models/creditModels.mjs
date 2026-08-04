import {connection} from '../services/mysqlConnection.mjs';

export const newCustomer = async(full_name, phone_Number, address) =>{
    const query = 'INSERT INTO customers(full_name, phone_Number, address) values(?,?,?)';
    const [answer] = await connection.query(query, [full_name, phone_Number, address]);
    return(answer.affectedRows === 1);
}

export const newCredit = async(id_customer, amount, description) =>{
    const query = 'INSERT INTO credit(id_customer, amount, description) values(?,?,?)';
    const [answer] =  await connection.query(query, [id_customer, amount, description])
    return(answer.affectedRows === 1);
}

export const getListC = async() =>{
    const query = `SELECT c.id, 
    c.full_name, 
    c.phone_Number, 
    c.address, 
    count(d.id_customer) as total_creditos 
    FROM customers c LEFT JOIN credit d on c.id=d.id_customer GROUP BY c.id`;
    const [list] = await connection.query(query);
    return(list)
}

export const getInfoCustomer = async(id) =>{
    const [customer] = await connection.query(`SELECT * FROM customers WHERE id=?`, [id]);
    const [credits] = await connection.query(`Select * FROM credit WHERE id_customer=?`, [id]);

    return({customer, credits})
}