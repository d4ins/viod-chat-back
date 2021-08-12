import {Socket, Server} from 'socket.io';
import Contacts, {IContact} from '../models/Contacts';

export default class ContactsController {
    client: Socket
    server: Server
    constructor(client: Socket, server: Server) {
        this.client = client;
        this.server = server;
    }

    add = ({userId, contactId}: {userId: string, contactId: string}): void => {
        const contact = new Contacts({
            userId, contactId
        });

        contact.save();
    }

    remove = () => {

    }
}