export const defaultButtons = {
  mainMenu: [
    ['💭 Chat with AI', '🤖 Available Models'],
    ['⚙️ Settings', '❓ Help']
  ],
  inlineOptions: [
    [
      { text: 'Change AI Model', callback_data: 'change_model' },
      { text: 'Settings', callback_data: 'settings' }
    ]
  ]
};

export const buttonResponses = new Map([
  ['💭 Chat with AI', 'Send me any message and I\'ll respond using AI!'],
  ['🤖 Available Models', 'Use /models to see available AI models'],
  ['⚙️ Settings', 'Bot settings:'],
  ['❓ Help', 'You can:\n- Chat with AI by sending any message\n- Use /models to see available models\n- Use buttons for quick actions'],
  ['change_model', 'Use /models to see and select available models'],
  ['settings', 'Current settings:\n- Default model: llama2']
]);