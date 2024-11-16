import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Main menu keyboard
const mainKeyboard = {
  reply_markup: {
    keyboard: [
      ['📝 Button 1', '🎮 Button 2'],
      ['📊 Button 3', '⚙️ Settings']
    ],
    resize_keyboard: true
  }
};

// Inline keyboard example
const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Option 1', callback_data: 'option1' },
        { text: 'Option 2', callback_data: 'option2' }
      ],
      [{ text: 'More Info', callback_data: 'more_info' }]
    ]
  }
};

// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Welcome! Choose an option from the menu below:',
    mainKeyboard
  );
});

// Handle regular keyboard buttons
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  switch (msg.text) {
    case '📝 Button 1':
      bot.sendMessage(chatId, 'You pressed Button 1', inlineKeyboard);
      break;
    case '🎮 Button 2':
      bot.sendMessage(chatId, 'You pressed Button 2');
      break;
    case '📊 Button 3':
      bot.sendMessage(chatId, 'You pressed Button 3');
      break;
    case '⚙️ Settings':
      bot.sendMessage(chatId, 'Settings menu:', inlineKeyboard);
      break;
  }
});

// Handle inline keyboard callbacks
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  
  switch (query.data) {
    case 'option1':
      bot.sendMessage(chatId, 'You selected Option 1');
      break;
    case 'option2':
      bot.sendMessage(chatId, 'You selected Option 2');
      break;
    case 'more_info':
      bot.sendMessage(chatId, 'Here is more information...');
      break;
  }
  
  // Answer the callback query to remove the loading state
  bot.answerCallbackQuery(query.id);
});

console.log('Bot is running...');