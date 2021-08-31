import bcrypt from 'bcryptjs';
import UserModel, {IUser} from '../models/User';
import { Response, Request } from 'express';

type UserCreate = {
    fullName: string,
    email: string,
    password: string,
    avatar: string,
    desc: string
}

export default class User {
    add = (req: Request<any, any, UserCreate>, res: Response): void => {
        const {avatar, desc, email, fullName, password} = req.body;

        UserModel.findOne({email})
        .then((user: IUser) => {
            if (!user) {
                return true;
            }
        })
        .catch((error: any) => {
            console.log(error),

            res.send({
                created: false
            });
        })
        .then((found: boolean) => {
            if (found) {
                bcrypt.hash(password, 10)
                .then(password => {
                    const user = new UserModel({
                        email, 
                        password,
                        avatar, 
                        desc,
                        fullName
                    });

                    user.save()
                    .then(() => {
                        res.send({
                            created: true,
                            id: user._id
                        });
                    });
                });
            }
        })
        .catch((error: any) => {
            console.log(error),

            res.send({
                created: false
            });
        });

    }

    remove = (req: Request<any, any, {id: string}>, res: Response): void => {
        const {id} = req.body;

        UserModel.findByIdAndRemove(id)
            .then((user: IUser) => {

                //TODO: Доробити відправку всім що користувач видалений через сокети


                res.send({
                    removed: true,
                    id: user._id
                });
            })
            .catch((error: any) => {
                console.log(error);

                res.send({
                    removed: false
                });
            });
    }

    change = (): void => {
        
    }
}