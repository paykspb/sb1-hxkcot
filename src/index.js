import dotenv from 'dotenv';
import { BotManager } from './bot/bot.js';
import { APIServer } from './api/server.js';

dotenv.config();

const token = process.env.BOT_TOKEN;
const botManager = new BotManager(token);
const apiServer = new APIServer(botManager);

apiServer.start();
console.log('Bot and API server are running...');