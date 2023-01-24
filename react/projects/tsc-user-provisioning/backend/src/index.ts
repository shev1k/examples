require('dotenv').config();

import '@/models';
import '@/services/mail.service';
import Server from './Server';

const server = new Server();
server.listen();
