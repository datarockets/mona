const replies = require('./replies.js')
const {
  randomArrayItem,
  messageFromAnyThread,
  messageFromGeneralChannel,
} = require('../../lib')

const shouldMessage = (message) => {
  const notFromThread = !messageFromAnyThread(message)
  const fromAllowableChannel = messageFromGeneralChannel(message)

  return fromAllowableChannel && notFromThread
}

const REGEXP = /\bfeel(ing)? myself\b/ig

module.exports = (controller) => {
  controller.hears(
    REGEXP,
    ['message', 'direct_message'],
    async (bot, message) => {
      if (shouldMessage(message)) {
        await bot.replyInThread(message, {
          text: randomArrayItem(replies),
        })
      }
    },
  )
}
