const responsesOnMentioning = [
  "I'm listening",
  'How can I help?',
  'Yeap? :smile:',
  'Mm? :smile:',
  "I'm here :smile:",
];

function getRandomElementFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = (controller) => {
  controller.on('direct_mention', async (bot, message) => {
    await bot.reply(message, getRandomElementFrom(responsesOnMentioning));
  });
};
