"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const morgan_1 = __importDefault(require("morgan"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('./uploads', express_1.default.static('uploads'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'GET, PUT, POST, PATCH, DELETE');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'Origin, Content-Type, X-Requested-With, Accept, Authorization');
    }
    next();
});
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const habitRoutes_1 = __importDefault(require("./routes/habitRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const HCRoutes_1 = __importDefault(require("./routes/HCRoutes"));
app.use('/users', userRoutes_1.default);
app.use('/habits', habitRoutes_1.default);
app.use('/categories', categoryRoutes_1.default);
app.use('/hc', HCRoutes_1.default);
app.use((req, res, next) => {
    const error = new Error('Rota não encontrada');
    next(error);
});
app.use((error, req, res) => res.status(error.status || 500).send({ error: error.message }));
exports.default = app;
