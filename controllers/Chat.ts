import ChatModel, {IChat} from '../models/Chat';
import ChatUserModel, {IChatUser} from '../models/ChatUser';
import { Response, Request } from 'express';
import { Schema } from 'mongoose';

type ChatCreate = {
    chatName: string,
    admin: string,
    avatar: string,
    users: Array<string>
}

export default class ChatController {
    add = (req: Request, res: Response): void => {
        const {chatName, admin, avatar, users}: ChatCreate = req.body;

        const chat = new ChatModel({admin, avatar, chatName});
        chat.save()
            .then(() => {
                users.forEach(id => {
                    const chatUser = new ChatUserModel({
                        chatId: chat._id,
                        userId: id
                    });

                    chatUser.save();
                });


                //TODO: доробити відправку через сокети для користувачів, що додали


                res.send({
                    created: true,
                    id: chat._id
                }); 
            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    created: false,
                });
            });
    } 
    
    remove = (req: Request, res: Response): void => {
        const {id} = req.body;

        ChatModel.findByIdAndRemove(id)
            .then(({_id}: IChat) => {
                this.kikUsers(_id);


                //TODO: Доробити відправку сокетами про видалення чату


                res.send({
                    removed: true,
                    id: _id
                });
            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    removed: false
                });
            });
    }

    userLeft = (req: Request, res: Response): void => {
        const {userId, chatId} = req.body;

        ChatUserModel.findOneAndRemove({userId, chatId})
            .then(({chatId}: IChatUser) => {

                ChatModel.findById(chatId)
                    .then(({admin}: IChat) => {
                        if(admin.toString() === userId.toString()) {
                            ChatModel.remove({_id: chatId})
                                .then(() => {
                                    this.kikUsers(chatId);


                                    //TODO: Зробити відправку про видалення чату


                                    res.send({
                                        lefted: true,
                                        id: chatId
                                    });
                                });
                        } else {


                            res.send({
                                lefted: true,
                                id: chatId
                            });
                        }
                    });

                //TODO: Зробити відправку про вихід користувача


            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    lefted: false
                });
            });
    }

    private kikUsers = (id: Schema.Types.ObjectId): void => {
        ChatUserModel.find({chatId: id})
        .then((chatUsers: Array<IChatUser>) => {
            chatUsers.forEach(({_id}) => {
                ChatUserModel.findByIdAndRemove(_id)
                    .catch((error: any) => {
                        console.log(error);
                    });
            });
        });
    }
}