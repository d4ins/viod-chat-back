import express from 'express';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import http from 'http';
import Controller from './controller';
import Online from './models/Online';
import LoginController from './controller/LoginController';

mongoose.connect('mongodb://localhost:27017/chat-v2', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const app = express();

const PORT = 3001;

const loginController = new LoginController();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', loginController.login);

const server = http.createServer(app);
const socket = new Server(server, {
    pingInterval: 1000,
    pingTimeout: 5000
});

const controller = new Controller();

controller.start(socket);

Online.deleteMany({})
.then(() => {  
    server.listen(PORT, '192.168.1.6', () => {
        console.log(`Example app listening at http://192.168.1.6:${PORT}`);
    });
});

