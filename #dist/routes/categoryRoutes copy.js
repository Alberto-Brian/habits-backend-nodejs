"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const categoryController_1 = require("../controllers/categoryController");
const login_1 = __importDefault(require("../middlewares/login"));
route.get('/all', login_1.default, categoryController_1.readAll);
route.get('/:id_category', login_1.default, categoryController_1.read);
route.post('/', login_1.default, categoryController_1.create);
route.get('/:id_category', login_1.default, categoryController_1.findOne);
route.patch('/:id_category', login_1.default, categoryController_1.update);
route.delete('/:id_category', login_1.default, categoryController_1.deletee);
exports.default = route;
