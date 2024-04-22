"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opcional = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
exports.default = (req, res, next) => {
    var _a, _b, _c;
    try {
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : '';
        const decode = jsonwebtoken_1.default.verify(token, (_c = process.env.JWT_KEY) !== null && _c !== void 0 ? _c : '');
        req.body.user = decode;
        next();
    }
    catch (error) {
        return res.status(500).send({ error: 'Falha na autenticação' });
    }
};
const opcional = (req, res, next) => {
    var _a, _b, _c;
    try {
        const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : '';
        const decode = jsonwebtoken_1.default.verify(token, (_c = process.env.JWT_KEY) !== null && _c !== void 0 ? _c : '');
        next();
    }
    catch (error) {
        next();
    }
};
exports.opcional = opcional;
