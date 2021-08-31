import { Router } from 'express';
import Contact from '../controllers/Contact';

const contact = Router();

const controller = new Contact();

contact.post('/add', controller.add);
contact.post('/remove', controller.remove);

export default contact;