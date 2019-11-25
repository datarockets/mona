const { BotMock, SlackApiMock } = require('botkit-mock')
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')
const assert = require('assert')

const greetingController = require('../features/greeting')
const replies = require('../features/greeting/replies.js')
const { removeCodeFromMessage } = require('../lib/middleware')

describe('Sample hears controller', () => {
  beforeEach(() => {
    const adapter = new SlackAdapter({
      clientSigningSecret: "secret",
      botToken: "token",
      debug: true
    })

    adapter.use(new SlackEventMiddleware())
    adapter.use(new SlackMessageTypeMiddleware())

    this.controller = new BotMock({
      adapter: adapter,
      disable_webserver: true
    });

    this.controller.middleware.ingest.use(removeCodeFromMessage)

    SlackApiMock.bindMockApi(this.controller)
    greetingController(this.controller)
  })

  it(
    'Should return any greeting if user types `hi`', async () => {
      await this.controller.usersInput([{
        type: 'message',
        channel: 'channel',
        messages: [{
          text: 'hi', isAssertion: true,
        }],
      }]).then(message => assert(replies.includes(message.text)))
  })

  it(
    "Shouldn't return any greeting if user types Morning in one line code block", async () => {
      await this.controller.usersInput([{
        type: 'message',
        channel: 'channel',
        messages: [{
          text: '`Morning`', isAssertion: true,
        }],
      }]).then(message => assert.deepEqual(message, {}))
  })

  it(
    "Shouldn't return any greeting if user types Morning in multiline code block", async () => {
      await this.controller.usersInput([{
        type: 'message',
        channel: 'channel',
        messages: [{
          text: '```Morning```', isAssertion: true,
        }],
      }]).then(message => assert.deepEqual(message, {}))
  })
})
