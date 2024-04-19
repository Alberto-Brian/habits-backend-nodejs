import express, {Request} from 'express';  
const route = express.Router();  
import { readAll, create, read, update, findOne, deletee} from '../controllers/categoryController';
import mandatory from '../middlewares/login';


route.get('/all', mandatory, readAll)
route.get('/:id_category', mandatory, read)
route.post('/', mandatory, create);
route.get('/find/:id_category', mandatory, findOne);
route.patch('/:id_category', mandatory, update);
route.delete('/:id_category', mandatory, deletee);

export default route;