const randomArrayItem = array => array[Math.floor(Math.random() * array.length)]

const messageFromChannels = (message, channels) =>
  channels.includes(message.channel)

const messageFromAnyThread = message =>
  message.thread_ts !== undefined

const messageHasMentions = (message) => {
  const mentionsRegex = /<@(.*?)>/

  return mentionsRegex.test(message.text)
}

const messageFromGeneralChannel = message => (
  process.env.generalChannelId
    ? messageFromChannels(message, [process.env.generalChannelId])
    : true
)

module.exports = {
  randomArrayItem,
  messageFromAnyThread,
  messageHasMentions,
  messageFromGeneralChannel,
}
