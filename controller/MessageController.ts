import { Schema } from 'mongoose';
import { Socket, Server } from 'socket.io';
import Message, {IMessage} from '../models/Message';

type dataForMessage = {
    text: string,
    userId: Schema.Types.ObjectId,
    chatId: Schema.Types.ObjectId,
    created: Date
}

export default class MessageController {
    client: Socket
    server: Server

    constructor(client: Socket, server: Server) {
        this.client = client;
        this.server = server;
    }


    add = ({text, userId, created, chatId}: dataForMessage): void => {
        console.log(created);
        const message = new Message({
            text,
            userId,
            chatId,
            created
        });

        message.save();
    }

    remove = () => {

    }

    change = () => {

    }

    viewed = () => {

    }


}