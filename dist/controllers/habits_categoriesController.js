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
exports.create_category = exports.create_habit = void 0;
const mysql_1 = __importDefault(require("../mysql"));
const create_habit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `INSERT INTO habits_categories (id_habit, id_category, id_user)
                               VALUES (?,?,?)`;
        for (let id of req.body.list) {
            yield (0, mysql_1.default)(query, [req.body.id_habit, id, req.body.user.id_user]);
        }
        return res.status(200).send({ message: 'cadastrado com sucesso!!' });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.create_habit = create_habit;
const create_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `INSERT INTO habits_categories (id_habit, id_category, id_user)
                               VALUES (?,?,?)`;
        for (let id of req.body.list) {
            yield (0, mysql_1.default)(query, [id, req.body.id_category, req.body.user.id_user]);
        }
        return res.status(200).send({ message: 'cadastrado com sucesso!!' });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});
exports.create_category = create_category;
