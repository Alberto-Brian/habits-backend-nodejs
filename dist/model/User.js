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
exports.readForUser = exports.create_user = exports.read_users = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const auth_1 = __importDefault(require("../utils/auth"));
const hash_1 = __importDefault(require("../utils/hash"));
const read_users = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = 'SELECT * FROM users';
            const result = yield (0, mysql_1.default)(query);
            const response = {
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
            resolve(result);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.read_users = read_users;
const create_user = (req, res) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query1 = 'SELECT * FROM users WHERE email=?';
            const result1 = yield (0, mysql_1.default)(query1, [req.body.email]);
            if (result1.length > 0)
                reject('Utilizador já cadastrado');
            const query = `INSERT INTO users (user_name, email, password, profile) VALUES (?,?,?,?)`;
            const params = [req.body.user_name, req.body.email, yield (0, hash_1.default)(req.body.password), req.body.profile];
            const result = yield (0, mysql_1.default)(query, params);
            const token = yield (0, auth_1.default)(req.body.email, req.body.password);
            const response = {
                user: {
                    id_user: result.insertId,
                    name: req.body.user_name,
                    email: req.body.email,
                    profile: req.body.profile,
                },
                token: token
            };
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.create_user = create_user;
const readForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = 'SELECT * FROM habits WHERE id_user=?';
            const result = yield (0, mysql_1.default)(query, [req.params.id_user]);
            if (result.length < 1)
                reject('utilizador não encontrado');
            const response = {
                message: 'Listagem de todos habitos do utilizador',
                count: result.length,
                users: result.map((habit) => {
                    return {
                        id_user: habit.id_user,
                        id_habit: habit.id_habit,
                        habit_name: habit.name,
                        habit_description: habit.description,
                        habit_status: habit.stauts,
                        goal: habit.goal,
                        created_at: habit.created_at,
                        updated_at: habit.updated_at
                    };
                })
            };
            resolve(response.users);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.readForUser = readForUser;
