import TelegramBot from 'node-telegram-bot-api';
import { defaultButtons, buttonResponses } from '../config/buttons.js';
import { OllamaService } from '../services/ollama.js';

export class BotManager {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.ollama = new OllamaService();
    this.setupHandlers();
  }

  getMainKeyboard() {
    return {
      reply_markup: {
        keyboard: defaultButtons.mainMenu,
        resize_keyboard: true
      }
    };
  }

  getInlineKeyboard() {
    return {
      reply_markup: {
        inline_keyboard: defaultButtons.inlineOptions
      }
    };
  }

  async handleAIResponse(chatId, message) {
    try {
      const response = await this.ollama.generateResponse(message);
      await this.bot.sendMessage(chatId, response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      await this.bot.sendMessage(chatId, 'Sorry, I encountered an error while processing your request.');
    }
  }

  setupHandlers() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        'Welcome! Choose an option from the menu below or send me a message to chat with AI:',
        this.getMainKeyboard()
      );
    });

    this.bot.onText(/\/models/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const models = await this.ollama.getModels();
        const modelList = models.map(model => `- ${model.name}`).join('\n');
        await this.bot.sendMessage(chatId, `Available models:\n${modelList}`);
      } catch (error) {
        await this.bot.sendMessage(chatId, 'Sorry, I could not fetch the available models.');
      }
    });

    this.bot.on('message', async (msg) => {
      if (!msg.text) return;
      const chatId = msg.chat.id;
      
      // Handle predefined button responses
      const buttonResponse = buttonResponses.get(msg.text);
      if (buttonResponse) {
        await this.bot.sendMessage(
          chatId,
          buttonResponse,
          msg.text === '📝 Button 1' || msg.text === '⚙️ Settings' ? this.getInlineKeyboard() : undefined
        );
        return;
      }

      // If not a button press, treat as a message for AI
      if (!msg.text.startsWith('/')) {
        await this.bot.sendMessage(chatId, '🤔 Thinking...');
        await this.handleAIResponse(chatId, msg.text);
      }
    });

    this.bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const response = buttonResponses.get(query.data);
      
      if (response) {
        await this.bot.sendMessage(chatId, response);
      }
      
      await this.bot.answerCallbackQuery(query.id);
    });
  }

  updateButtonResponse(buttonId, newResponse) {
    buttonResponses.set(buttonId, newResponse);
    return true;
  }

  getButtonResponses() {
    return Object.fromEntries(buttonResponses);
  }
}