import { Socket, Server} from 'socket.io';
import ConnectionController from './ConnectionController';
import ChatController from './ChatController';
import UserController from './UserController';
import MessageController from './MessageController';
import ContactsController from './ContactsController';


export default class Controller {
    start = (server: Server): void => {
        server.on('connection', (client: Socket) => { 
            this.connection(client, server);
            this.chatController(client, server);
            this.userController(client, server);
            this.chatController(client, server);
            this.contactsController(client, server);
            this.messagController(client, server);
        });
    } 

    private messagController = (client: Socket, server: Server): void => {
        const controller = new MessageController(client, server);

        client.on('messageAdd', controller.add);//* Here
        client.on('messageRemove', controller.remove); //! Зробити
        //client.on('messageViewed', controller.viewed);
        //client.on('messageChange', controller.change);
    }
    private contactsController = (client: Socket, server: Server): void => {
        const controller = new ContactsController(client, server);

        client.on('contactAdd', controller.add); //*
        client.on('contactRemove', controller.remove);//! Зробити
        //client.on('UserLeftChat', controller.userLeftChat);

    }

    private userController = (client: Socket, server: Server): void => {
        const controller = new UserController(client, server);

        client.on('register', controller.add); 
        client.on('userRemove', controller.remove); //! Зробити
        //client.on('userChange', controller.change);
    }

    private chatController = (client: Socket, server: Server): void => {
        const controller = new ChatController(client, server);

        client.on('chatAdd', controller.add);
        client.on('chatRemove', controller.remove); //! Зробити
        //client.on('UserLeftChat', controller.userLeftChat);

    }

    private connection = (client: Socket, server: Server): void => {
        const controller = new ConnectionController(client, server);

        client.on('onlineAdd', controller.conect);     
        client.on('disconnect', controller.disconnect);
    }
}