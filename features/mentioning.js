const responsesOnName = [
  "I'm listening",
  'How can I help?',
  'Yeap? :smile:',
  'Mm? :smile:',
  "I'm here :smile:",
];

module.exports = (controller) => {
  controller.on('direct_mention', async (bot, message) => {
    await bot.reply(message, responsesOnName[Math.floor(Math.random() * responsesOnName.length)]);
  });
};
