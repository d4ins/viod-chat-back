import {Router} from 'express';
import Message from '../controllers/Message';

const message = Router();
const controller = new Message();

message.post('/add', controller.add);

export default message;