
type dbConnection = {
    connectionLimit: number,
    user: string,
    password: string,
    database: string,
    host: string,
    port: number
};

import mysql from 'mysql2';
const connection: dbConnection = {
    "connectionLimit": 1000,
    "user": process.env.DB_USER!,
    "password": process.env.DB_PASSWORD!,
    "database": process.env.DB_NAME!,
    "host": process.env.DB_HOST!,
    "port": 3306
};

const pool = mysql.createPool(connection)


export default (query: string, params:string[]=[]) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if(error) reject(error);
            if(connection){
                connection.query(query, params, (error, result) => {
                    connection.release();
                    if(error) reject(error);
                    if(result) resolve(result);
                })
            } else {
                reject('Falha na connecção');
            }
        })
    })
}