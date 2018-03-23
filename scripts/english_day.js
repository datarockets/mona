/* eslint-disable no-useless-escape */
//
// Description:
//   Prevent using of Russian words in English Thursdays at datarockets.
//
// Dependencies:
//   * moment
//
// Configuration:
//   ENGLISH_DAY_OF_WEEK

const utils = require('./utils');

const answers = [
  'Man, it is English Thursday Today',
  'I told you, dude, speak English pls',
  'Who can understand your Russian during our cool English day?',
  'It doesn\'t work - speak English please',
];

const isNotScreenShotName = message =>
  message.text.match(/^(Снимок экрана ([0-9]|\-){10} в ([0-9]|\.){8})$/) === null;

module.exports = (robot) => {
  robot.hear(new RegExp('[а-я]', 'i'), (response) => {
    const isItNotLegal = utils.isEnglishDay() && isNotScreenShotName(response.message);
    if (isItNotLegal) {
      response.reply(response.random(answers));
    }
  });
};
