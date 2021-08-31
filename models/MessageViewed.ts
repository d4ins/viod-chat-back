import {model, Schema} from 'mongoose';

const MessageViewedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: 'User id is required'
    },
    messageId: {
        type: Schema.Types.ObjectId,
        required: 'Chat id is required'
    },
});

const MessageViewedModel = model('MessageViewed', MessageViewedSchema);

export default MessageViewedModel;