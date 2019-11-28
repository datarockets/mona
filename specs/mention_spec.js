const { BotMock, SlackApiMock } = require('botkit-mock')
const assert = require('assert')

const { getBasicController } = require('./helpers')
const mentionController = require('../features/mention.js')
const replies = require('../features/mention/replies')
const { removeCodeFromMessage } = require('../lib/middleware')

describe('Mention controller', () => {
  beforeEach(() => {
    this.controller = getBasicController()
    mentionController(this.controller)
  })

  it('returns one of mention responds if user mentions bot', async () => {
    await this.controller.usersInput([{
      type: 'direct_mention',
      channel: 'channel',
      messages: [{
        text: 'bot', isAssertion: true,
      }],
    }]).then(message => assert(replies.includes(message.text)))
  })
})
