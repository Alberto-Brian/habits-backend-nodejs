import express, {Request} from 'express';  
const route = express.Router();
import multer from 'multer';   
import { login, create, read, update, findOne, uploadi, deletee, toggleStatus } from '../controllers/userController';
import mandatory from '../middlewares/login';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getMilliseconds() + file.originalname);
    }    
})

const fileFilter = (req: Request, file: any, cb: any) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const limits = {fileSize: 1024 * 1024 * 5};   
const upload = multer({storage, limits, fileFilter});

route.get('/', mandatory, read);
route.post('/login', login);
route.post('/', create);
route.get('/find/:id_user', mandatory, findOne);
route.patch('/upload/:id_user',upload.single('avatar'), mandatory, uploadi);
route.patch('/status', mandatory, toggleStatus);
route.patch('/:id_user', mandatory, upload.single('avatar'), update);
route.delete('/:id_user', mandatory, deletee);

// module.exports  = route;
export default route;