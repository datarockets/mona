const assert = require('assert')

const { getBasicController, rewiremock } = require('./helpers')
const { sendgridMock, httpsMock } = require('./mocks')
const replies = require('../features/waterOrdering/replies.js')

rewiremock('@sendgrid/mail').with(sendgridMock())
rewiremock('https').callThrough().with(httpsMock())

rewiremock.enable()
const waterOrderingController = require('../features/waterOrdering')

rewiremock.disable()

describe('Water ordering controller', () => {
  beforeEach(() => {
    this.controller = getBasicController()
    waterOrderingController(this.controller)
  })

  it('returns any confirmation if user types `mona order water`', async () => {
    const { text } = await this.controller.usersInput([{
      type: 'message',
      channel: 'channel',
      messages: [{
        text: 'mona order water',
        isAssertion: true,
      }],
    }])

    assert(replies.good.includes(text))
  })
})
