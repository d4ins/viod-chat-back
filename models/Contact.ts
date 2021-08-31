import {model, Schema} from 'mongoose';

const ContactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: 'User id is required'
    },
    contactId: {
        type: Schema.Types.ObjectId,
        required: 'Contact id is required'
    },
});

const ContactModel = model('Contacts', ContactSchema);

export interface IContact {
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    contactId: Schema.Types.ObjectId
}

export default ContactModel;