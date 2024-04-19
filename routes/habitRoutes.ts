import express, {Request} from 'express';  
const route = express.Router();  
import { readAll, create, read, update, findOne, deletee, toggleStatus, readCategoriesPerHabit} from '../controllers/habitController';
import mandatory from '../middlewares/login';


route.get('/:id_user', mandatory, read)
route.get('/all', mandatory, readAll)
route.post('/', mandatory, create);
route.get('/find/:id_habit', mandatory, findOne);
route.get('/categories_per_habit/:id_habit', mandatory, readCategoriesPerHabit);
route.patch('/:id_habit', mandatory, update);
route.patch('/status/:id_habit', mandatory, toggleStatus);
route.delete('/:id_habit', mandatory, deletee);

export default route;