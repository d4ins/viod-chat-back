import {Socket, Server} from 'socket.io';
import bcrypt from 'bcryptjs';
import User, {IUser} from '../models/User';
import Chat, {IChat} from '../models/Chat';
import ChatUser, {IChatUser} from '../models/ChatUser';
import Online, {IOnline} from '../models/Online';
import Contact, {IContact} from '../models/Contacts';
import { Schema } from 'mongoose';
//import ContactsController from './ContactsController';

//TODO: Поміняти відправку для конкретних людей.


type loginData = {
    email: string, password: string
}
type userForRes = {
    email: string,
    desc: string,
    avatar: string,
    fullName: string,
    id: Schema.Types.ObjectId
}
type chatForRes = {
    soundOn: boolean,
    fixed: boolean
}

type Chat = chatForRes & {
    id: Schema.Types.ObjectId,
    chatName: string,
    admin: Schema.Types.ObjectId,
    avatar: string
}

type filterType = {email: string} | {_id: string};

export default class ConnectionController {
    client: Socket
    server: Server

    constructor(client: Socket, server: Server) {
        this.client = client;
        this.server = server;
    }

    conect = ({id}: {id: string}): void => {
        // const online = new Online({
        //     socketId: this.client.id,
        //     userId: id
        // });
        //online.save();
        //console.log(this.findChats(user));
    }

    disconnect = (): void => {
       // Online.findOneAndRemove({socketId: this.client.id});
        console.log('DISCONNECT');
    }

}