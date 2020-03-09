const assert = require('assert')

const { getBasicController } = require('./helpers')
const greetingController = require('../features/greeting')
const replies = require('../features/greeting/replies.js')

describe('Sample hears controller', () => {
  beforeEach(() => {
    this.controller = getBasicController()
    greetingController(this.controller)
  })

  it('returns any greeting if user types `hi`', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'hi', isAssertion: true,
      }],
    }]).then(message => assert(replies.includes(message.text)))
  })

  it('does not return any greeting if user types `Morning` in one line code block', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '`Morning`', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return any greeting if user types `Morning` in multiline code block', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '```Morning```', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return any greeting if user types a word that includes greeting word', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'they', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return any greeting if somebody mentioned', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '<@UJNAP9LQN>, hey', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return any greeting in threads', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'hey',
        isAssertion: true,
        thread_ts: '1583740417.000200',
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  context('when generalChannelId specified', () => {
    before(() => {
      process.env.generalChannelId = 'generalId'
    })

    context('when in the general channel', () => {
      it('returns any greeting if user types `hi`', async () => {
        await this.controller.usersInput([{
          type: 'message',
          channel: 'generalId',
          messages: [{
            text: 'hi', isAssertion: true,
          }],
        }]).then(message => assert(replies.includes(message.text)))
      })
    })

    context('when not in the general channel', () => {
      it('does not return any greeting if user types `hi`', async () => {
        await this.controller.usersInput([{
          type: 'message',
          channel: 'notGeneralId',
          messages: [{
            text: 'hi', isAssertion: true,
          }],
        }]).then(message => assert.deepEqual(message, {}))
      })
    })
  })
})
