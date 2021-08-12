import {model, Schema} from 'mongoose';

const ChatSchema = new Schema({
    chatName: {
        type: String,
        required: 'Name is required'
    },
    admin: {
        type: Schema.Types.ObjectId,
        default: ''
    },
    avatar: {
        type: String,
        default: null
    }
});

const Chat = model('Chat' ,ChatSchema);

export interface IChat {
    chatName: string,
    admin: Schema.Types.ObjectId,
    avatar: string,
    _id: Schema.Types.ObjectId
}

export default Chat;