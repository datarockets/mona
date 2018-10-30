const reactMessages = ['^say (.*)', '^say']

const reactMessageKinds = ['direct_message', 'direct_mention']

const register = (controller) => {
  controller.hears(reactMessages, reactMessageKinds, (mona, message) => {
    const [_, userInput] = message

    mona.reply('Sorry, did you say ', `*${userInput}*`, '?')
  })
}

module.exports = register