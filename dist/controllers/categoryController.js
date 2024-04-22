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
exports.deletee = exports.update = exports.findOne = exports.readAll = exports.read = exports.create = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `INSERT INTO categories (name, description) VALUES (?,?)`;
        const params = [req.body.name, req.body.description];
        const result = yield (0, mysql_1.default)(query, params);
        const response = {
            message: 'Categoria cadastrada com sucesso!!',
            id_category: result.insertId,
            name: req.body.name,
            description: req.body.description,
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query0 = 'SELECT name FROM categories WHERE id_category=?';
        const category_name = yield (0, mysql_1.default)(query0, [req.params.id_category]);
        const query = 'SELECT * FROM habits_categories WHERE id_category=? and id_user=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_category, req.body.user.id_user]);
        let results = [];
        for (let i of result) {
            const querys = 'SELECT * FROM habits WHERE id_habit=?';
            const one = yield (0, mysql_1.default)(querys, i.id_habit);
            results.push(one[0]);
        }
        const response = {
            message: 'Listagem de todos habitos de uma categoria',
            count: results.length,
            id_user: req.body.user.id_user,
            id_category: req.params.id_category,
            category_name: category_name[0].name,
            habits: results.map((habit) => {
                return {
                    id_habit: habit.id_habit,
                    habit_name: habit.name,
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
const readAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM categories';
        const result = yield (0, mysql_1.default)(query);
        const response = {
            message: 'Listagem de todas categorias',
            count: result.length,
            users: result.map((habit) => {
                return {
                    id_category: habit.id_category,
                    habit_name: habit.name,
                    habit_description: habit.description,
                    created_at: habit.created_at,
                    updated_at: habit.updated_at
                };
            })
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.readAll = readAll;
const findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM categories WHERE id_category=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_category]);
        if (result.length < 1)
            return res.status(500).send({ error: 'categoria não encontrada' });
        const response = {
            category: {
                id_category: result[0].id_category,
                category_name: result[0].name,
                category_description: result[0].description,
                created_at: result[0].created_at,
                updated_at: result[0].updated_at
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
    try {
        const query = `UPDATE categories SET name=?, description=? WHERE id_category=?`;
        const params = [req.body.name, req.body.description, req.params.id_category];
        const result = yield (0, mysql_1.default)(query, params);
        if (result.length < 1)
            return res.status(500).send({ error: 'Categoria não econtrada' });
        const query0 = 'SELECT * FROM categories WHERE id_category=?';
        const result0 = yield (0, mysql_1.default)(query0, [req.params.id_category]);
        const response = {
            message: 'Categoria actualizada com sucesso',
            id_category: req.body.id_category,
            category_name: req.body.name,
            category_description: req.body.description,
            created_at: result0[0].created_at,
            updated_at: result0[0].updated_at
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.update = update;
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query1 = 'SELECT * FROM categories WHERE id_category=?';
        const search = yield (0, mysql_1.default)(query1, [req.params.id_category]);
        if (search.length === 0)
            return res.status(500).send({ error: 'Categoria não encontrada!!' });
        const query = 'DELETE FROM categories WHERE id_category=?';
        yield (0, mysql_1.default)(query, [req.params.id_category]);
        return res.status(200).send({});
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.deletee = deletee;
