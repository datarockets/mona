const assert = require('assert')

const { getBasicController } = require('./helpers')
const feelingMyself = require('../features/feelingMyself')
const replies = require('../features/feelingMyself/replies.js')

describe('Feeling myself controller', () => {
  beforeEach(() => {
    this.controller = getBasicController()
    feelingMyself(this.controller)
  })

  it('replies to message if user types `I feel myself badly`', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'I feel myself', isAssertion: true,
      }],
    }]).then(message => assert(replies.includes(message.text)))
  })

  it('creates a thread on replying if user types `I feel myself`', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'I feel myself', isAssertion: true, ts: 'message-ts',
      }],
    }]).then(message => assert.strictEqual(message.conversation.thread_ts, 'message-ts'))
  })

  it('does not reply if user types `I feel bad`', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'I feel bad', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return anything if user `feel myself` in one line code block', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '`feel myself`', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('does not return anything if user types `feel myself` in multiline code block', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '```feel myself```', isAssertion: true,
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })

  it('replies if somebody mentioned', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: '<@UJNAP9LQN>, I feel myself bad', isAssertion: true,
      }],
    }]).then(message => assert(replies.includes(message.text)))
  })

  it('does not return anything in threads', async () => {
    await this.controller.usersInput([{
      type: 'message',
      channel: 'channelId',
      messages: [{
        text: 'I feel myself',
        isAssertion: true,
        thread_ts: '1583740417.000200',
      }],
    }]).then(message => assert.deepEqual(message, {}))
  })
})
