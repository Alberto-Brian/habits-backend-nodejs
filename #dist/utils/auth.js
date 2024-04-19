"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mysql_1 = __importDefault(require("../mysql"));
exports.default = (email, password) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'SELECT * FROM users WHERE email=?';
        const results = yield (0, mysql_1.default)(query, [email]);
        if (results.length < 1) {
            reject('email não encontrado!!');
            return;
        }
        bcrypt_1.default.compare(password, results[0].password, (error, result) => {
            if (error)
                reject(error);
            const token = jsonwebtoken_1.default.sign({
                id_user: results[0].id_user,
                user_name: results[0].user_name,
                email: email,
                profile: results[0].profile,
                path_avatar: results[0].avatar
            }, 'secret', {
                expiresIn: '6h'
            });
            if (result)
                resolve(token);
            reject('Senha inválida');
        });
    }));
};
