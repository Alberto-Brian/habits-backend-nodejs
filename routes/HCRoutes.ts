import express, {Request} from 'express';  
const route = express.Router();  
import { create_habit, create_category} from '../controllers/habits_categoriesController';
import mandatory from '../middlewares/login';

route.post('/habit', mandatory, create_habit);
route.post('/category', mandatory, create_category);

export default route;