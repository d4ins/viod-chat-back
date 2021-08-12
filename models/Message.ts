import {model, Schema} from 'mongoose';

const MessageSchema = new Schema({
    text: {
        type: String,
        required: 'Text is required'
    },
    userId: {
        type: Schema.Types.ObjectId,
        reuired: 'User id is required'
    },
    chatId: {
        type: Schema.Types.ObjectId,
        reuired: 'Chat id is required'
    },
    created: {
        type: Schema.Types.Date,
        required: 'Created is required'
    },
    fixed: {
        type: Boolean,
        default: false
    }
});

const Message = model('Message' ,MessageSchema);

export interface IMessage {
    text: string,
    chatId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    fixed: boolean,
    created: Date
}

export default Message;