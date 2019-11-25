const assert = require('assert')

const { getBasicController } = require('./helpers')
const greetingController = require('../features/greeting')
const replies = require('../features/greeting/replies.js')

describe('Sample hears controller', () => {
  beforeEach(() => {
    this.controller = getBasicController()
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
