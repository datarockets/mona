const assert = require('assert')
const Botmock = require('botkit-mock')

const greetingController = require('../features/greeting')
const replies = require('../features/greeting/replies.js')

describe('Sample hears controller', () => {
  beforeEach(() => {
    this.controller = Botmock({})
    this.bot = this.controller.spawn({ type: 'slack' })
    greetingController(this.controller)
  })

  it(
    'Should return any greeting if user types `hi`',
    () => {
      this.bot.usersInput([{
        messages: [{
          text: 'hi', isAssertion: true,
        }],
      }]).then(message => assert(replies.includes(message.text)))
    },
  )
})
