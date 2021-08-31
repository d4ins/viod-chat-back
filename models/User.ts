import {Schema, model} from 'mongoose';
import validator from 'validator';

const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email is required',
        validate: {validator: validator.isEmail, message: 'Email is invalid'}
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    fullName: {
        type: String,
        required: 'FullName is required'
    },
    avatar: {
        type: String,
        default: null 
    },
    desc: {
        type: String,
        default: null 
    }
});

const UserModel = model('User', UserSchema);


export interface IUser {
    _id: Schema.Types.ObjectId,
    email: string,
    password: string,
    fullName: string,
    avatar: string,
    desc: string
}

export default UserModel;