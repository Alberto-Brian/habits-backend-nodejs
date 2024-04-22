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
exports.readCategoriesPerHabit = exports.toggleStatus = exports.deletee = exports.update = exports.findOne = exports.readAll = exports.read = exports.create = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const User_1 = require("../model/User");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `INSERT INTO habits (id_user, name, description, goal) VALUES (?,?,?,?)`;
        const params = [req.body.user.id_user, req.body.name, req.body.description, req.body.goal];
        const result = yield (0, mysql_1.default)(query, params);
        const response = {
            message: 'Hábito cadastrado com sucesso!!',
            id_user: result.insertId,
            name: req.body.name,
            description: req.body.description,
            status: 'não concluido',
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
        const query = 'SELECT * FROM habits WHERE id_user=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_user]);
        const users = yield (0, User_1.readForUser)(req, res);
        const response = {
            message: 'Listagem de todos habitos do utilizador',
            count: result.length,
            users: users
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
        const query = 'SELECT * FROM habits';
        const result = yield (0, mysql_1.default)(query);
        const response = {
            message: 'Listagem de todos habitos cadastrados',
            count: result.length,
            habits: result.map((habit) => {
                return {
                    id_habit: habit.id_habit,
                    id_user: habit.id_user,
                    habit_name: habit.name,
                    habit_description: habit.description,
                    habit_status: habit.stauts,
                    goal: habit.goal,
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
        const query = 'SELECT * FROM habits WHERE id_habit=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_habit]);
        if (result.length < 1)
            return res.status(500).send({ error: 'habito não encontrado' });
        const response = {
            habit: {
                id_habit: result[0].id_habit,
                id_user: result[0].id_user,
                habit_name: result[0].name,
                habit_description: result[0].description,
                status: result[0].status,
                goal: result[0].goal,
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
        const query = `UPDATE habits SET name=?, description=?, goal=? WHERE id_habit=?`;
        const params = [req.body.name, req.body.description, req.body.goal, req.params.id_habit];
        const result = yield (0, mysql_1.default)(query, params);
        if (result.length < 1)
            return res.status(500).send({ error: 'Habito não econtrado' });
        const response = {
            message: 'Habito actualizado com sucesso',
            id_user: req.body.id_user,
            id_habit: req.body.id_habit,
            habit_name: req.body.name,
            habit_description: req.body.description,
            habit_status: req.body.stauts,
            goal: req.body.goal
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
        const query1 = 'SELECT * FROM habits WHERE id_habit=?';
        const search = yield (0, mysql_1.default)(query1, [req.params.id_habit]);
        if (search.length === 0)
            return res.status(500).send({ error: 'Habito não encontrado!!' });
        const query = 'DELETE FROM habits WHERE id_habit=?';
        yield (0, mysql_1.default)(query, [req.params.id_habit]);
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
            const query1 = 'SELECT * FROM habits WHERE id_habit = ?';
            const result = yield (0, mysql_1.default)(query1, [req.params.id_habit]);
            if (result.length < 1)
                return res.status(404).send({ message: 'habito não encontrado' });
            const query = 'UPDATE habits SET status = ? WHERE id_habit=?';
            yield (0, mysql_1.default)(query, [state, req.params.id_habit]);
            const response = {
                messagem: 'alterado!!',
                id_habit: req.params.id_habit,
                status: state
            };
            return res.status(200).send({ response });
        }
        catch (error) {
            return res.status(500).send({ error });
        }
    });
    if (set_reset) {
        up('concluido');
    }
    else {
        up('não concluido');
    }
    set_reset = !set_reset;
};
exports.toggleStatus = toggleStatus;
const readCategoriesPerHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query0 = 'SELECT name FROM habits WHERE id_habit=?';
        const habit_name = yield (0, mysql_1.default)(query0, [req.params.id_habit]);
        const query = 'SELECT * FROM habits_categories WHERE id_habit=? and id_user=?';
        const result = yield (0, mysql_1.default)(query, [req.params.id_habit, req.body.user.id_user]);
        0;
        let results = [];
        for (let i of result) {
            const querys = 'SELECT * FROM categories WHERE id_category=?';
            const one = yield (0, mysql_1.default)(querys, i.id_category);
            results.push(one[0]);
        }
        const response = {
            message: 'Listagem de todas categorias relacionadas à um hábito',
            count: results.length,
            id_user: req.body.user.id_user,
            id_habit: req.params.id_habit,
            habit_name: habit_name[0].name,
            categories: results.map((category) => {
                return {
                    id_category: category.id_category,
                    category_name: category.name,
                };
            })
        };
        return res.status(200).send({ response });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.readCategoriesPerHabit = readCategoriesPerHabit;
