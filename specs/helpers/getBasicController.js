const { BotMock } = require('botkit-mock')
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')

const { removeCodeFromMessage } = require('../../lib/middleware')

module.exports = () => {
  const adapter = new SlackAdapter({
    clientSigningSecret: 'secret',
    botToken: 'token',
    debug: true,
  })

  adapter.use(new SlackEventMiddleware())
  adapter.use(new SlackMessageTypeMiddleware())

  const controller = new BotMock({
    adapter,
    disable_webserver: true,
  })

  controller.middleware.ingest.use(removeCodeFromMessage)

  return controller
}
