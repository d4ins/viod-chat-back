import {Socket, Server} from 'socket.io';
import bcrypt from 'bcryptjs';
import User, {IUser} from '../models/User';

type UserCreate = {
    fullName: string,
    email: string,
    password: string,
    avatar: null | string,
    desc: null | string
}

export default class UserController {
    client: Socket
    server: Server
    constructor(client: Socket, server: Server) {
        this.client = client;
        this.server = server;
    }
    
    add = ({avatar, desc, email, fullName, password}: UserCreate): void => {
        User.findOne({email})
        .then((user: IUser) => {
            if (!user) {
                return true;
            }
        })
        .then((found: boolean) => {
            if (found) {
                bcrypt.hash(password, 10)
                .then(password => {
                    const user = new User({
                        email, 
                        password,
                        avatar, 
                        desc,
                        fullName
                    });

                    user.save();
                });
            }
        });

    }

    remove = () => {

    }

    change = () => {
        
    }
}