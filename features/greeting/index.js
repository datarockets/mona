const queries = require('./queries.js')
const replies = require('./replies.js')
const { anyMatchesIgnoringCode } = require('../../lib/hearsCheckers')

const randomArrayItem = array => array[Math.floor(Math.random() * array.length)]

module.exports = (controller) => {
  controller.hears(
    async message => anyMatchesIgnoringCode(message, queries),
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) })
    },
  )
}
