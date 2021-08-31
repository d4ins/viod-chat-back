import {Router} from 'express';
import User from '../controllers/User';

const user = Router();
const controller = new User();

user.post('/add', controller.add);

export default user;