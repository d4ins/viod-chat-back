import {model, Schema} from 'mongoose';

const ChatUserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: 'User id is required'
    },
    chatId: {
        type: Schema.Types.ObjectId,
        required: 'Chat id is required'
    },
    fixed: {
        type: Boolean,
        default: false
    },
    soundOn: {
        type: Boolean,
        default: true
    },
});

const ChatUserModel = model('ChatUser', ChatUserSchema);

export interface IChatUser {
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    chatId: Schema.Types.ObjectId,
    fixed: boolean,
    soundOn: boolean,
}

export default ChatUserModel;