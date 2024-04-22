"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const connection = {
    "connectionLimit": 1000,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": 3306
};
const pool = mysql2_1.default.createPool(connection);
exports.default = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error)
                reject(error);
            if (connection) {
                connection.query(query, params, (error, result) => {
                    connection.release();
                    if (error)
                        reject(error);
                    if (result)
                        resolve(result);
                });
            }
            else {
                reject('Falha na connecção');
            }
        });
    });
};
