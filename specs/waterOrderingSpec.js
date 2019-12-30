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

  it('declined order if no respect', async () => {
    const { text } = await this.controller.usersInput([{
      type: 'direct_mention',
      channel: 'channel',
      messages: [{
        text: 'mona order water',
        isAssertion: true,
      }],
    }])
    assert(replies.noRespect.includes(text))
  })

  it('returns any confirmation if user types `mona order water please`', async () => {
    const { text } = await this.controller.usersInput([{
      type: 'direct_mention',
      channel: 'channel',
      messages: [{
        text: 'mona order water please',
        isAssertion: true,
      }],
    }])
    assert(replies.good.includes(text))
  })
})
