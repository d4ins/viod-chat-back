import Chat, {IChat} from '../models/Chat';
import ChatUser, {IChatUser} from '../models/ChatUser';
import {Socket, Server} from 'socket.io';
//import Chat, {IChat} from '../models/Chat';

type ChatCreate = {
    chatName: string,
    admin: string,
    avatar: string | null,
    users: Array<string>
}

export default class ChatController {
    client: Socket
    server: Server
    constructor(client: Socket, server: Server) {
        this.client = client;
        this.server = server;
    }

    add = ({admin, avatar, chatName, users}: ChatCreate): void => {
        const chat = new Chat({admin, avatar, chatName});
        console.log(chat);
        chat.save()
            .then(({_id}: IChat) => {
                users.forEach(id => {
                    const chatUser = new ChatUser({
                        chatId: _id,
                        userId: id
                    });

                    chatUser.save();
                });
                
            })
            .catch();
    } 
    
    remove = () => {

    }

    userLeftChat = () => {

    }
}