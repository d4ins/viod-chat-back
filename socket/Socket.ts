import http from 'http';
import {Express} from 'express';
import { Server, Socket } from 'socket.io';

export default class Controller {
    serverSocket: Server
    clients: Array<Socket> = []

    constructor (server: http.Server) {
        this.serverSocket = new Server(server, {
            pingInterval: 1000,
            pingTimeout: 5000
        });

        this.serverSocket.on('connection', (client: Socket) => {
            this.clients.push(client);
            client.on('userOnline', () => {

            });

            client.on('disconnect', () => {
                const index = this.clients.findIndex(({id}) => client.id === id);

                this.clients = [...this.clients.slice(0, index), ...this.clients.slice(0, index + 1)];
            });
        });
    }

    
} 