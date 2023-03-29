const replies = require('./replies.js')
const PRONOUN_DICTIONARY = require('./pronouns')
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

const availablePronouns = Object.keys(PRONOUN_DICTIONARY)
const REGEXP = new RegExp(`\\bfeel(s|ing)? (${availablePronouns.join('|')})sel(?:f|ves)\\b`, 'i')

module.exports = (controller) => {
  controller.hears(
    REGEXP,
    ['message', 'direct_message'],
    async (bot, message) => {
      const groups = message.text?.match(REGEXP) || []
      const verbEnd = groups[1]
      const pronoun = groups[2]

      if (shouldMessage(message) && pronoun) {
        await bot.replyInThread(message, {
          text: randomArrayItem(replies(PRONOUN_DICTIONARY[pronoun], verbEnd === 'ing')),
        })
      }
    },
  )
}
