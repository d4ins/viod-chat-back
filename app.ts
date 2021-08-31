import express from 'express';
import http from 'http';
import Socket from './socket/Socket';
import Login from './controllers/Login';
import user from './routes/user';
import chat from './routes/chat';
import contact from './routes/contact';
import message from './routes/message';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const login = new Login();

app.post('/login', login.login);
app.use('/user', user);
app.use('/chat', chat);
app.use('/contact', contact);
app.use('/message', message);

const server = http.createServer(app);

export const socket = new Socket(server);

export default server;


