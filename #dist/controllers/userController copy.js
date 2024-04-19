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
exports.deletee = exports.update = exports.findOne = exports.read = exports.create = exports.login = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM users WHERE email=?';
        const results = yield (0, mysql_1.default)(query, [req.body.email]);
        bcrypt_1.default.compare(req.body.password, results[0].password, (error, result) => {
            if (error)
                return res.status(500).send({ error: error });
            const token = jsonwebtoken_1.default.sign({
                id_user: results[0].id_user,
                email: req.body.email
            }, 'secret', {
                expiresIn: '1h'
            });
            return res.status(200).send({
                message: 'Logado com sucesso',
                token: token
            });
        });
    }
    catch (error) {
        return res.status(401).send({ error: 'Falha na autenticação ' });
    }
});
exports.login = login;
const create = (req, res) => {
    bcrypt_1.default.hash(req.body.password, 10, (error, hash) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (error)
            return res.status(500).send({ error });
        try {
            const query1 = 'SELECT * FROM users WHERE email=?';
            const result1 = yield (0, mysql_1.default)(query1, [req.body.email]);
            if (result1.length > 0)
                return res.status(500).send({ error: 'Utilizador já cadastrado' });
            const query = `INSERT INTO users (user_name, email, password, status, profile, avatar) VALUES (?,?,?,?,?,?)`;
            const params = [req.body.user_name, req.body.email, hash, req.body.status, req.body.profile, (_a = req.file) === null || _a === void 0 ? void 0 : _a.path];
            const result = yield (0, mysql_1.default)(query, params);
            const response = {
                message: 'Utilizador criado com sucesso!!',
                id_user: result.insertId,
                user_name: req.body.user_name,
                profile: req.body.profile,
                path_avatar: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
                request: {
                    url_description: 'Listagem de todos utilizadores',
                    type_method: 'GET',
                    url: 'http:localhost:3000/users'
                }
            };
            return res.status(200).send({ response });
        }
        catch (error) {
            return res.status(500).send({ error: error + '- app' });
        }
    }));
};
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM users';
        const result = yield (0, mysql_1.default)(query);
        const response = {
            message: 'Listagem de todos usuários',
            count: result.length,
            users: result.map((user) => {
                return {
                    id_user: user.id_user,
                    user_name: user.user_name,
                    email: user.email,
                    profile: user.profile,
                    path_avatar: user.avatar,
                    request: {
                        url_description: 'Dados de um usuário específico',
                        type_method: 'GET',
                        url: 'http:localhost:3000/users/' + user.id_user
                    }
                };
            })
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.read = read;
const findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM users WHERE id_user=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_user]);
        if (result.length < 1)
            return res.status(500).send({ error: 'Utilizador não encontrado' });
        const response = {
            id_user: result[0].id_user,
            user_name: result[0].user_name,
            email: result[0].email,
            status: result[0].status,
            profile: result[0].profile,
            request: {
                url_description: 'Listagem de todos utilizadores',
                type_method: 'GET',
                url: 'http://localhost:3000/users'
            }
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.findOne = findOne;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    bcrypt_1.default.hash(req.body.password, 10, (error, hash) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (error)
            return res.status(500).send({ error });
        try {
            const query = `UPDATE users SET user_name=?, password=?, 
                           status=?, profile=?, avatar=? WHERE id_user =?`;
            const params = [req.body.user_name, hash, req.body.status, req.body.profile, (_a = req.file) === null || _a === void 0 ? void 0 : _a.path, req.params.id_user];
            const result = yield (0, mysql_1.default)(query, params);
            if (result.length < 1)
                return res.status(500).send({ error: 'Utilizador não econtrado' });
            const response = {
                message: 'Utilizador actualizado com sucesso',
                id_user: req.params.id_user,
                user_name: req.body.user_name,
                email: req.body.email,
                status: req.body.status,
                profile: req.body.profile,
                request: {
                    url_description: 'Listagem de todos utilizadores',
                    type_method: 'GET',
                    url: 'http://localhost:3000/users'
                }
            };
            return res.status(200).send({ response });
        }
        catch (error) {
            return res.status(500).send({ error: error });
        }
    }));
});
exports.update = update;
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query1 = 'SELECT * FROM users WHERE id_user=?';
        const search = yield (0, mysql_1.default)(query1, [req.params.id_user]);
        if (search.length === 0)
            return res.status(500).send({ error: 'Utilizador inexistente' });
        const query = 'DELETE FROM users WHERE id_user=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_user]);
        const response = {
            message: 'Utilizador removido com sucesso!!',
            id_user: req.params.id_user,
            request: {
                url_description: 'Listagem de todos utilizadores',
                type_method: 'GET',
                url: 'http://localhost:3000/users'
            }
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.deletee = deletee;
