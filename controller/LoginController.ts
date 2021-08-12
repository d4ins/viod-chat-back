import bcrypt from 'bcryptjs';
import User, {IUser} from '../models/User';
import Chat, {IChat} from '../models/Chat';
import ChatUser, {IChatUser} from '../models/ChatUser';
import Online, {IOnline} from '../models/Online';
import Contact, {IContact} from '../models/Contacts';
import { Schema } from 'mongoose';
import {Request, Response} from 'express';

type loginData = {
    email: string, password: string
}

interface IRequest extends Request {
    body: loginData
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

export default class LoginController {
    login = (req: Request, res: Response): void => {
        console.log(req.body);

        this.findUser({email: req.body.email})
        .then((user: IUser) => {
            bcrypt.compare(req.body.password, user.password)
            .then((checked: boolean) => {
                if(checked) {
                    this.formateResponse(user, res);
                } else {
                    res.send({accessed: false, user: {}, chats: [], contacts: []});
                }
            })
            .catch(() => {
                res.send({accessed: false, user: {}, chats: [], contacts: []});
            });
        });
    }

    private formateResponse = (user: IUser, res: Response): void => {
        // const online = new Online({
        //     socketId: this.client.id,
        //     userId: user._id
        // });
        //online.save();
        this.findChats(user)
            .then((chats) => {
                this.findContacts(user)
                .then((contacts) => {
                    res.send({
                        accessed: true,
                        user: this._transformUser(user),
                        contacts,
                        chats
                    });
                })
                .catch(() => {
                    res.send({
                        accessed: true,
                        user: this._transformUser(user),
                        chats,
                        contacts: []
                    });
                });
            })
            .catch(() => {
                this.findContacts(user)
                .then((contacts) => {
                    res.send({
                        accessed: true,
                        user: this._transformUser(user),
                        chats: [],
                        contacts
                    });
                })
                .catch(() => {
                    res.send({
                        accessed: true,
                        user: this._transformUser(user),
                        chats: [],
                        contacts: []
                    });
                });
            });
    }

    private findUser = (filter: filterType): Promise<IUser> => {
        return User.findOne(filter).exec();
    }

    private findChats = (user: IUser): Promise<Array<Chat>> => {
        return ChatUser.find({userId: user._id})
        .then((chatUsers: Array<IChatUser>) => {
            const chatId = chatUsers.map(chatUser => chatUser.chatId);
            
            return Chat.find({_id: chatId})
                .then((chats: Array<IChat>) => {
                    return chats.map(chat => {
                        const index = chatUsers.findIndex(({chatId}) => chatId.toString() === chat._id.toString());
                        return {
                            chatName: chat.chatName,
                            avatart: chat.avatar,
                            id: chat._id,
                            admin: chat.admin,
                            ...this._transformChat(chatUsers[index])
                        }; 
                    });
                });
        });      
    }

    private findContacts = (user: IUser): Promise<Array<userForRes & {online: boolean}>> => {
        return Contact.find({userId: user._id})
        .then((contacts: Array<IContact>) => {
            const contactId = contacts.map(({contactId}) => contactId);
            return User.find({_id: contactId});
        })
        .then((contacts: Array<IUser>) => {
            return Online.find({userId: contacts.map(({_id}) => _id)})
            .then((onlines: Array<IOnline>) => {
                const usersOnline = onlines.map(({userId}) => userId);

                return contacts.map(contact => ({
                    ...this._transformUser(contact),
                    online: usersOnline.findIndex((id) => contact._id.toString() === id.toString()) > 0
                }));
            });
        });    
    }

    private _transformChat = ({fixed, soundOn}: IChatUser): chatForRes => {
        return {
            fixed,
            soundOn
        };
    }

    private _transformUser = ({avatar, desc, email, fullName, _id}: IUser): userForRes => ({
        avatar,
        desc,
        email,
        fullName,
        id: _id
    })
}