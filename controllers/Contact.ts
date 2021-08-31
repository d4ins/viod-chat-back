import { Request, Response } from 'express';
import ContactModel, {IContact} from '../models/Contact';

export default class Contacts {

    add = (req: Request<any, any, {userId: string, contactId: string}>, res: Response): void => {
        const {userId, contactId} = req.body;

        const contact = new ContactModel({
            userId, contactId
        });

        contact.save()
            .then(() => {


                //TODO: Доробити відправку через сокети контакту що він був добавлений до користувача



                res.send({
                    created: true,
                    id: contact._id
                });
            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    created: false
                });
            });
    }

    remove = (req: Request<any, any, {userId: string, contactId: string}>, res: Response): void => {
        const {userId, contactId} = req.body;

        ContactModel.findOneAndRemove({userId, contactId})
            .then((contact: IContact) => {



                res.send({
                    removed: true,
                    id: contact._id
                });
            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    removed: false
                });
            });
    }
}