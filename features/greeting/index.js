const queries = require('./queries.js')
const replies = require('./replies.js')
const { randomArrayItem } = require('../../lib')

module.exports = (controller) => {
  const matchKeys = queries.join('|')
  const regexp = new RegExp(`\\b(${matchKeys})\\b`, 'i')

  controller.hears(
    regexp,
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) })
    },
  )
}
