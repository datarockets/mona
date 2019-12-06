const replies = require('./replies.js')

const randomArrayItem = array => array[Math.floor(Math.random() * array.length)]

module.exports = (controller) => {
  controller.on('direct_mention', async (bot, message) => {
    await bot.reply(message, randomArrayItem(replies))
  })
}
