"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const habits_categoriesController_1 = require("../controllers/habits_categoriesController");
const login_1 = __importDefault(require("../middlewares/login"));
route.post('/habit', login_1.default, habits_categoriesController_1.create_habit);
route.post('/category', login_1.default, habits_categoriesController_1.create_category);
exports.default = route;
