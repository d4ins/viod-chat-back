import {Schema, model} from 'mongoose';

const OnlineSchema = new Schema({
    socketId: {
        type: String,
        required: 'is Required'
    },
    userId: {
        type: String,
        required: 'is Required'
    }
});

const OnlineModel = model('Online', OnlineSchema);


export interface IOnline {
    _id: Schema.Types.ObjectId,
    socketId: string,
    userId: Schema.Types.ObjectId
}

export default OnlineModel;