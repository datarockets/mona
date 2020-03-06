const queries = require('./queries.js')
const replies = require('./replies.js')
const {
  randomArrayItem,
  messageFromChannels,
  messageFromAnyThread,
  messageHasMentions,
} = require('../../lib')

const shouldGreet = (message) => {
  const notFromThread = !messageFromAnyThread(message)
  const noMentions = !messageHasMentions(message)
  const fromAllowableChannel = process.env.generalChannelId
    ? messageFromChannels(message, [process.env.generalChannelId])
    : true

  return fromAllowableChannel && notFromThread && noMentions
}

module.exports = (controller) => {
  const matchKeys = queries.join('|')
  const regexp = new RegExp(`\\b(${matchKeys})\\b`, 'i')

  controller.hears(
    regexp,
    ['message', 'direct_message'],
    async (bot, message) => {
      if (shouldGreet(message)) {
        await bot.reply(message, { text: randomArrayItem(replies) })
      }
    },
  )
}
