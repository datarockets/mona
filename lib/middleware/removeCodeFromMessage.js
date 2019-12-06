module.exports = (bot, message, next) => {
  if (message.text) message.text = message.text.replace(/ *`[^)]*` */g, '')

  next()
}
