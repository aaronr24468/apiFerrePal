import { connection } from "../services/mysqlConnection.mjs";

export const authenticateUser = async(id) =>{
    const query = 'SELECT id FROM users WHERE id=?';
    const [asnwer] = await connection.query(query, [id]);
    return(asnwer[0].id === id)
}

export const getInfoUser = async(id) =>{
    const query = 'SELECT username FROM users WHERE id=?';
    const [data] =  await connection.query(query, [id])
    return(data)
}