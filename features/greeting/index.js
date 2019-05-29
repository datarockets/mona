const queries = require('./queries.js')
const replies = require('./replies.js')

const randomArrayItem = array => array[Math.floor(Math.random() * array.length)]

const anyMatchesIgnoringCode = (message, queries) => {
  const messageWithoutCode = message.text.replace(/ *`[^)]*` */g, '')

  return queries.map(query => messageWithoutCode.match(new RegExp(query, 'i'))).filter(Boolean).length > 0
}

module.exports = (controller) => {
  controller.hears(
    async message => anyMatchesIgnoringCode(message, queries),
    ['message', 'direct_message'],
    async (bot, message) => {
      await bot.reply(message, { text: randomArrayItem(replies) })
    },
  )
}
