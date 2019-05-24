const queries = require('./queries.js');
const replies = require('./replies.js');

const randomArrayItem = array => array[Math.floor(Math.random() * array.length)];

module.exports = (controller) => {
  controller.hears(
    queries,
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) });
    },
  );
};
