
import {Request, Response} from 'express';
import MessageModel, { IMessage } from '../models/Message';
import ChatUser, {IChatUser} from '../models/ChatUser';

export default class Message {
    add = (req: Request<any, any, {text: string, userId: string, chatId: string, created: Date}>, res: Response): void => {
        const {text, userId, chatId, created} = req.body;

        const message = new MessageModel({
            text,
            userId,
            chatId,
            created
        });

        message.save()
        .then(() => {
            res.send({
                sended: true,
                id: message._id
            });
        })
        .catch((error: any) => {
            console.log(error);

            res.send({sended: false});
        });

        //TODO: Доробити віжправку всім клієнтам шо відносяться до чату через сокети

    }

    remove = (req: Request<any, any, {id: string}>, res: Response): void => {
        const {id} = req.body;
        MessageModel.findByIdAndRemove(id)
            .then(({_id, chatId}: IMessage) => {
                ChatUser.find({chatId})
                    .then((chatUsers: Array<IChatUser>) => {
                        const users = chatUsers.map(({userId}) => userId);

                        //TODO: Доробити відправки користувачам по сокету про знищення повідомлення

                        res.send({
                            removed: true,
                            messageId: _id
                        });
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