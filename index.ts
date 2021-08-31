import mongoose from 'mongoose';
import server from './app';

mongoose.connect('mongodb://localhost:27017/chat-v3', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const PORT = 3001;


server.listen(PORT, '192.168.1.4', () => {
    console.log(`Example app listening at http://192.168.1.4:${PORT}`);
});
