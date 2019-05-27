const assert = require('assert')
const Botmock = require('botkit-mock')

const waterOrderingController = require('../features/waterOrdering')
const replies = require('../features/waterOrdering/replies.js')

describe('Water ordering controller', () => {
  beforeEach(() => {
    this.controller = Botmock({})
    this.bot = this.controller.spawn({ type: 'slack' })
    waterOrderingController(this.controller)
  })

  it(
    'Should return any confirmation if user types `mona order water`',
    () => {
      this.bot.usersInput([{
        messages: [{
          text: 'mona order water', isAssertion: true,
        }],
      }]).then(message => assert(replies.includes(message.text)))
    },
  )
})
