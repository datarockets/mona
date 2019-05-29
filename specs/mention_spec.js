const assert = require('assert')
const Botmock = require('botkit-mock')

const mentionController = require('../features/mention.js')
const replies = require('../features/mention/replies')

describe('Mention controller', () => {
  beforeEach(() => {
    this.controller = Botmock({})
    this.bot = this.controller.spawn({ type: 'slack' })
    mentionController(this.controller)
  })

  it(
    'should return one of mention responds if user mentions bot',
    () => {
      this.bot.usersInput([{
        type: 'direct_mention',
        messages: [{
          text: 'bot', isAssertion: true,
        }],
      }]).then(message => assert(replies.includes(message.text)))
    },
  )
})