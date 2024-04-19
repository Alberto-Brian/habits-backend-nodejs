"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const login_1 = __importDefault(require("../middlewares/login"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getMilliseconds() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const limits = { fileSize: 1024 * 1024 * 5 };
const upload = (0, multer_1.default)({ storage, limits, fileFilter });
route.get('/', login_1.default, userController_1.read);
route.post('/login', userController_1.login);
route.post('/', userController_1.create);
route.get('/find/:id_user', login_1.default, userController_1.findOne);
route.patch('/upload/:id_user', upload.single('avatar'), login_1.default, userController_1.uploadi);
route.patch('/status', login_1.default, userController_1.toggleStatus);
route.patch('/:id_user', login_1.default, upload.single('avatar'), userController_1.update);
route.delete('/:id_user', login_1.default, userController_1.deletee);
exports.default = route;
