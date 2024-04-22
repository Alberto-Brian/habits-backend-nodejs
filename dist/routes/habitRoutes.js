"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const habitController_1 = require("../controllers/habitController");
const login_1 = __importDefault(require("../middlewares/login"));
route.get('/:id_user', login_1.default, habitController_1.read);
route.get('/all', login_1.default, habitController_1.readAll);
route.post('/', login_1.default, habitController_1.create);
route.get('/find/:id_habit', login_1.default, habitController_1.findOne);
route.get('/categories_per_habit/:id_habit', login_1.default, habitController_1.readCategoriesPerHabit);
route.patch('/:id_habit', login_1.default, habitController_1.update);
route.patch('/status/:id_habit', login_1.default, habitController_1.toggleStatus);
route.delete('/:id_habit', login_1.default, habitController_1.deletee);
exports.default = route;
