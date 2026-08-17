import { connection } from "../services/mysqlConnection.mjs";

export const registerU = async(username, password, rol) =>{
    const query = `INSERT INTO users(username, password, rol) values(?,?,?)`;
    const [response] = await connection.query(query, [username, password, rol]);
    return(response.affectedRows === 1);
}

export const getUserValidation = async(data) =>{
    const query = 'SELECT id, rol, password, username from users WHERE username=?';
    const [user] = await connection.query(query, [data.username])
    return(user);
}