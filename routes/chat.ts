import { Router } from 'express';
import Chat from '../controllers/Chat';

const chat = Router();

const controller = new Chat();

chat.post('/add', controller.add);
chat.post('/remove', controller.remove);
chat.post('/userLeft', controller.userLeft);


export default chat;