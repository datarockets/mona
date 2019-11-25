const { BotMock, SlackApiMock } = require('botkit-mock')
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')
const assert = require('assert')

const mentionController = require('../features/mention.js')
const replies = require('../features/mention/replies')
const adapter = require('../bot.js')
const { removeCodeFromMessage } = require('../lib/middleware')

describe('Mention controller', () => {
  beforeEach(() => {
    const adapter = new SlackAdapter({
      clientSigningSecret: "secret",
      botToken: "token",
      debug: true
    });

    adapter.use(new SlackEventMiddleware());
    adapter.use(new SlackMessageTypeMiddleware());

    this.controller = new BotMock({
      adapter: adapter,
      disable_webserver: true
    });

    this.controller.middleware.ingest.use(removeCodeFromMessage);

    SlackApiMock.bindMockApi(this.controller)
    mentionController(this.controller)
  })

  it(
    'should return one of mention responds if user mentions bot', async () => {
      await this.controller.usersInput([{
        type: 'direct_mention',
        channel: 'channel',
        messages: [{
          text: 'bot', isAssertion: true,
        }],
      }]).then(message => assert(replies.includes(message.text)))
  })
})
