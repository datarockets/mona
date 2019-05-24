const responsesOnMentioning = require('./responses/mentioning')

function getRandomElementFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

module.exports = (controller) => {
  controller.on('direct_mention', async (bot, message) => {
    await bot.reply(message, getRandomElementFrom(responsesOnMentioning))
  })
}
