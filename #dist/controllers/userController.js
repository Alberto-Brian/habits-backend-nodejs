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
exports.toggleStatus = exports.deletee = exports.uploadi = exports.update = exports.findOne = exports.read = exports.create = exports.login = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = __importDefault(require("../utils/auth"));
const limitlist_1 = __importDefault(require("../utils/limitlist"));
const User_1 = require("../model/User");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM users WHERE email=?';
        const user = yield (0, mysql_1.default)(query, [req.body.email]);
        if (user.length < 1)
            throw new Error('Utilizador não encontrado');
        const token = yield (0, auth_1.default)(req.body.email, req.body.password);
        return res.status(200).send({
            token: token,
            user: {
                id_user: user[0].id_user,
                user_name: user[0].user_name,
                email: user[0].email,
                profile: user[0].profile,
                status: user[0].status,
                path_avatar: user[0].avatar
            }
        });
    }
    catch (error) {
        return res.status(401).send({ error: error });
    }
});
exports.login = login;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, User_1.create_user)(req, res);
        return res.status(200).send({ response: response });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, User_1.read_users)();
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
                };
            })
        };
        console.log((0, limitlist_1.default)(response.users));
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
            user: {
                id_user: result[0].id_user,
                user_name: result[0].user_name,
                email: result[0].email,
                status: result[0].status,
                profile: result[0].profile,
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
        var _a, _b;
        if (error)
            return res.status(500).send({ error });
        try {
            const query = `UPDATE users SET user_name=?, password=?, 
                                   profile=?, avatar=? WHERE id_user =?`;
            const params = [req.body.user_name, hash, req.body.profile, (_a = req.file) === null || _a === void 0 ? void 0 : _a.path, req.params.id_user];
            const result = yield (0, mysql_1.default)(query, params);
            if (result.length < 1)
                return res.status(500).send({ error: 'Utilizador não encontrado' });
            const response = {
                message: 'Utilizador actualizado com sucesso',
                id_user: req.params.id_user,
                user_name: req.body.user_name,
                email: req.body.email,
                profile: req.body.profile,
                avatar_path: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
            };
            return res.status(200).send({ response });
        }
        catch (error) {
            return res.status(500).send({ error: error });
        }
    }));
});
exports.update = update;
const uploadi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const query = `UPDATE users SET avatar=? WHERE id_user =?`;
        const params = [(_d = (_c = req.file) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : '', req.params.id_user];
        const result = yield (0, mysql_1.default)(query, params);
        if (result.length < 1)
            return res.status(500).send({ error: 'Utilizador não encontrado' });
        const response = {
            message: 'imagem actualizada com sucesso',
            id_user: req.params.id_user,
            avatar_path: (_e = req.file) === null || _e === void 0 ? void 0 : _e.path,
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.uploadi = uploadi;
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query1 = 'SELECT * FROM users WHERE id_user=?';
        const search = yield (0, mysql_1.default)(query1, [req.params.id_user]);
        if (search.length === 0)
            return res.status(500).send({ error: 'Utilizador inexistente' });
        const query = 'DELETE FROM users WHERE id_user=?';
        yield (0, mysql_1.default)(query, [req.params.id_user]);
        return res.status(200).send({});
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.deletee = deletee;
let set_reset = true;
const toggleStatus = (req, res) => {
    const up = (state) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query1 = 'SELECT * FROM users WHERE id_user = ?';
            const result = yield (0, mysql_1.default)(query1, [req.body.user.id_user]);
            if (result.length < 1)
                return res.status(404).send({ message: 'utilizador não encontrado' });
            const query = 'UPDATE users SET status = ? WHERE id_user=?';
            yield (0, mysql_1.default)(query, [state, req.body.user.id_user]);
            const response = {
                messagem: 'alterado!!',
                id_user: req.body.user.id_user,
                status: state
            };
            return res.status(200).send({ response });
        }
        catch (error) {
            return res.status(500).send({ error });
        }
    });
    if (set_reset) {
        up(1);
    }
    else {
        up(0);
    }
    set_reset = !set_reset;
};
exports.toggleStatus = toggleStatus;
