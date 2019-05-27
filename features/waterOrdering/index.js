const queries = require('./queries.js')
const replies = require('./replies.js')
const { randomArrayItem } = require('../../lib')

module.exports = (controller) => {
  controller.hears(
    queries,
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) })
    },
  )
}
