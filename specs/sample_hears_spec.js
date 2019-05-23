const assert = require('assert');
const Botmock = require('botkit-mock');
const sampleHearsController = require('../features/sample_hears.js');

describe('Sample hears controller', () => {
  beforeEach(() => {
    this.controller = Botmock({});
    this.bot = this.controller.spawn({ type: 'slack' });
    sampleHearsController(this.controller);
  });

  it('should return `I HEARD ALL CAPS!` if user types `allcaps`', () => this.bot.usersInput([
    {
      messages: [
        {
          text: 'allcaps', isAssertion: true,
        },
      ],
    },
  ]).then(message => assert.equal(message.text, 'I HEARD ALL CAPS!')));
});
