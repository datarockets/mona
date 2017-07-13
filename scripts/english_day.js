/*
  Description:
    Prevent using of Russian words in English Thursdays at datarockets.

  Dependencies:
    * moment

  Configuration:
    ENGLISH_DAY_OF_WEEK

*/
var utils = require('./utils');

var answers = [
  'Man, it is  English Thursday Today',
  'I told you, dude, speak English pls',
  'Who can understand your Russian during our cool English day?',
  'It doesn\'t work - speak English please'
];

var isNotScreenShotName = function (message) {
  return message.text.match(/^(Снимок экрана ([0-9]|\-){10} в ([0-9]|\.){8})$/) === null
};

module.exports = function (robot) {
  robot.hear(new RegExp('[а-я]', 'i'), function(response) {
    var isItNotLegal = utils.isEnglishDay() && isNotScreenShotName(response.message);
    if (isItNotLegal) {
      response.reply(response.random(answers));
    }
  });
};
