const randomArrayItem = array => array[Math.floor(Math.random() * array.length)];

const queries = [
  'Hello',
  'Good morning',
  'G\'day',
  '\^Hi\$',
  'Morning',
  'Hey',
];

const replies = [
  'Hey!',
  'Morning, :smiley:',
  'Nice... :smiley:',
  'Hello! :smiley:',
  'Hi, how are you?',
];

module.exports = (controller) => {
  controller.hears(
    queries,
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) });
    },
  );
};
