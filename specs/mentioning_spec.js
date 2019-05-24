const assert = require('assert')
const Botmock = require('botkit-mock')
const mentioningController = require('../features/mentioning.js')
const responsesOnMentioning = require('../features/responses/mentioning')

describe('Mentioning controller', () => {
  beforeEach(() => {
    this.controller = Botmock({})
    this.bot = this.controller.spawn({ type: 'slack' })
    mentioningController(this.controller)
  })

  it('should return one of mentioning responds if user mentions bot', () => this.bot.usersInput([
    {
      type: 'direct_mention',
      messages: [
        {
          text: 'bot',
          isAssertion: true,
        },
      ],
    },
  ]).then(message => assert(responsesOnMentioning.includes(message.text))))
})
