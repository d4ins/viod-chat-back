import { Request, Response } from 'express';
import UserModel, {IUser} from '../models/User';
import ChatUserModel, {IChatUser} from '../models/ChatUser';
import ChatModel, {IChat} from '../models/Chat';
import MessageModel, {IMessage} from '../models/Message';
import ContactModel, {IContact} from '../models/Contact';
import OnlineModel, {IOnline} from '../models/Online';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

type transformedChat = {
    chatName: string,
    admin: Schema.Types.ObjectId,
    avatar: string,
    fixed: boolean,
    soundOn: boolean,
    id: Schema.Types.ObjectId,
    users: {
        
    }
    messages: Array<{
        text: string,
        id: Schema.Types.ObjectId,
        created: Date,
        fixed: boolean,
        userId: Schema.Types.ObjectId
    }>   
}

type transformedUser = {
    fullName: string,
    email: string,
    desc: string,
    avatar: string,
    id: Schema.Types.ObjectId
}

export default class Login {
    login = (req: Request<any, any, {email: string, password: string}>, res: Response): void => {
        const {email, password} = req.body;

        UserModel.findOne({email})
        .then((user: IUser) => {
            if (user) {
                bcrypt.compare(password, user.password)
                .then((check: boolean) => {
                    if(check) {
                        this.findChats(user._id)
                        .then(chats => {
                            this.findContacts(user._id)
                            .then(contacts => {
                                res.send({
                                    accessed: true,
                                    user: this._transformUser(user),
                                    chats,
                                    contacts
                                });
                            });
                        });
                    } else {
                        res.send({check: false});
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                    res.send({accessed: false});
                });
            } else {
                res.send({accessed: false});
            }
        })
        .catch((error: any) => {
            console.log(error);
            res.send({accessed: false});
        });
    }


    private findContacts = (id: Schema.Types.ObjectId): Promise<Array<transformedUser & {online: boolean}>> => (
        ContactModel.find({contactId: id})
        .then((contacts: Array<IContact>) => {
            const ids = contacts.map(({contactId}) => contactId);

            return UserModel.find({_id: ids})
            .then((users: Array<IUser>) => {
                const ids = users.map(({_id}) => _id);
                return OnlineModel.find({_id: ids})
                .then((onlines: Array<IOnline>) => {
                    return users.map((user) => {
                        const online = onlines.findIndex(({userId}) => userId.toString() === user._id.toString()) > -1;

                        return {
                            ...this._transformUser(user),
                            online
                        };
                    });
                })
                .catch((error: any) => console.log(error));
            })
            .catch((error: any) => console.log(error));
        })
        .catch((error: any) => console.log(error))
    )



    private findChats = (id: Schema.Types.ObjectId): Promise<Array<transformedChat>> => (
        ChatUserModel.find({userId: id})
        .then((chatUsers: Array<IChatUser>) => {
            const chatIds = chatUsers.map(({chatId}) => chatId);
            const userId = chatUsers.map(({userId}) => userId);

            return ChatModel.find({_id: chatIds})
            .then((chats: Array<IChat>) => {
                return UserModel.find({_id: userId})
                .then((users: Array<IUser>) => {
                    return OnlineModel.find({userId})
                    .then((onlines: Array<IOnline>) => {
                        const transformUsers = users.map(user => {
                            const online = onlines.findIndex(({userId}) => userId.toString() === user._id.toString()) > -1;

                            return {
                                ...this._transformUser(user),
                                online
                            };
                        });

                        return MessageModel.find({chatId: chatIds})
                        .then((messages: Array<IMessage>) => this._transformChat(chatUsers, chats, messages, transformUsers))
                        .catch((error: any) => console.log(error));
                    })
                    .catch((error: any) => console.log(error));
                })
                .catch((error: any) => console.log(error));
            })
            .catch((error: any) => console.log(error));
        })
        .catch((error: any) => console.log(error))
    )

    private _transformUser = (user: IUser): transformedUser => ({
        fullName: user.fullName,
        avatar: user.avatar,
        email: user.email,
        id: user._id,
        desc: user.desc
    })

    private _transformChat = (chatUsers: Array<IChatUser>, chats: Array<IChat>, messages: Array<IMessage>, users: Array<transformedUser & {online: boolean}>): Array<transformedChat> => (
        chats.map(({chatName, admin, avatar, _id}) => {
            const chatUserIndex = chatUsers.findIndex(({chatId}) => chatId.toString() === _id.toString());
            const {fixed, soundOn} = chatUsers[chatUserIndex];
            const findedMessages = messages.filter(({chatId}) => chatId.toString() === _id.toString());
            const findedUsers = users.filter(({id}) => {
                const findedChatUsers = chatUsers.filter(({userId}) => userId.toString() === id.toString());

                return findedChatUsers.findIndex(({chatId}) => chatId.toString() === _id.toString()) > -1;
            });

            return {
                chatName,
                admin,
                avatar,
                fixed,
                soundOn,
                id: _id,
                users: findedUsers,
                messages: findedMessages.map((message) => ({
                    text: message.text,
                    id: message._id,
                    created: message.created,
                    fixed: message.fixed,
                    userId: message.userId
                }))
            };
        })
    )
}